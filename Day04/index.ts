import { inputData } from './data';

const DOC_KEYS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'];

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    return data.filter(x => {
        const keys = Object.keys(x);
        return keys.length === 8 || keys.length === 7 && !keys.includes('cid');
    }).length;
}

function puzzleB() {
    const data = splitInput(inputData);
    return data.filter(x => {
        const keys = Object.keys(x);
        return keys.length === 8 || keys.length === 7 && !keys.includes('cid');
    }).filter(docIsValid).length;
}

function splitInput(data: string): PassportData[] {
    const lines = data.split('\n');

    let records: PassportData[] = [],
        curRecord = {} as PassportData;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '') {
            records.push(curRecord);
            curRecord = {} as PassportData;
            continue;
        }

        lines[i].split(' ')
            .forEach(entry => {
                const [key, val] = entry.split(':');
                curRecord[key] = val;
            });
    }

    return records;
}

function docIsValid(doc: PassportData) {
    const hairRegex = /^#[\da-f]{6}$/;
    const validEyeColors = [
        'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'
    ];
    const pidRegex = /^\d{9}$/;

    return Number(doc.byr) >= 1920 && Number(doc.byr) <= 2002 &&
        Number(doc.iyr) >= 2010 && Number(doc.iyr) <= 2020 &&
        Number(doc.eyr) >= 2020 && Number(doc.eyr) <= 2030 &&
        (
            doc.hgt.substr(-2) === 'in'
                ? Number(doc.hgt.slice(0, -2)) >= 59 && Number(doc.hgt.slice(0, -2)) <= 76
                : Number(doc.hgt.slice(0, -2)) >= 150 && Number(doc.hgt.slice(0, -2)) <= 193
        ) &&
        hairRegex.test(doc.hcl) &&
        validEyeColors.includes(doc.ecl) &&
        pidRegex.test(doc.pid);
}

interface PassportData {
    byr: string;
    iyr: string;
    eyr: string;
    hgt: string;
    hcl: string;
    ecl: string;
    pid: string;
    cid: string;
}
