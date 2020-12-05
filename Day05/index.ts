import { inputData } from './data';

const DOC_KEYS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'];

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    let maxSeatId = 0;

    data.forEach(val => {
        const seatId = getSeatId(val);
        maxSeatId = Math.max(maxSeatId, seatId);
    });

    return maxSeatId;
}

function puzzleB() {
    const data = splitInput(inputData),
        seatSet = new Set<number>();

    data.forEach(val => seatSet.add(getSeatId(val)));
    const MAX_SEAT_ID = 901; // Magic!
    for (let i = 1; i < MAX_SEAT_ID; i++) {
        if (!seatSet.has(i) && seatSet.has(i - 1) && seatSet.has(i + 1)) {
            return i;
        }
    }
}

function splitInput(data: string): string[] {
    return data.split('\n');
}

function getSeatId(row: string): number {
    let minRow = 0,
        maxRow = 127,
        minCol = 0,
        maxCol = 7;

    row.split('')
        .forEach(instr => {
            switch (instr) {
                case 'F':
                    maxRow = (minRow + maxRow - 1) / 2;
                    break;
                case 'B':
                    minRow = (maxRow + minRow + 1) / 2;
                    break;
                case 'L':
                    maxCol = (minCol + maxCol - 1) / 2;
                    break;
                case 'R':
                    minCol = (maxCol + minCol + 1) / 2;
                    break;
            }
        });

    return minRow * 8 + minCol;
}
