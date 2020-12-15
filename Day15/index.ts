import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    return calculateNumberForTurnX(data, 2020);
}

function puzzleB() {
    const data = splitInput(inputData);

    return calculateNumberForTurnX(data, 30 * 1000 * 1000);
}

function splitInput(data: string): number[] {
    return data.split(',')
        .map(Number);
}

function calculateNumberForTurnX(data: number[], maxTurn: number) {
    const numberTurns = new Map<number, number[]>();
    let turn = 0,
        lastNumber: number;

    do {
        turn++;

        let curNum: number;
        if (data.length) {
            curNum = data.shift();
        } else {
            const turnsSpoken = numberTurns.get(lastNumber);
            if (turnsSpoken.length > 1) {
                curNum = turnsSpoken[turnsSpoken.length - 1] - turnsSpoken[turnsSpoken.length - 2];
            } else {
                curNum = 0;
            }
        }

        if (!numberTurns.has(curNum)) {
            numberTurns.set(curNum, []);
        }
        numberTurns.get(curNum).push(turn);
        lastNumber = curNum;
    } while (turn < maxTurn);

    return lastNumber;
}
