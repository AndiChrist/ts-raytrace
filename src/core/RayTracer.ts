import { Scene, Light } from "../scene/Scene";
import { Color } from "../utils/Color";
import { Ray } from "./Ray";
import { Vector3 } from "../math/Vector3";
import { Sphere } from "../scene/Sphere";

export class RayTracer {
    constructor(private scene: Scene) {}

    trace(ray: Ray, depth: number = 0): Color {
        if (depth > 3) return new Color(0, 0, 0);

        let closest = Infinity;
        let hitColor = new Color(0, 0, 0);
        let hitPoint: Vector3 | null = null;
        let hitNormal: Vector3 | null = null;
        let hitObject: Sphere | null = null;

        for (const obj of this.scene.objects) {
            const bbox = obj.getBoundingBox();
            if (!bbox.intersects(ray)) continue;

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

                const shadowRay = new Ray(
                    hitPoint.add(hitNormal.scale(0.001)),
                    toLight
                );

                let inShadow = false;
                for (const obj of this.scene.objects) {
                    if (obj === hitObject) continue;
                    const t = obj.intersect(shadowRay);
                    if (t !== null) {
                        inShadow = true;
                        break;
                    }
                }

                if (!inShadow) {
                    const lightPower = Math.max(0, hitNormal.dot(toLight)) * light.intensity;
                    color = color.add(hitObject.color.multiply(lightPower));
                }
            }

            if (hitObject.reflectivity > 0) {
                const reflectedDir = ray.direction.reflect(hitNormal).normalize();
                const reflectedRay = new Ray(
                    hitPoint.add(hitNormal.scale(0.001)),
                    reflectedDir
                );
                const reflectedColor = this.trace(reflectedRay, depth + 1);
                color = color.blend(reflectedColor, hitObject.reflectivity);
            }

            return color;
        }

        return hitColor;
    }
}
