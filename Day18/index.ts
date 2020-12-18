import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);
    return data.reduce((acc, line) => acc + calcLine(line), 0);
}

function puzzleB() {
    const data = splitInput(inputData);
    return data.reduce((acc, line) => acc + calcLine(line, true), 0);
}

function splitInput(data: string): string[] {
    return data.split('\n');
}

function calcLine(line: string, usePrecedence = false): number {
    while (line.includes('(')) {
        const leftParenPos = line.lastIndexOf('('),
            rightParenPos = line.indexOf(')', leftParenPos),
            segment = line.slice(leftParenPos, rightParenPos + 1).slice(1, -1),
            val = usePrecedence ? calcSegmentWithPrecedence(segment) : calcSegment(segment);
        line = line.substring(0, leftParenPos) + val.toString() + line.substring(rightParenPos + 1);
    }

    return usePrecedence
        ? calcSegmentWithPrecedence(line)
        : calcSegment(line);
}

function calcSegment(block: string): number {
    let acc = 0,
        curOp = '+', // Start out by adding the initial number to zero
        pos = 0,
        curItem = '',
        curVal;

    do {
        if (!curOp) {
            curOp = block[pos];
            pos += 2; // move pos past current char and space
        }

        do {
            curItem += block[pos++];
        } while(block[pos] !== ' ' && pos < block.length);
        
        pos++; // skip space
        curVal = Number(curItem);

        acc = curOp === '+'
            ? acc + curVal
            : acc * curVal;

        curOp = '';
        curItem = '';
        curVal = 0;
    } while (pos < block.length);

    return acc;
}

function calcSegmentWithPrecedence(block: string): number {
    const arr = block.split(' ');

    for (let i = arr.length; i > 0; i--) {
        if (arr[i] === '+') {
            arr.splice(i - 1, 3, 
                [arr[i - 1], arr[i + 1]].map(Number).reduce((acc, val) => acc + val, 0).toString()
            );
        }
    }

    return arr.filter(x => x !== '*')
        .reduce((acc, val) => acc * Number(val), 1);
}
