import { Sphere } from "./Sphere";
import { Vector3 } from "../math/Vector3";

export class Light {
    constructor(public position: Vector3, public intensity: number) {}
}

export class Scene {
    constructor(public objects: Sphere[], public lights: Light[]) {}
}
