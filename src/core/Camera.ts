import { Vector3 } from "../math/Vector3";
import { Ray } from "./Ray";

export class Camera {
    origin: Vector3;
    lowerLeftCorner: Vector3;
    horizontal: Vector3;
    vertical: Vector3;

    constructor(origin: Vector3, viewportWidth: number, viewportHeight: number, focalLength: number) {
        this.origin = origin;
        this.horizontal = new Vector3(viewportWidth, 0, 0);
        this.vertical = new Vector3(0, viewportHeight, 0);
        this.lowerLeftCorner = this.origin
            .subtract(this.horizontal.scale(0.5))
            .subtract(this.vertical.scale(0.5))
            .subtract(new Vector3(0, 0, focalLength));
    }

    getRay(u: number, v: number): Ray {
        const direction = this.lowerLeftCorner
            .add(this.horizontal.scale(u))
            .add(this.vertical.scale(v))
            .subtract(this.origin);
        return new Ray(this.origin, direction.normalize());
    }
}