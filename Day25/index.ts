import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);

function puzzleA() {
    const [cardKey, doorKey] = splitInput(inputData),
        divNum = 20201227,
        subjNum = 7;

    let cardLoopSize = 0,
        curCardVal = 1;

    do {
        cardLoopSize++;
        curCardVal *= subjNum;
        curCardVal = curCardVal % divNum;
        if (curCardVal === cardKey) { break; }
    } while (true);

    let encryptionKey = 1;
    for (let x = 0; x < cardLoopSize; x++) {
        encryptionKey *= doorKey;
        encryptionKey = encryptionKey % divNum;
    }

    return encryptionKey;
}

function splitInput(data: string): number[] {
    return data.split('\n').map(Number);
}
