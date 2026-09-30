import type { Result } from "../shared/Result.js";

export class UniversalValidators {
    static isValidStringlength(text : string, min : number, max : number) : boolean {
        if(!text) return false;
        return text.length >= min && text.length <= max;
    }
}