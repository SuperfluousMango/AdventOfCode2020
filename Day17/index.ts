import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    let data = split3dInput(inputData);

    for (let i = 0; i < 6; i++) {
        data = process3dMap(data);
    }

    return Array.from(data.values())
        .filter(x => x === '#')
        .length;
}

function puzzleB() {
    let data = split4dInput(inputData);

    for (let i = 0; i < 6; i++) {
        data = process4dMap(data);
    }

    return Array.from(data.values())
        .filter(x => x === '#')
        .length;
}

function split3dInput(data: string): Map<string, string> {
    const rows = data.split('\n'),
        map = new Map<string, string>(),
        z = 0;

    rows.forEach((row, y) => {
        row.split('').forEach((cell, x) => {
            map.set(`${x},${y},${z}`, cell);
        });
    });

    return map;
}

function process3dMap(map: Map<string, string>): Map<string, string> {
    const newMap = new Map<string, string>(),
        { minX, minY, minZ, maxX, maxY, maxZ } = Array.from(map.keys())
            .map(key => key.split(',').map(Number))
            .reduce((acc, [x, y, z]) => {
                acc.minX = Math.min(acc.minX, x);
                acc.minY = Math.min(acc.minY, y);
                acc.minZ = Math.min(acc.minZ, z);
                acc.maxX = Math.max(acc.maxX, x);
                acc.maxY = Math.max(acc.maxY, y);
                acc.maxZ = Math.max(acc.maxZ, z);
                return acc;
            }, { minX: Infinity, minY: Infinity, minZ: Infinity, maxX: -Infinity, maxY: -Infinity, maxZ: -Infinity });
    
    for (let x = minX - 1; x <= maxX + 1; x++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
            for (let z = minZ - 1; z <= maxZ + 1; z++) {
                newMap.set(`${x},${y},${z}`, process3dCell(x, y, z, map));
            }
        }
    }

    return newMap;
}

function process3dCell(x: number, y: number, z: number, map: Map<string, string>): string {
    const curCell = map.get(`${x},${y},${z}`) ?? '.',
        activeNeighborCount = get3dNeighbors(x, y, z, map)
            .filter(x => x === '#')
            .length;
    
    if (curCell === '#') {
        return activeNeighborCount === 2 || activeNeighborCount === 3
            ? '#'
            : '.';
    } else {
        return activeNeighborCount === 3
            ? '#'
            : '.';
    }
}

function get3dNeighbors(x: number, y: number, z: number, map: Map<string, string>): string[] {
    const neighbors: string[] = [];

    for (let xDelta = -1; xDelta <= 1; xDelta++) {
        for (let yDelta = -1; yDelta <= 1; yDelta++) {
            for (let zDelta = -1; zDelta <= 1; zDelta++) {
                if (xDelta === 0 && yDelta === 0 && zDelta === 0) { continue; }
                neighbors.push(map.get(`${x + xDelta},${y + yDelta},${z + zDelta}`) ?? '.');                
            }
        }
    }

    return neighbors;
}

function split4dInput(data: string): Map<string, string> {
    const rows = data.split('\n'),
        map = new Map<string, string>(),
        z = 0,
        w = 0;

    rows.forEach((row, y) => {
        row.split('').forEach((cell, x) => {
            map.set(`${x},${y},${z},${w}`, cell);
        });
    });

    return map;
}

function process4dMap(map: Map<string, string>): Map<string, string> {
    const newMap = new Map<string, string>(),
        { minX, minY, minZ, minW, maxX, maxY, maxZ, maxW } = Array.from(map.keys())
            .map(key => key.split(',').map(Number))
            .reduce((acc, [x, y, z, w]) => {
                acc.minX = Math.min(acc.minX, x);
                acc.minY = Math.min(acc.minY, y);
                acc.minZ = Math.min(acc.minZ, z);
                acc.minW = Math.min(acc.minW, w);
                acc.maxX = Math.max(acc.maxX, x);
                acc.maxY = Math.max(acc.maxY, y);
                acc.maxZ = Math.max(acc.maxZ, z);
                acc.maxW = Math.max(acc.maxW, w);
                return acc;
            }, { minX: Infinity, minY: Infinity, minZ: Infinity, minW: Infinity, maxX: -Infinity, maxY: -Infinity, maxZ: -Infinity, maxW: -Infinity });
    
    for (let x = minX - 1; x <= maxX + 1; x++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
            for (let z = minZ - 1; z <= maxZ + 1; z++) {
                for (let w = minW - 1; w <= maxW + 1; w++) {
                    newMap.set(`${x},${y},${z},${w}`, process4dCell(x, y, z, w, map));
                }
            }
        }
    }

    return newMap;
}

function process4dCell(x: number, y: number, z: number, w: number, map: Map<string, string>): string {
    const curCell = map.get(`${x},${y},${z},${w}`) ?? '.',
        activeNeighborCount = get4dNeighbors(x, y, z, w, map)
            .filter(x => x === '#')
            .length;
    
    if (curCell === '#') {
        return activeNeighborCount === 2 || activeNeighborCount === 3
            ? '#'
            : '.';
    } else {
        return activeNeighborCount === 3
            ? '#'
            : '.';
    }
}

function get4dNeighbors(x: number, y: number, z: number, w: number, map: Map<string, string>): string[] {
    const neighbors: string[] = [];

    for (let xDelta = -1; xDelta <= 1; xDelta++) {
        for (let yDelta = -1; yDelta <= 1; yDelta++) {
            for (let zDelta = -1; zDelta <= 1; zDelta++) {
                for (let wDelta = -1; wDelta <= 1; wDelta++) {
                    if (xDelta === 0 && yDelta === 0 && zDelta === 0 && wDelta === 0) { continue; }
                    neighbors.push(map.get(`${x + xDelta},${y + yDelta},${z + zDelta},${w + wDelta}`) ?? '.');                
                }
            }
        }
    }

    return neighbors;
}
