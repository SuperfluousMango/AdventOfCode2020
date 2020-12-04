import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    return calcTreesBySlope(data, 3, 1);
}

function puzzleB() {
    const data = splitInput(inputData);

    return calcTreesBySlope(data, 1, 1) *
        calcTreesBySlope(data, 3, 1) *
        calcTreesBySlope(data, 5, 1) *
        calcTreesBySlope(data, 7, 1) *
        calcTreesBySlope(data, 1, 2);
}

function splitInput(data: string) {
    return data.split('\n');
}

function calcTreesBySlope(data: string[], xDelta: number, yDelta: number): number {
    let xPos = xDelta,
        yPos = yDelta,
        treeCount = 0;

    do {
        if (data[yPos][xPos] === '#') { treeCount++; }

        xPos = (xPos + xDelta) % data[0].length;
        yPos += yDelta;
    } while (yPos < data.length);

    console.log(treeCount);
    return treeCount;
}
