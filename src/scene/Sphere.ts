import { Vector3 } from "../math/Vector3";
import { Ray } from "../core/Ray";
import { Material } from "../scene/Material";
import { AABB } from "../acceleration/AABB";
import { SceneObject } from "./SceneObject";

export class Sphere implements SceneObject {
    constructor(
        public center: Vector3,
        public radius: number,
        public material: Material
    ) {}

    intersect(ray: Ray): number | null {
        const oc = ray.origin.subtract(this.center);
        const a = ray.direction.dot(ray.direction);
        const b = 2.0 * oc.dot(ray.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) return null;

        const t = (-b - Math.sqrt(discriminant)) / (2.0 * a);
        return t > 0.001 ? t : null; // avoid self-intersection
    }

    getNormal(point: Vector3): Vector3 {
        return point.subtract(this.center).normalize();
    }

    getBoundingBox(): AABB {
        const r = this.radius;
        return new AABB(
            new Vector3(this.center.x - r, this.center.y - r, this.center.z - r),
            new Vector3(this.center.x + r, this.center.y + r, this.center.z + r)
        );
    }
}
