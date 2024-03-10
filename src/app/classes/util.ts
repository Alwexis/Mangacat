export class Util {
    static formatNumber(n: number) {
        if (n < 1000) return n
        if (n < 1000000) return (n / 1000).toFixed(1) + 'K'
        if (n < 1000000000) return (n / 1000000).toFixed(2) + 'M'
        return (n / 1000000000).toFixed(1) + 'B'
    }

    static toCamelCase(t: string) {
        return t.replace(/\b\w/g, (match) => match.toUpperCase()).replace(/\s+/g, '');
    }
}
