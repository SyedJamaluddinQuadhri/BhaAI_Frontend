export function isToday(value: Date): boolean { const now=new Date(); return value.toDateString()===now.toDateString(); }
