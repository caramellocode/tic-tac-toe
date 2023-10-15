let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    let tableHtml = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const cellValue = fields[index];
            tableHtml += `<td onclick="handleClick(${index})">`;
            if (cellValue === 'circle') {
                tableHtml += generateCircle();
            } else if (cellValue === 'cross') {
                tableHtml += generateCross();
            }
            tableHtml += '</td>';
        }
        tableHtml += '</tr>';
    }

    tableHtml += '</table>';
    document.getElementById('content').innerHTML = tableHtml;
}

function handleClick(index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        document.querySelectorAll('#content td')[index].innerHTML = currentPlayer === 'circle' ? generateCircle() : generateCross();
        document.querySelectorAll('#content td')[index].removeAttribute('onclick');

        const winningCombination = checkForWinner();
        if (winningCombination) {
            drawWinningLine(winningCombination);
            document.querySelectorAll('#content td').forEach(cell => cell.removeAttribute('onclick'));
            return;
        }

        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

function generateCircle() {
    const namespace = "http://www.w3.org/2000/svg";
    return `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="${namespace}">
            <circle 
                cx="35" 
                cy="35" 
                r="33" 
                stroke="#00B0EF" 
                stroke-dasharray="${2 * Math.PI * 33}" 
                stroke-dashoffset="${2 * Math.PI * 33}" 
                fill="none" 
                stroke-width="4" 
                class="animated-circle"
            ></circle>
        </svg>
    `;
}

function generateCross() {
    const namespace = "http://www.w3.org/2000/svg";
    return `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="${namespace}">
            <line 
                x1="10" 
                y1="10" 
                x2="60" 
                y2="60" 
                stroke="#FFC000" 
                stroke-width="4" 
                class="animated-cross"
            ></line>
            <line 
                x1="60" 
                y1="10" 
                x2="10" 
                y2="60" 
                stroke="#FFC000" 
                stroke-width="4" 
                class="animated-cross"
            ></line>
        </svg>
    `;
}

function drawWinningLine(combination) {
    const contentElement = document.getElementById('content');
    const contentRect = contentElement.getBoundingClientRect();
    const centers = combination.map(index => {
        const cell = document.querySelectorAll('#content td')[index];
        const cellRect = cell.getBoundingClientRect();
        return {
            x: cellRect.left + cellRect.width / 2 - contentRect.left,
            y: cellRect.top + cellRect.height / 2 - contentRect.top
        };
    });
    const namespace = "http://www.w3.org/2000/svg";
    const line = `
        <svg style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">
            <line 
                x1="${centers[0].x}" 
                y1="${centers[0].y}" 
                x2="${centers[2].x}" 
                y2="${centers[2].y}" 
                stroke="#FFFFFF" 
                stroke-width="10"
            ></line>
        </svg>
    `;
    contentElement.insertAdjacentHTML('beforeend', line);
}

function checkForWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const combination of winningCombinations) {
        if (fields[combination[0]] && fields[combination[0]] === fields[combination[1]] && fields[combination[1]] === fields[combination[2]]) {
            return combination;
        }
    }
    return null;
}

function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    render();
}
