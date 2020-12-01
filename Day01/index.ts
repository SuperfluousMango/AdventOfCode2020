import { inputData } from "./data";

const TARGET_VAL = 2020;

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        dataSet = new Set<number>(data);
        
    for (let i = 0; i < data.length; i++) {
        const cur = data[i],
            complement = TARGET_VAL - cur;
        
        if (dataSet.has(complement)) {
            return cur * complement;
        }
    }

    throw "Could not find result :(";
}

function puzzleB() {
    const data = splitInput(inputData),
        dataSet = new Set<number>(data);
    
    for (var i = 0; i < data.length; i++) {
        const cur = data[i],
            complement = TARGET_VAL - cur;
        
        for (let j = i + 1; j < data.length; j++) {
            if (data[j] >= complement) { continue; }
            const subComplement = complement - data[j];
            if (dataSet.has(subComplement)) {
                return cur * data[j] * subComplement;
            }
        }
    }
}

function splitInput(data: string): number[] {
    return data.split('\n')
        .map(x => Number(x));
}
