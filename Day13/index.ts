import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    let time = data.startTime,
        minutesToWait: number;
    do {
        for (let busTime of data.busTimes) {
            if (isNaN(busTime)) { continue; }
            if (time % busTime === 0) {
                return busTime * (time - data.startTime);
            }
        }
        time++;
    } while (!minutesToWait);
}

function puzzleB() {
    const data = splitInput(inputData),
        maxBusTime = Math.max(...data.busTimes.filter(x => !isNaN(x))),
        maxBusTimeIndex = data.busTimes.indexOf(maxBusTime),
        timeOffsets: number[][] = [];

    for (let i = 0; i < data.busTimes.length; i++) {
        if (isNaN(data.busTimes[i])) { continue; }
        timeOffsets.push([data.busTimes[i], i - maxBusTimeIndex]);
    }

    let time = 0,
        matchesPattern: boolean,
        increment: number;

    increment = timeOffsets.filter(([x, y]) => x === Math.abs(y) || y === 0)
        .map(([x, y]) => x)
        .reduce((acc, val) => acc * val, 1);

    do {
        time += increment;
        matchesPattern = true;
        for (let i = 0; i < timeOffsets.length; i++) {
            if ((time + timeOffsets[i][1]) % timeOffsets[i][0] !== 0) {
                matchesPattern = false;
                break;
            }
        }
        if (time / increment % 1000 === 0) { console.log(`${time} (${time / increment})`); }
    } while (!matchesPattern);

    return time + timeOffsets[0][1];
}

function splitInput(data: string): Schedule {
    const lines = data.split('\n');
    return {
        startTime: Number(lines[0]),
        busTimes: lines[1].split(',').map(Number)
    };
}

interface Schedule {
    startTime: number;
    busTimes: number[];
}
