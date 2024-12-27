
const debu=(inp)=>{console.log(inp);}
const matrixContainer = document.getElementById('matrix-container');
const squares = [];
const matrixNamespace = {
    createMatrix: function(rows, cols) {
        matrixContainer.style.display = 'grid';
        matrixContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        matrixContainer.style.width = '100%';
        matrixContainer.style.height = '100%';
        matrixContainer.style.gap = '1px'; // Pixel Abstand
        const totalSquares = rows * cols;

        for (let i = 0; i < totalSquares; i++) {
           
            const square = document.createElement('div');
            square.classList.add('matrix-square');
            matrixContainer.appendChild(square);
            squares.push(square);
        }
    },
    displayText: function(text) {
        squares.forEach(square => square.classList.remove('matrix-filled')); // Reset matrix

        // Zeichen zentrieren
        const totalCols = 150; // Anzahl der Spalten in der Matrix
        const textLength = text.length * 6; // Zeichenbreite inklusive Abstand
        const startCol = Math.floor((totalCols - textLength) / 2); // Berechnung der Startspalte

        // Zeichne die Zeichen auf der Matrix, beginnend in der dritten Pixelzeile
        text.split('').forEach((char, index) => {
            if (font[char]) {
                font[char].forEach((row, rowIndex) => {
                    row.split('').forEach((pixel, colIndex) => {
                        if (pixel === '1') {
                            const position = ((rowIndex + 2) * totalCols) + (startCol + (index * 6) + colIndex); // +2 Pixelzeilen nach unten verschieben
                            if (position < squares.length) {
                                squares[position].classList.add('matrix-filled');
                            }
                        }
                    });
                });
            }
        });
    }
};
matrixNamespace.createMatrix(10, 150);

