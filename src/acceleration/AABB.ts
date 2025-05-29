import { Vector3 } from "../math/Vector3";
import { Ray } from "../core/Ray";

export class AABB {
    constructor(public min: Vector3, public max: Vector3) {}

    intersects(ray: Ray): boolean {
        let tmin = (this.min.x - ray.origin.x) / ray.direction.x;
        let tmax = (this.max.x - ray.origin.x) / ray.direction.x;
        if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

        let tymin = (this.min.y - ray.origin.y) / ray.direction.y;
        let tymax = (this.max.y - ray.origin.y) / ray.direction.y;
        if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

        if ((tmin > tymax) || (tymin > tmax)) return false;

        if (tymin > tmin) tmin = tymin;
        if (tymax < tmax) tmax = tymax;

        let tzmin = (this.min.z - ray.origin.z) / ray.direction.z;
        let tzmax = (this.max.z - ray.origin.z) / ray.direction.z;
        if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

        return !(tmin > tzmax || tzmin > tmax);
    }
}
