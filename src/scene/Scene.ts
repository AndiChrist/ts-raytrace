import { Sphere } from "./Sphere";
import { Vector3 } from "../math/Vector3";
import { SceneObject } from "./SceneObject";

export class Light {
    constructor(public position: Vector3, public intensity: number) {}
}

export class Scene {
    constructor(public objects: SceneObject[], public lights: Light[]) {}
}
