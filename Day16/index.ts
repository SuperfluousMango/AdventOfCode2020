import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const { rules, nearbyTickets } = splitInput(inputData),
        invalidValues: number[] = [],
        rulesList = Array.from(rules.values());

    nearbyTickets.forEach(ticket => {
        ticket.forEach(num => {
            if (!rulesList.some(constraints => constraints.some(({min, max}) => num >= min && num <= max))) {
                invalidValues.push(num);
            }
        });
    });

    return invalidValues.reduce((acc, val) => acc + val, 0);
}

function puzzleB() {
    const { rules, yourTicket, nearbyTickets } = splitInput(inputData),
        validTickets: number[][] = [],
        rulesList = Array.from(rules.values());

    nearbyTickets.forEach(ticket => {
        let isValid = true;
        ticket.forEach(num => {
            if (!rulesList.some(constraints => constraints.some(({min, max}) => num >= min && num <= max))) {
                isValid = false;
            }
        });
        if (isValid) { validTickets.push(ticket); }
    });

    const rulesByPosition = new Map<number, Set<string>>();
    for (let i = 0; i < yourTicket.length; i++) {
        rulesByPosition.set(i, new Set(rules.keys()));
    }

    validTickets.forEach(ticket => {
        ticket.forEach((num, idx) => {
            rules.forEach((constraints, ruleName) => {
                if (!constraints.some(({min, max}) => num >= min && num <= max)) {
                    if (rulesByPosition.get(idx).size === 1) { debugger; }
                    rulesByPosition.get(idx).delete(ruleName);
                }
            });
        });
    });

    do {
        rulesByPosition.forEach((ruleNameSet, _) => {
            if (ruleNameSet.size === 1) {
                const ruleName = Array.from(ruleNameSet)[0];
                Array.from(rulesByPosition.values())
                    .filter(x => x.size > 1 && x.has(ruleName))
                    .forEach(x => x.delete(ruleName));
            }
        });
    } while (Array.from(rulesByPosition.values()).some(x => x.size > 1));

    const rulesWeCareAbout = Array.from(rulesByPosition)
        .map(([pos, ruleNameSet]) => [pos, Array.from(ruleNameSet)[0]])
        .filter(([_, ruleName]: [number, string]) => ruleName.startsWith('departure'))
        .map(([pos, _]: [number, string]) => pos);

    return rulesWeCareAbout.reduce((acc, pos) => acc * yourTicket[pos], 1);
}

function splitInput(data: string): TicketInfo {
    const lines = data.split('\n'),
        ticketInfo: TicketInfo = {
            rules: new Map<string, MinMax[]>(),
            yourTicket: [],
            nearbyTickets: []
        };
    let line: string;

    do {
        line = lines.shift();
        if (line) {
            const split = line.split(': '),
                name = split[0],
                constraints = split[1].split(' or ');
            ticketInfo.rules.set(name, []);
            constraints.forEach(constraint => {
                const [min, max] = constraint.split('-').map(Number);
                ticketInfo.rules.get(name).push({ min, max });
            });
        }
    } while (line);

    lines.shift(); // skip "your ticket:" line
    lines.shift().split(',')
        .map(Number)
        .forEach(x => ticketInfo.yourTicket.push(x));

    lines.shift(); // skip empty line
    lines.shift(); // skip "nearby tickets:" line

    do {
        line = lines.shift();
        ticketInfo.nearbyTickets.push(
            line.split(',').map(Number)
        );
    } while (lines.length)

    return ticketInfo;
}

interface TicketInfo {
    rules: Map<string, MinMax[]>;
    yourTicket: number[];
    nearbyTickets: number[][]
}

interface MinMax {
    min: number;
    max: number;
}
