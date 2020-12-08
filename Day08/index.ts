import { inputData } from "./data";
import { Instruction } from "./instruction";
import { Interpreter } from "./interpreter";

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const program = splitInput(inputData),
        interpreter = new Interpreter(program),
        progPosSet = new Set<number>();

    do {
        progPosSet.add(interpreter.pos);
        interpreter.processNextInstruction();
    } while(!progPosSet.has(interpreter.pos));
    
    return interpreter.accumulator;
}

function puzzleB() {
    const program = splitInput(inputData),
        interpreter = new Interpreter(program),
        instrsToTest = program.filter(x => ['jmp', 'nop'].includes(x.instr));
    
    for (let i = 0; i < instrsToTest.length; i++) {
        const curInstr = instrsToTest[i];
        // Switch instruction type
        curInstr.instr = curInstr.instr === 'jmp'
            ? 'nop'
            : 'jmp';

        let progPosSet = new Set<number>();
        interpreter.reset();
        
        do {
            progPosSet.add(interpreter.pos);
            interpreter.processNextInstruction();
        } while(!interpreter.terminated && !progPosSet.has(interpreter.pos));

        if (interpreter.terminated) {
            return interpreter.accumulator;
        }
        
        // Unswitch instruction type
        curInstr.instr = curInstr.instr === 'jmp'
            ? 'nop'
            : 'jmp';
    }
}

function splitInput(data: string): Instruction[] {
    return data.split('\n')
        .map(line => {
            const [instr, argStr] = line.split(' '),
                arg = Number(argStr);
            return { instr, arg };
        });
}
