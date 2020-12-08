import { Instruction } from "./instruction";

export class Interpreter {
    accumulator = 0;
    pos = 0;
    terminated = false;

    constructor(private instructions: Instruction[]) { }

    processNextInstruction(): void {
        if (this.terminated) {
            return;
        }

        const curInstr = this.instructions[this.pos]; 
        if (!curInstr) {
            this.terminated = true;
            return;
        }

        switch (curInstr.instr) {
            case 'acc':
                this.accumulator += curInstr.arg;
                this.pos++;
                break;
            case 'jmp':
                this.pos += curInstr.arg;
                break;
            case 'nop':
                this.pos++;
                break;
        }
    }

    reset(): void {
        this.accumulator = 0;
        this.pos = 0;
        this.terminated = false;
    }
}
