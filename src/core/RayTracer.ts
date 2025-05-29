import { Scene } from "../scene/Scene";
import { Color } from "../utils/Color";
import { Ray } from "./Ray";
import { Sphere } from "../scene/Sphere";

export class RayTracer {
    constructor(private scene: Scene) {}

    trace(ray: Ray): Color {
        let closest = Infinity;
        let hitColor = new Color(0, 0, 0);

        for (const obj of this.scene.objects) {
            const t = obj.intersect(ray);
            if (t !== null && t < closest) {
                closest = t;
                hitColor = obj.color;
            }
        }

        return hitColor;
    }
}
