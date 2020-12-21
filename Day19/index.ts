import { inputData } from './data';

const ruleHash = new Map<number, string>();

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const [rules, messages] = splitInput(inputData),
        rulesRegex = new RegExp(`^${rules}\$`);
    
    return messages.filter(x => rulesRegex.test(x))
        .length;
}

function puzzleB() {
    const [rules, messages] = splitInput(inputData, true),
        rulesRegex = new RegExp(`^${rules}\$`);
    
    return messages.filter(x => rulesRegex.test(x))
        .length;
}

function splitInput(data: string, makeAnnoyingSubstitutions = false): [string, string[]] {
    const lines = data.split('\n'),
        rules = new Map<number, string>();

    let line: string;
    do {
        line = lines.shift();
        if (line) {
            const [ruleNum, ruleText] = line.split(': ');
            rules.set(Number(ruleNum), ruleText);
        }
    } while(line);

    if (makeAnnoyingSubstitutions) {
        rules.set(8, '42 | 42 8');
        rules.set(11, '42 31 | 42 11 31');
    }

    return [processRules(rules), lines];
}

function processRules(rules: Map<number, string>): string {
    ruleHash.clear();
    return processRule(0, rules);
}

function processRule(ruleNum: number, rules: Map<number, string>, rule11Recursions = 0): string {
    if (ruleHash.has(ruleNum)) { return ruleHash.get(ruleNum); }

    const ruleText = rules.get(ruleNum),
        rule = ruleText[0] === '"'
            ? ruleText.slice(1, -1)
            : ruleText.split(' | ')
                .map(x => x.split(' ').map(Number));

    if ('string' === typeof rule) {
        ruleHash.set(ruleNum, rule);
        return rule;
    }

    // Deal with annoying recursive rules for part 2
    if (ruleNum === 8 && rule.some(x => x.includes(8))) {
        const rule42 = processRule(42, rules),
            rule8 = `(${rule42})+`;
        ruleHash.set(8, rule8);
        return rule8;
    }

    const listOfTexts = rule.map(rulesInOption => {
        const optionTexts = rulesInOption.map(r => {
            if (ruleNum === 11 && r === 11) {
                return rule11Recursions === 10
                    ? ''
                    : processRule(r, rules, rule11Recursions + 1);
            }
            return processRule(r, rules);
        });
        return optionTexts.join('');
    });

    const matches = '(' + listOfTexts.flat().join('|') + ')';
    ruleHash.set(ruleNum, matches);
    return matches;
}
