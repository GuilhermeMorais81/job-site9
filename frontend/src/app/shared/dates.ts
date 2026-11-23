const NEW_JOB_DAYS = 7;

export function toDate(value : Date | string | number) : Date {
    if (value instanceof Date) return value;
    const dateOnly = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
    if (dateOnly) return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
    const asNumber = Number(value);
    return new Date(Number.isNaN(asNumber) ? value : asNumber);
}

export function isRecent(value : Date | string | number, now : Date = new Date()) : boolean {
    const age = now.getTime() - toDate(value).getTime();
    return age >= 0 && age <= NEW_JOB_DAYS * 24 * 60 * 60 * 1000;
}
