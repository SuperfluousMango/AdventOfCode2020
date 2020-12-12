import { inputData } from './data';

enum Direction {
    North = 'N',
    East = 'E',
    South = 'S',
    West = 'W',
    Left = 'L',
    Right = 'R',
    Forward = 'F'
}

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    let x = 0,
        y = 0,
        dir = Direction.East;

    data.forEach(instr => {
        if (instr.dir === Direction.Forward) { instr.dir = dir; }
        switch (instr.dir) {
            case Direction.North:
                y -= instr.amt;
                break;
            case Direction.East:
                x += instr.amt;
                break;
            case Direction.South:
                y += instr.amt;
                break;
            case Direction.West:
                x -= instr.amt;
                break;
            case Direction.Left:
            case Direction.Right:
                dir = turn(dir, instr.dir, instr.amt);
                break;
        }
    });

    return Math.abs(x) + Math.abs(y);
}

function puzzleB() {
    let data = splitInput(inputData);

    let x = 0,
        y = 0,
        waypointX = 10,
        waypointY = -1,
        dir = Direction.East;

    data.forEach(instr => {
        switch (instr.dir) {
            case Direction.Forward:
                x += waypointX * instr.amt;
                y += waypointY * instr.amt;
                break;
            case Direction.North:
                waypointY -= instr.amt;
                break;
            case Direction.East:
                waypointX += instr.amt;
                break;
            case Direction.South:
                waypointY += instr.amt;
                break;
            case Direction.West:
                waypointX -= instr.amt;
                break;
            case Direction.Left:
            case Direction.Right:
                [waypointX, waypointY] = rotateWaypoint(waypointX, waypointY, instr.dir, instr.amt);
                break;
            default:
                throw "asdf";
        }
    });

    return Math.abs(x) + Math.abs(y);
}

function splitInput(data: string): Instruction[] {
    return data.split('\n')
        .map(x => ({
            dir: x[0],
            amt: Number(x.slice(1))
        }));
}

function turn(curDir: Direction, newDir: Direction.Left | Direction.Right, degrees: number) {
    if (newDir === Direction.Left) { degrees = 360 - degrees; }

    while (degrees > 0) {
        switch (curDir) {
            case Direction.North: curDir = Direction.East; break;
            case Direction.West: curDir = Direction.North; break;
            case Direction.South: curDir = Direction.West; break;
            case Direction.East: curDir = Direction.South; break; 
        } 

        degrees -= 90;
    }

    return curDir;
}

function rotateWaypoint(x: number, y: number, dir: Direction.Left | Direction.Right, degrees: number): [number, number] {
    if (dir === Direction.Left) { degrees = 360 - degrees; }

    switch (degrees) {
        case 90:
            return [-y, x];
        case 180:
            return [-x, -y];
        case 270:
            return [y, -x];
        default:
            throw "qwer";
    }
}

interface Instruction {
    dir: string;
    amt: number;
}
