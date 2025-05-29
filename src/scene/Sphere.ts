import { Vector3 } from "../math/Vector3";
import { Ray } from "../core/Ray";
import { Color } from "../utils/Color";

export class Sphere {
    constructor(
        public center: Vector3,
        public radius: number,
        public color: Color
    ) {}

    intersect(ray: Ray): number | null {
        const oc = ray.origin.subtract(this.center);
        const a = ray.direction.dot(ray.direction);
        const b = 2.0 * oc.dot(ray.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) return null;

        return (-b - Math.sqrt(discriminant)) / (2.0 * a);
    }
}
