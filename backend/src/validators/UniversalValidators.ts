import type { Result } from "../shared/Result.js";

export class UniversalValidators {
    static isValidStringlength(text : string, min : number, max : number) : boolean {
        return text.length >= min && text.length <= max;
    }
}