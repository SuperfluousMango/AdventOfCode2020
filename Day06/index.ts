import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        sets: Set<string>[] = [];

    let set = new Set<string>();

    data.forEach(row => {
        if (row) {
            row.split('').forEach(x => set.add(x));
        } else {
            sets.push(set);
            set = new Set<string>();
        }
    });

    return sets.reduce((acc, val) => acc + val.size, 0);
}

function puzzleB() {
    const data = splitInput(inputData);

    let map = new Map<string, number>(),
        peopleInGroup = 0,
        validQuestions = 0;

    data.forEach(row => {
        if (row) {
            row.split('')
                .forEach(x => {
                    if (!map.has(x)) { map.set(x, 0); }
                    map.set(x, map.get(x) + 1);
                });
            peopleInGroup++;
        } else {
            validQuestions += Array.from(map.values())
                .filter(val => val === peopleInGroup)
                .length;
            peopleInGroup = 0;
            map = new Map<string, number>();
        }
    });

    return validQuestions;
}

function splitInput(data: string): string[] {
    return data.split('\n');
}
