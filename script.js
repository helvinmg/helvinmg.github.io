async function fetchCSVData() {
    const repoOwner = 'helvinmg';
    const repoName = 'wayanadpromisedata';
    const filePath = 'promisedata.csv';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const response = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3.raw'
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
        console.log("Failed Fetching")
    }

    const csv = await response.text();
    return csv;
}

function parseCSV(csv) {
    const lines = csv.split('\n').map(line => line.split(',')).filter(row => row.length > 1);
    return lines;
}

function createTableHeader(headerData) {
    const tableHeader = document.getElementById('table-header');
    tableHeader.innerHTML = '';
    headerData.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });
}

function createTableBody(rowData) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    rowData.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

async function loadTable() {
    try {
        const csv = await fetchCSVData();
        const data = parseCSV(csv);
        if (data && data.length > 0) {
            createTableHeader(data[0]);
            createTableBody(data.slice(1));
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

loadTable();