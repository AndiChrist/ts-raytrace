import { Ray } from "../core/Ray";
import { Vector3 } from "../math/Vector3";
import { AABB } from "../acceleration/AABB";
import { Material } from "./Material";

export interface SceneObject {
    material: Material;
    intersect(ray: Ray): number | null;
    getNormal(point: Vector3): Vector3;
    getBoundingBox(): AABB;
}
