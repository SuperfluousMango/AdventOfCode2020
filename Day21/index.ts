import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const [ingredients, allergens] = splitInput(inputData),
        allergenIngredientMaps = Array.from(allergens.values());

    let acc = 0;
    ingredients.forEach((count, ingred) => {
        if (allergenIngredientMaps.every(x => !x.has(ingred) || !x.get(ingred))) {
            acc += count;
        }
    });
    return acc;
}

function puzzleB() {
    const [_, allergens] = splitInput(inputData),
        allergenIngredientMaps = Array.from(allergens.values());
    
    allergenIngredientMaps.forEach(map => {
        Array.from(map.keys()).forEach(key => {
            if (!map.get(key)) {
                map.delete(key);
            }
        });
    });

    const canonicalAllergenMap = new Map<string, string>();

    do {
        Array.from(allergens.entries())
            .filter(([_, map]) => map.size === 1)
            .forEach(([allergen, map]) => {
                const ingred = Array.from(map.keys())[0];
                canonicalAllergenMap.set(allergen, ingred);
                allergens.forEach(map => map.delete(ingred));
                allergens.delete(allergen);
            });
    } while (allergens.size);

    return Array.from(canonicalAllergenMap.entries())
        .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
        .map(([_, ingred]) => ingred)
        .join(',');
}

function splitInput(data: string): [Map<string, number>, Map<string, Map<string, boolean>>] {
    const lines = data.split('\n'),
        ingredMap = new Map<string, number>(),
        allergenMap = new Map<string, Map<string, boolean>>();

    lines.forEach(line => {
        const splitLine = line.split(' (contains '),
            ingredients = splitLine[0].split(' '),
            allergens = splitLine[1].slice(0, -1).split(', ');
        ingredients.forEach(x => ingredMap.set(x, (ingredMap.get(x) ?? 0) + 1));
        allergens.forEach(x => {
            if (allergenMap.has(x)) {
                // We can ignore any ingredient we already looked at that's not on this list
                const allergenIngredientMap = allergenMap.get(x);
                Array.from(allergenIngredientMap.entries())
                    .forEach(([ingred, _]) => {
                        if (!ingredients.includes(ingred)) {
                            allergenIngredientMap.set(ingred, false);
                        }
                    });
            } else {
                // We need to add all these ingredients to the list as possible allergen-carriers
                const allergenIngredientMap = new Map<string, boolean>(ingredients.map(x => ([x, true])));
                allergenMap.set(x, allergenIngredientMap);
            }
        });
    });

    return [ingredMap, allergenMap];
}
