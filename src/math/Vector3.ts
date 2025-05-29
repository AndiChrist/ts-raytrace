export class Vector3 {
    constructor(public x: number, public y: number, public z: number) {}

    add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    scale(s: number): Vector3 {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    normalize(): Vector3 {
        const len = this.length();
        return this.scale(1 / len);
    }

    reflect(normal: Vector3): Vector3 {
        return this.subtract(normal.scale(2 * this.dot(normal)));
    }
}