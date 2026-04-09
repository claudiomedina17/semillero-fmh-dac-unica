async function fetchSheetCSV(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const text = await response.text();
        return parseCSV(text);
    } catch (e) {
        console.warn('Failed to fetch CSV:', e.message);
        return null;
    }
}

function parseCSV(text) {
    const lines = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
            current += ch;
        } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
            if (current.trim()) lines.push(current);
            current = '';
            if (ch === '\r' && text[i + 1] === '\n') i++;
        } else {
            current += ch;
        }
    }
    if (current.trim()) lines.push(current);

    if (lines.length < 2) return [];

    const headers = splitCSVRow(lines[0]);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = splitCSVRow(lines[i]);
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h.trim()] = (values[idx] || '').trim();
        });
        rows.push(obj);
    }

    return rows;
}

function splitCSVRow(row) {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === '"') {
            if (inQuotes && row[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            fields.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    fields.push(current);
    return fields;
}
