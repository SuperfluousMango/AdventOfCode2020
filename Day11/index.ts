import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    let seats = splitInput(inputData);

    let newSeats: string[][],
        seatsChanged: boolean;

    do {
        seatsChanged = false;
        newSeats = seats.map(row => [...row]);

        for (let y = 0; y < seats.length; y++) {
            for (let x = 0; x < seats[0].length; x++) {
                const seat = seats[y][x];
                let nearbyFilledSeats: string[];

                switch (seat) {
                    case '.':
                        newSeats[y][x] = '.';
                        break;
                    case 'L':
                        nearbyFilledSeats = getNearbySeats(seats, x, y)
                            .filter(x => x === '#');
                        newSeats[y][x] = nearbyFilledSeats.length > 0 ? 'L' : '#';
                        break;
                    case '#':
                        nearbyFilledSeats = getNearbySeats(seats, x, y)
                            .filter(x => x === '#');
                        newSeats[y][x] = nearbyFilledSeats.length >= 4 ? 'L' : '#';
                        break;
                }
                seatsChanged = seatsChanged || seats[y][x] !== newSeats[y][x];
            }
        }
        seats = newSeats;
    } while (seatsChanged);

    return seats.flat().filter(x => x === '#').length;
}

function puzzleB() {
    let seats = splitInput(inputData);

    let newSeats: string[][],
        seatsChanged: boolean;

    do {
        seatsChanged = false;
        newSeats = seats.map(row => [...row]);

        for (let y = 0; y < seats.length; y++) {
            for (let x = 0; x < seats[0].length; x++) {
                const seat = seats[y][x];
                let visibleFilledSeats: string[];

                switch (seat) {
                    case '.':
                        newSeats[y][x] = '.';
                        break;
                    case 'L':
                        visibleFilledSeats = getVisibleSeats(seats, x, y)
                            .filter(x => x === '#');
                        newSeats[y][x] = visibleFilledSeats.length > 0 ? 'L' : '#';
                        break;
                    case '#':
                        visibleFilledSeats = getVisibleSeats(seats, x, y)
                            .filter(x => x === '#');
                        newSeats[y][x] = visibleFilledSeats.length >= 5 ? 'L' : '#';
                        break;
                }
                seatsChanged = seatsChanged || seats[y][x] !== newSeats[y][x];
            }
        }
        seats = newSeats;
    } while (seatsChanged);

    return seats.flat().filter(x => x === '#').length;
}

function splitInput(data: string): string[][] {
    return data.split('\n')
        .map(row => row.split(''));
}

function getNearbySeats(seats: string[][], x: number, y: number): string[] {
    const result: string[] = [],
        minY = Math.max(y - 1, 0),
        maxY = Math.min(y + 1, seats.length - 1),
        minX = Math.max(x - 1, 0),
        maxX = Math.min(x + 1, seats[0].length - 1);

    for (let curY = minY; curY <= maxY; curY++) {
        for (let curX = minX; curX <= maxX; curX++) {
            if (curY === y && curX === x) { continue; }
            result.push(seats[curY][curX]);
        }
    }

    return result.filter(seat => seat !== '.');
}

function getVisibleSeats(seats: string[][], x: number, y: number): string[] {
    const result: string[] = [];

    let nwSeat = lookForSeat(seats, x, y, curX => curX - 1, curY => curY - 1);
    if (nwSeat) { result.push(nwSeat); }

    let nSeat = lookForSeat(seats, x, y, curX => curX, curY => curY - 1);
    if (nSeat) { result.push(nSeat); }

    let neSeat = lookForSeat(seats, x, y, curX => curX + 1, curY => curY - 1);
    if (neSeat) { result.push(neSeat); }

    let eSeat = lookForSeat(seats, x, y, curX => curX + 1, curY => curY);
    if (eSeat) { result.push(eSeat); }

    let seSeat = lookForSeat(seats, x, y, curX => curX + 1, curY => curY + 1);
    if (seSeat) { result.push(seSeat); }

    let sSeat = lookForSeat(seats, x, y, curX => curX, curY => curY + 1);
    if (sSeat) { result.push(sSeat); }

    let swSeat = lookForSeat(seats, x, y, curX => curX - 1, curY => curY + 1);
    if (swSeat) { result.push(swSeat); }

    let wSeat = lookForSeat(seats, x, y, curX => curX - 1, curY => curY);
    if (wSeat) { result.push(wSeat); }

    return result;
}

function lookForSeat(seats: string[][], x: number, y: number, xFunc: (curX: number) => number, yFunc: (curY: number) => number): string | null {
    x = xFunc(x);
    y = yFunc(y);

    while (x >= 0 && y >= 0 && x < seats[0].length && y < seats.length) {
        if (seats[y][x] !== '.') {
            return seats[y][x];
        }

        x = xFunc(x);
        y = yFunc(y);
    }

    return null;
}
