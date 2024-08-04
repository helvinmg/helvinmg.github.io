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
        row.forEach((cell, index) => {
            const td = document.createElement('td');
            if (!cell) {
                td.textContent = 'NA';
            } else if (index === 4) { 
                const link = document.createElement('a');
                link.href = cell;
                link.textContent = cell;
                link.target = '_blank';
                td.appendChild(link);
            } else if (index === 5) { 
                const button = document.createElement('button');
                button.textContent = 'View';
                button.className = 'btn btn-primary';
                button.onclick = () => showImage(cell);
                td.appendChild(button);
            } else {
                td.textContent = cell;
            }
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function showImage(url) {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = url;
    $('#imageModal').modal('show');
}


function showImage(url) {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = url;
    $('#imageModal').modal('show');
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