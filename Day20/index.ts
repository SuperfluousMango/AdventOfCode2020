import { inputData } from './data';

enum Edges {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3,
    TopFlip = 4,
    BottomFlip = 5,
    LeftFlip = 6,
    RightFlip = 7
}

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        tileConnections = matchUpTiles(data);

    return Array.from(tileConnections.entries())
        .filter(([_, conns]) => conns.size === 2)
        .reduce((acc, [num, _]) => acc * num, 1);
}

function puzzleB() {
    var x = logTiles;
    const data = splitInput(inputData),
        tileConnections = matchUpTiles(data),
        arrangedTiles = arrangeTiles(data, tileConnections),
        assembledTiles = assembleTiles(arrangedTiles),
        hashTileCount = assembledTiles.join('').split('').filter(x => x === '#').length,
        seaMonsterLength = 20;

    let seaMonsterCount = 0,
        attemptCount = 0,
        curTileView = assembledTiles;
    do {
        for (let i = 1; i < curTileView.length - 1; i++) {
            for (let j = 0; j < curTileView[i].length - seaMonsterLength; j++) {
                if (curTileView[i - 1][j + 18] === '#' &&
                    curTileView[i][j] === '#' &&
                    curTileView[i].slice(j + 5, j + 7).split('').every(x => x === '#') &&
                    curTileView[i].slice(j + 11, j + 13).split('').every(x => x === '#') &&
                    curTileView[i].slice(j + 17, j + 20).split('').every(x => x === '#') &&
                    curTileView[i + 1][j + 1] === '#' &&
                    curTileView[i + 1][j + 4] === '#' &&
                    curTileView[i + 1][j + 7] === '#' &&
                    curTileView[i + 1][j + 10] === '#' &&
                    curTileView[i + 1][j + 13] === '#' &&
                    curTileView[i + 1][j + 16] === '#'
                ) {
                    seaMonsterCount++;
                    j += seaMonsterLength;
                }
            }
        }

        attemptCount++;
        if (attemptCount === 4) {
            curTileView = flipArrayHorizontally(curTileView.map(x => x.split(''))).map(x => x.join(''));
        } else {
            curTileView = rotateArrayClockwise(curTileView.map(x => x.split(''))).map(x => x.join(''));
        }
    } while (attemptCount < 8);

    return hashTileCount - seaMonsterCount * 15;
}

function splitInput(data: string): Map<number, string[][]> {
    const tiles = data.split('\n\n'),
        tileMap = new Map<number, string[][]>();
    
    tiles.forEach(tile => {
        const tileArr = tile.split('\n'),
            tileNum = Number(tileArr.shift().split(' ')[1].slice(0, -1));
        tileMap.set(tileNum, tileArr.map(x => x.split('')));
    });

    return tileMap;
}

function getTileEdges(tile: string[][]): string[] {
    const leftEdge = tile.map(x => x[0]),
        rightEdge = tile.map(x => x[x.length - 1]);

    return [
        tile[0].join(''),                               // top edge
        tile[tile.length - 1].join(''),                 // bottom edge
        leftEdge.join(''),                              // left edge
        rightEdge.join(''),                             // right edge
        [...tile[0]].reverse().join(''),                // top edge w/horizontal flip
        [...tile[tile.length - 1]].reverse().join(''),  // bottom edge w/horizontal flip
        leftEdge.reverse().join(''),                    // left edge w/vertical flip
        rightEdge.reverse().join('')                    // right edge w/vertical flip
    ];
}

function matchUpTiles(data: Map<number, string[][]>): Map<number, Set<number>> {
    const tileNums = Array.from(data.keys()),
        tileConnections = new Map<number, Set<number>>();

    Array.from(data.entries())
        .forEach(([tileNum, tile], idx) => {
            if (!tileConnections.has(tileNum)) {
                tileConnections.set(tileNum, new Set<number>());
            }

            const edges = getTileEdges(tile);
            for (let i = 0; i < tileNums.length; i++) {
                if (i === tileNum) { continue; }
                const compNum = tileNums[i];
                if (compNum === tileNum) { continue; }

                if (!tileConnections.has(compNum)) {
                    tileConnections.set(compNum, new Set<number>());
                }

                const compEdges = getTileEdges(data.get(compNum));
                if (edges.some(edge => compEdges.includes(edge))) {
                    tileConnections.get(tileNum).add(compNum);
                    tileConnections.get(compNum).add(tileNum);
                    continue;
                }
            }
        });

    return tileConnections;
}

