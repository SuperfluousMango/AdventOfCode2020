import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    let oneJolt = 0,
        threeJolt = 0;

    data.unshift(0); // joltage rating of the outlet;

    for (let i = 1; i < data.length; i++) {
        if (data[i] - data[i - 1] === 1) {
            oneJolt++;
        } else {
            threeJolt++;
        }
    }

    threeJolt++; // Joltage difference between final adapter and device

    return oneJolt * threeJolt;
}

function puzzleB() {
    const data = splitInput(inputData),
        maxAdapterRating = Math.max(...data),
        connectionMap = new Map<number, number[]>(),
        connectionCount = new Map<number, number>();

    data.unshift(0); // joltage rating of the outlet
    data.push(maxAdapterRating + 3); // joltage rating of the device

    for (let i = 0; i < data.length; i++) {
        connectionMap.set(data[i], []);
        for (let j = i + 1; j <= i + 3 && j < data.length; j++) {
            if (data[j] <= data[i] + 3) {
                connectionMap.get(data[i]).push(data[j]);
            } else {
                break;
            }
        }
    }

    for (let i = data.length - 2; i >= 0; i--) {
        const adapterRating = data[i],
            connections = connectionMap.get(adapterRating),
            cumulativeConnCount = Math.max(connections.reduce((acc, val) => {
                return acc + (connectionCount.get(val) ?? 0);
            }, 0), 1);

        connectionCount.set(adapterRating, cumulativeConnCount);
    }

    return connectionCount.get(0);
}

function splitInput(data: string): number[] {
    return data.split('\n')
        .map(Number)
        .sort((a, b) => a - b);
}
