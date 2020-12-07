import { inputData } from './data';

const SHINY_GOLD = 'shiny gold',
    NO_CONTENTS = 'no other bags.',
    bagContentsCountMap = new Map<string, number>();

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        targetColors = [SHINY_GOLD],
        colorsContainingShinyGold = new Set<string>();

    while (targetColors.length) {
        const curColor = targetColors.shift(),
            containingColors = data.filter(x => x.contents.some(y => y.color === curColor))
                .map(x => x.color);

        containingColors.forEach(x => colorsContainingShinyGold.add(x));
        targetColors.push(...containingColors);
    }

    return colorsContainingShinyGold.size;
}

function puzzleB() {
    const data = splitInput(inputData),
        bagMap = new Map<string, Bag>(data.map(x => [x.color, x])),
        shinyGoldBag = bagMap.get(SHINY_GOLD);

    return calcCountIncludingContents(shinyGoldBag, bagMap) - 1;
}

function splitInput(data: string): Bag[] {
    const rows = data.split('\n'),
        contentsRegex = /(\d+) (.+) (bags|bag)/;

    return rows.map(row => {
        const temp = row.split(' bags contain '),
            color = temp[0],
            contentsArr = temp[1].split(', '),
            contents = contentsArr.map(innerBag => {
                if (innerBag === NO_CONTENTS) {
                    return null;
                }
                const res = contentsRegex.exec(innerBag),
                    count = Number(res[1]),
                    color = res[2];
                return { count, color };
            }).filter(x => x);

        return { color, contents };
    });
}

function calcCountIncludingContents(bag: Bag, allBags: Map<string, Bag>): number {
    if (!bagContentsCountMap.has(bag.color)) {
        const contentsCount = bag.contents.reduce((acc, innerBag) => {
            return acc + (innerBag.count * calcCountIncludingContents(allBags.get(innerBag.color), allBags));
        }, 0);
        bagContentsCountMap.set(bag.color, contentsCount);
    }

    return bagContentsCountMap.get(bag.color) + 1;
}

interface Bag {
    color: string;
    contents: BagContents[];
}

interface BagContents {
    count: number;
    color: string;
}
