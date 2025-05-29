import { Vector3 } from "../math/Vector3";
import { Ray } from "./Ray";

export class Camera {
    constructor(public origin: Vector3, public viewportWidth: number, public viewportHeight: number, public focalLength: number) {}

    getRay(u: number, v: number): Ray {
        const horizontal = new Vector3(this.viewportWidth, 0, 0);
        const vertical = new Vector3(0, this.viewportHeight, 0);
        const lowerLeftCorner = this.origin
            .subtract(horizontal.scale(0.5))
            .subtract(vertical.scale(0.5))
            .subtract(new Vector3(0, 0, this.focalLength));

        const direction = lowerLeftCorner
            .add(horizontal.scale(u))
            .add(vertical.scale(v))
            .subtract(this.origin);

        return new Ray(this.origin, direction.normalize());
    }
}