function arrangeTiles(data: Map<number, string[][]>, tileConnections: Map<number, Set<number>>): string[][][][] {
    const orderedTiles: string[][][][] = [];
    
    // Orient the first corner tile so it's the upper left
    const firstCornerNum = Array.from(tileConnections.entries())
            .filter(([_, conns]) => conns.size === 2)[0][0];
    orientUpperLeftCorner(firstCornerNum, tileConnections, data);

    const startTile = data.get(firstCornerNum);

    let tileRow: string[][][] = [],
        rowStartTileNum: number,
        rowStartTile: string[][],
        curTileNum: number,
        connTileNum: number;

    tileRow.push(startTile);
    rowStartTileNum = firstCornerNum;
    rowStartTile = startTile;
    connTileNum = firstCornerNum;
    
    do {
        do {
            curTileNum = connTileNum;
            const curTile = tileRow[tileRow.length - 1],
                tileEdges = getTileEdges(curTile),
                rightEdge = tileEdges[Edges.Right],
                connTileNums = Array.from(tileConnections.get(curTileNum)),
                [conn1Edges, conn2Edges] = getConnectingTileEdges(curTileNum, tileConnections, data);
            let connEdge: Edges;

            if (conn1Edges?.includes(rightEdge)) {
                connTileNum = connTileNums[0];
                connEdge = conn1Edges.indexOf(rightEdge);
            } else if (conn2Edges?.includes(rightEdge)) {
                connTileNum = connTileNums[1];
                connEdge = conn2Edges.indexOf(rightEdge);
            } else {
                // reached end of row
                break;
            }
            data.set(connTileNum, orientTileToLeftEdge(data.get(connTileNum), connEdge));
            tileRow.push(data.get(connTileNum));
            // We've already used this tile, so it doesn't need to connect to any other tiles
            Array.from(tileConnections.get(curTileNum)).forEach(tileNum => {
                tileConnections.get(tileNum).delete(curTileNum);
            });
            tileConnections.get(curTileNum).delete(connTileNum);
        } while (true);

        // Need to connect tile to bottom edge of previous row's start
        orderedTiles.push(tileRow);
        tileRow = [];

        const tileEdges = getTileEdges(rowStartTile),
            bottomEdge = tileEdges[Edges.Bottom],
            connEdges = getConnectingTileEdges(rowStartTileNum, tileConnections, data)[0]; // There should only be one unused connection to the start of the previous row
        if (!connEdges) {
            // ran out of tiles
            break;
        }

        let connEdge = connEdges.indexOf(bottomEdge);
        connTileNum = Array.from(tileConnections.get(rowStartTileNum))[0]; // Only one unused connecting tile, etc
        data.set(connTileNum, orientTileToTopEdge(data.get(connTileNum), connEdge));
        tileRow.push(data.get(connTileNum));
        tileConnections.get(rowStartTileNum).delete(connTileNum);
        tileConnections.get(connTileNum).delete(rowStartTileNum);
        rowStartTile = data.get(connTileNum);
        rowStartTileNum = connTileNum;
    } while (true);

    return orderedTiles;
}

function assembleTiles(data: string[][][][]): string[] {
    const lines: string[] = [];
    
    data.forEach(tileRow => {
        tileRow.forEach(tile => {
            tile.shift();
            tile.pop();
            tile.forEach(line => {
                line.shift();
                line.pop();
            });
        });

        for (let i = 0; i < tileRow[0].length; i++) {
            let lineStr = '';
            tileRow.forEach(tile => lineStr += tile[i].join(''));
            lines.push(lineStr);
        }
    });
    return lines;
}

