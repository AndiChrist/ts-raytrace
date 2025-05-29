export class Color {
    constructor(public r: number, public g: number, public b: number) {}

    multiply(s: number): Color {
        return new Color(this.r * s, this.g * s, this.b * s);
    }

    toRGB(): [number, number, number] {
        return [
            Math.min(255, Math.max(0, Math.floor(this.r * 255))),
            Math.min(255, Math.max(0, Math.floor(this.g * 255))),
            Math.min(255, Math.max(0, Math.floor(this.b * 255)))
        ];
    }
}
