import { Vector3 } from "../math/Vector3";
import { Ray } from "../core/Ray";
import { Material } from "./Material";
import { AABB } from "../acceleration/AABB";

export class Plane {
    constructor(
        public point: Vector3,
        public normal: Vector3,
        public material: Material
    ) {}

    intersect(ray: Ray): number | null {
        const denom = this.normal.dot(ray.direction);
        if (Math.abs(denom) < 1e-6) return null; // Ray is parallel
        const t = this.point.subtract(ray.origin).dot(this.normal) / denom;
        return t > 0.001 ? t : null;
    }

    getNormal(_: Vector3): Vector3 {
        return this.normal;
    }

    getBoundingBox(): AABB {
        const inf = Number.POSITIVE_INFINITY;
        const min = new Vector3(-inf, this.point.y - 0.001, -inf);
        const max = new Vector3(inf, this.point.y + 0.001, inf);
        return new AABB(min, max);
    }
}