function orientUpperLeftCorner(cornerTileNum: number, tileConnections: Map<number, Set<number>>, data: Map<number, string[][]>) {
    const [conn1Edges, conn2Edges] = getConnectingTileEdges(cornerTileNum, tileConnections, data);

    let matchedEdge1: number,
        matchedEdge2: number;
    do {
        let cornerTile = data.get(cornerTileNum);
        let tileEdges = getTileEdges(cornerTile);
        matchedEdge1 = tileEdges.findIndex(x => conn1Edges.includes(x));
        switch (matchedEdge1) {
            case Edges.Right:
            case Edges.Bottom:
                break;
            case Edges.RightFlip:
                data.set(cornerTileNum, flipArrayVertically(cornerTile));
                continue;
            case Edges.BottomFlip:
                data.set(cornerTileNum, flipArrayHorizontally(cornerTile));
                continue;
            case Edges.Top:
            case Edges.Left:
            case Edges.TopFlip:
            case Edges.LeftFlip:
                data.set(cornerTileNum, rotateArrayClockwise(cornerTile));
                continue;
        }

        matchedEdge2 = tileEdges.findIndex(x => conn2Edges.includes(x));
        switch (matchedEdge2) {
            case Edges.Right:
            case Edges.Bottom:
                break;
            case Edges.RightFlip:
                data.set(cornerTileNum, flipArrayVertically(cornerTile));
                break;
            case Edges.BottomFlip:
                data.set(cornerTileNum, flipArrayHorizontally(cornerTile));
                break;
            case Edges.Top:
            case Edges.Left:
            case Edges.TopFlip:
            case Edges.LeftFlip:
                data.set(cornerTileNum, rotateArrayClockwise(cornerTile));
                break;
        }
    } while (![matchedEdge1, matchedEdge2].includes(Edges.Right) || ![matchedEdge1, matchedEdge2].includes(Edges.Bottom));
}

function getConnectingTileEdges(tileNum: number, tileConnections: Map<number, Set<number>>, data: Map<number, string[][]>): string[][] {
    const connTileNums = Array.from(tileConnections.get(tileNum)),
        connTiles = connTileNums.map(x => data.get(x));

    return connTiles.map(getTileEdges);
}

function rotateArrayClockwise(arr: string[][], quarterTurns = 1): string[][] {
    let newArr: string[][] = [];

    for (let i = 0; i < quarterTurns; i++) {
        for (let j = 0; j < arr.length; j++) {
            newArr.push(arr.map(x => x[j]).reverse());
        }
        arr = newArr;
        newArr = [];
    }

    return arr;
}

function flipArrayVertically(arr: string[][]): string[][] {
    return arr.reverse();
}

function flipArrayHorizontally(arr: string[][]): string[][] {
    return arr.map(x => x.reverse());
}

function orientTileToLeftEdge(tile: string[][], edgeToAlignLeft: Edges): string[][] {
    switch (edgeToAlignLeft) {
        case Edges.Left:
            return tile;
        case Edges.Bottom:
            return rotateArrayClockwise(tile);
        case Edges.RightFlip:
            return rotateArrayClockwise(tile, 2);
        case Edges.TopFlip:
            return rotateArrayClockwise(tile, 3);
        case Edges.LeftFlip:
            return flipArrayVertically(tile);
        case Edges.BottomFlip:
            return rotateArrayClockwise(flipArrayHorizontally(tile));
        case Edges.Right:
            return rotateArrayClockwise(flipArrayVertically(tile), 2);
        case Edges.Top:
            return rotateArrayClockwise(flipArrayHorizontally(tile), 3);
    }
}

function orientTileToTopEdge(tile: string[][], edgeToAlignUp: Edges): string[][] {
    switch (edgeToAlignUp) {
        case Edges.Top:
            return tile;
        case Edges.LeftFlip:
            return rotateArrayClockwise(tile);
        case Edges.BottomFlip:
            return rotateArrayClockwise(tile, 2);
        case Edges.Right:
            return rotateArrayClockwise(tile, 3);
        case Edges.TopFlip:
            return flipArrayVertically(tile);
        case Edges.Left:
            return rotateArrayClockwise(flipArrayVertically(tile));
        case Edges.Bottom:
            return rotateArrayClockwise(flipArrayHorizontally(tile), 2);
        case Edges.RightFlip:
            return rotateArrayClockwise(flipArrayVertically(tile), 3);
    }
}

function logTiles(...tiles: string[][][]) {
    let tileStr = '';
    for (let i = 0; i < tiles[0].length; i++) {
        tiles.forEach(tile => tileStr += tile[i].join('') + '   ');
        tileStr += '\n';
    }
    console.log(tileStr)
}
