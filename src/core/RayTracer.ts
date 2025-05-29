import { Scene, Light } from "../scene/Scene";
import { Color } from "../utils/Color";
import { Ray } from "./Ray";
import { Vector3 } from "../math/Vector3";

export class RayTracer {
    constructor(private scene: Scene) {}

    trace(ray: Ray): Color {
        let closest = Infinity;
        let hitColor = new Color(0, 0, 0);
        let hitPoint: Vector3 | null = null;
        let hitNormal: Vector3 | null = null;
        let hitObject: any = null;

        for (const obj of this.scene.objects) {
            const t = obj.intersect(ray);
            if (t !== null && t < closest) {
                closest = t;
                hitPoint = ray.origin.add(ray.direction.scale(t));
                hitNormal = obj.getNormal(hitPoint);
                hitColor = obj.color;
                hitObject = obj;
            }
        }

        if (hitPoint && hitNormal && hitObject) {
            let color = new Color(0, 0, 0);
            for (const light of this.scene.lights) {
                const toLight = light.position.subtract(hitPoint).normalize();
                const lightPower = Math.max(0, hitNormal.dot(toLight)) * light.intensity;
                color = color.add(hitObject.color.multiply(lightPower));
            }
            return color;
        }

        return hitColor;
    }
}
