import { inputData } from "./data";

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        numbersToCheck = 25;

    let start = 0,
        curNum: number,
        foundSum: boolean

    do {
        let testNums = data.slice(start, start + numbersToCheck);
        
        curNum = data[start + numbersToCheck];
        foundSum = false;

        for (let i = 0; i < numbersToCheck && !foundSum; i++) {
            for (let j = i + 1; j < numbersToCheck && !foundSum; j++) {
                if (testNums[i] + testNums[j] === curNum) {
                    foundSum = true;
                }
            }
        }
        start++;
    } while (foundSum && start < data.length - numbersToCheck);

    return curNum;
}

function puzzleB() {
    const data = splitInput(inputData),
        numberToFind = puzzleA();

    let start = 0,
        end = 0,
        curSum = 0;

    do {
        curSum += data[start];
        while (curSum < numberToFind) {
            end++;
            curSum += data[end];
        }

        if (curSum === numberToFind) { break; }

        start++;
        end = start;
        curSum = 0;
    } while (curSum !== numberToFind)

    const nums = data.slice(start, end + 1),
        min = Math.min(...nums),
        max = Math.max(...nums);

    return min + max;
}

function splitInput(data: string): number[] {
    return data.split('\n')
        .map(Number);
}
