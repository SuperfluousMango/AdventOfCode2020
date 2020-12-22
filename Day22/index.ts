import { inputData } from './data';

const PLAYER_1_RECURSION_WIN = Infinity;

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const [playerHand, crabHand] = splitInput(inputData);

    do {
        const playerCard = playerHand.shift(),
            crabCard = crabHand.shift();
        if (playerCard > crabCard) {
            playerHand.push(Math.max(playerCard, crabCard), Math.min(playerCard, crabCard));
        } else {
            crabHand.push(Math.max(playerCard, crabCard), Math.min(playerCard, crabCard));
        }
    } while (playerHand.length && crabHand.length);

    const winningHand = playerHand.length
        ? playerHand
        : crabHand;

    return winningHand.reduce((acc, val, idx) => acc + (val * (winningHand.length - idx)), 0);
}

function puzzleB() {
    const [playerHand, crabHand] = splitInput(inputData),
        winner = playRecursiveGame(playerHand, crabHand),
        winningHand = winner === PLAYER_1_RECURSION_WIN
            ? playerHand
            : playerHand.length > crabHand.length
                ? playerHand
                : crabHand;
    
    return winningHand.reduce((acc, val, idx) => acc + (val * (winningHand.length - idx)), 0);
}

function splitInput(data: string): [number[], number[]] {
    const [playerHand, crabHand] = data.split('\n\n').map(lines => lines.split('\n').slice(1).map(Number));
    return [playerHand, crabHand];
}

function playRecursiveGame(playerHand: number[] , crabHand: number[], recursionLevel = 0): number {
    const handArrangements = new Set<string>();
    let winner: number;
    do {
        winner = playRound(playerHand, crabHand, handArrangements, recursionLevel);
    } while (playerHand.length > 0 && crabHand.length > 0 && winner < PLAYER_1_RECURSION_WIN);

    return winner === PLAYER_1_RECURSION_WIN
        ? 0
        : winner;
}

function playRound(playerHand: number[], crabHand: number[], handArrangements: Set<string>, recursionLevel: number): number {
    const handArrangement = playerHand.join(',') + '/' + crabHand.join(',');
    if (handArrangements.has(handArrangement)) {
        return PLAYER_1_RECURSION_WIN;
    }
    handArrangements.add(handArrangement);

    const playerCard = playerHand.shift(),
        crabCard = crabHand.shift();

    let winner: number;
    if (playerHand.length >= playerCard && crabHand.length >= crabCard) {
        winner = playRecursiveGame(playerHand.slice(0, playerCard), crabHand.slice(0, crabCard), recursionLevel + 1);
    } else {
        winner = playerCard > crabCard
            ? 0
            : 1;
    }

    const winningHand = [playerHand, crabHand][winner],
        cards = [playerCard, crabCard];
    winningHand.push(cards[winner], cards[1 - winner]);
    return winner;
}
