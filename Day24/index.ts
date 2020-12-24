import { inputData } from './data';

const blackTiles = new Set<string>();

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    data.forEach(line => {
        const moves = line.split('');
        let x = 0,
            y = 0;
        do {
            let move = moves.shift();
            if (move === 'n' || move === 's') {
                move += moves.shift();
            }
            switch (move) {
                case 'w': x -= 2; break;
                case 'e': x += 2; break;
                case 'nw': x--, y--; break;
                case 'sw': x--, y++; break;
                case 'ne': x++, y--; break;
                case 'se': x++, y++; break;
            }
        } while (moves.length);
        const coords = `${x},${y}`;
        if (blackTiles.has(coords)) {
            blackTiles.delete(coords);
        } else {
            blackTiles.add(coords);
        }
    });

    return blackTiles.size;
}

function puzzleB() {
    let maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity,
            shouldBeBlack: string[] = [],
            shouldBeWhite: string[] = [];

        Array.from(blackTiles.values())
            .map(val => val.split(',').map(Number))
            .forEach(([x, y]) => {
                minX = Math.min(x, minX);
                maxX = Math.max(x, maxX);
                minY = Math.min(y, minY);
                maxY = Math.max(y, maxY);
            });

        for (let y = minY - 1; y < maxY + 2; y++) {
            let curMinX;
            if (y % 2 === 0) {
                // even row - x values are even
                curMinX = minX % 2 === 0
                    ? minX - 2
                    : minX - 1;
            } else {
                // odd row - x values are odd
                curMinX = minX % 2 === 0
                    ? minX - 1
                    : minX - 2;
            }
            for (let x = curMinX; x < maxX + 2; x += 2) {
                const coords = `${x},${y}`,
                    neighbors = getNeighbors(x, y);
                let whiteNeighbors: string[] = [],
                    blackNeighbors: string[] = [];
                neighbors.forEach(n => {
                    if (blackTiles.has(n)) {
                        blackNeighbors.push(n);
                    } else {
                        whiteNeighbors.push(n);
                    }
                });

                if (blackTiles.has(coords)) {
                    if (blackNeighbors.length === 0 || blackNeighbors.length > 2) { shouldBeWhite.push(coords); }
                } else {
                    if (blackNeighbors.length === 2) { shouldBeBlack.push(coords); }
                }
            }
        }

        shouldBeBlack.forEach(t => blackTiles.add(t));
        shouldBeWhite.forEach(t => blackTiles.delete(t));
    }

    return blackTiles.size;
}

function splitInput(data: string): string[] {
    return data.split('\n');
}

function getNeighbors(x: number, y: number): string[] {
    return [
        `${x - 2},${y}`,
        `${x - 1},${y - 1}`,
        `${x + 1},${y - 1}`,
        `${x + 2},${y}`,
        `${x + 1},${y + 1}`,
        `${x - 1},${y + 1}`
    ];
}
