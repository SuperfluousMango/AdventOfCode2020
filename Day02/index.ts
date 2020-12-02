import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    return data.filter(row => {
        const reqCharCount = row.password.split('').filter(x => x === row.reqChar).length;
        return reqCharCount >= row.num1 && reqCharCount <= row.num2;
    }).length;
}

function puzzleB() {
    const data = splitInput(inputData);

    return data.filter(row => {
        const pw = row.password,
            pos1 = row.num1 - 1,
            pos2 = row.num2 - 1,
            char = row.reqChar;
        return (pw[pos1] === char && pw[pos2] !== char) || (pw[pos1] !== char && pw[pos2] === char);
    }).length;
}

function splitInput(data: string): PasswordWithPolicy[] {
    return data.split('\n')
        .map(x => parseRow(x));
}

function parseRow(row: string): PasswordWithPolicy {
    const splitRow = row.split(' '),
        [minTimes, maxTimes] = splitRow[0].split('-').map(x => Number(x)),
        reqChar = splitRow[1][0],
        password = splitRow[2];

    return { num1: minTimes, num2: maxTimes, reqChar, password };
}

interface PasswordWithPolicy {
    reqChar: string;
    num1: number;
    num2: number;
    password: string;
}
