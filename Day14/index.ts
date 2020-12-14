import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        mem = new Map<string, string>();
    let mask: string;

    data.forEach(([target, val]) => {
        if (target === 'mask') {
            mask = val;
        } else {
            const address = target.split('[')[1].slice(0, -1),
                strVal = Number(val).toString(2).padStart(36, '0');
            let maskedVal = '';

            for (let i = 0; i < strVal.length; i++) {
                maskedVal += (mask[i] === 'X')
                    ? strVal[i]
                    : mask[i];
            }
            mem.set(address, maskedVal);
        }
    });

    return Array.from(mem.values())
        .reduce((acc, val) => acc + parseInt(val, 2), 0);
}

function puzzleB() {
    const data = splitInput(inputData),
        mem = new Map<string, number>();
    let mask: string;

    data.forEach(([target, val]) => {
        if (target === 'mask') {
            mask = val;
        } else {
            const baseAddr = Number(target.split('[')[1].slice(0, -1))
                .toString(2).padStart(36, '0'),
                addresses: string[] = [],
                queue: string[][] = [[baseAddr, mask]];

            do {
                let [addr, mask] = queue.shift(),
                    idx = mask.indexOf('X');
                if (idx >= 0) {
                    const zeroMask = mask.split(''),
                        zeroAddr = addr.split(''),
                        oneAddr = addr.split('');
                    zeroMask[idx] = '0';
                    zeroAddr.splice(idx, 1, '0');
                    oneAddr.splice(idx, 1, '1');
                    queue.push([zeroAddr.join(''), zeroMask.join('')]);
                    queue.push([oneAddr.join(''), zeroMask.join('')]);
                } else {
                    let newAddr = '';
                    for (let i = 0; i < mask.length; i++) {
                        newAddr += (mask[i] === '0') ? addr[i] : '1';
                    }
                    addresses.push(newAddr);
                }
            } while (queue.length);

            addresses.forEach(addr => mem.set(addr, Number(val)));
        }
    });

    return Array.from(mem.values())
        .reduce((acc, val) => acc + val, 0);
}

function splitInput(data: string): string[][] {
    return data.split('\n')
        .map(x => x.split(' = '));
}
