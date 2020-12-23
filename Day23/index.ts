import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const cups = splitInput(inputData),
        maxCupNum = Math.max(...cups);
    let curCupNum = cups[0],
        curCupPos = cups.indexOf(curCupNum);

    for (let i = 0; i < 100; i++) {
        const pickedUpCups = cups.splice(curCupPos + 1, 3);
        while (pickedUpCups.length < 3) {
            pickedUpCups.push(cups.shift());
        }
        
        let nextCupNum = curCupNum,
            nextCupPos: number;
        do {
            nextCupNum--;
            if (nextCupNum < 1) {
                nextCupNum = maxCupNum;
            }
            nextCupPos = cups.indexOf(nextCupNum);
        } while (nextCupPos === -1);

        cups.splice(nextCupPos + 1, 0, ...pickedUpCups);

        curCupPos = cups.indexOf(curCupNum) + 1;
        if (curCupPos >= cups.length) {
            curCupPos = 0;
        }
        curCupNum = cups[curCupPos];
    }

    const indexOf1 = cups.indexOf(1),
        cupsAfter1 = cups.splice(indexOf1 + 1, 99999);
    cups.unshift(...cupsAfter1)
    cups.pop(); // drop the trailing 1 cup

    return cups.join('');
}

function puzzleB() {
    const maxCupNum = 1000 * 1000,
        cups = new Map<number, number>(),
        inputCups = splitInput(inputData);

    for (let i = 1; i <= maxCupNum; i++) {
        if (i < inputCups.length) {
            cups.set(inputCups[i - 1], inputCups[i]);
        } else if (i === inputCups.length) {
            cups.set(inputCups[i - 1], i + 1);
        } else if (i < maxCupNum) {
            cups.set(i, i + 1);
        } else {
            cups.set(i, inputCups[0]);
        }
    }

    const numMoves = 10 * 1000 * 1000;
    let curCupNum = inputCups[0];

    for (let i = 0; i < numMoves; i++) {
        const pickedUpCups: number[] = [];
        pickedUpCups.push(cups.get(curCupNum));
        pickedUpCups.push(cups.get(pickedUpCups[0]));
        pickedUpCups.push(cups.get(pickedUpCups[1]));
        cups.set(curCupNum, cups.get(pickedUpCups[2]));
        
        let nextCupNum = curCupNum;
        do {
            nextCupNum--;
            if (nextCupNum < 1) {
                nextCupNum = maxCupNum;
            }
        } while (!cups.has(nextCupNum) || pickedUpCups.includes(nextCupNum));
        
        cups.set(pickedUpCups[2], cups.get(nextCupNum));
        cups.set(pickedUpCups[1], pickedUpCups[2]);
        cups.set(pickedUpCups[0], pickedUpCups[1]);
        cups.set(nextCupNum, pickedUpCups[0]);

        curCupNum = cups.get(curCupNum);
    }

    const num1 = cups.get(1),
        num2 = cups.get(num1);
    return num1 * num2;
}

function splitInput(data: string): number[] {
    return data.split('').map(Number);
}
