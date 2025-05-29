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
                    const diffuse = hitObject.material.color.multiply(lightPower);

                    // ⭐️ Neu: Specular highlight
                    const shininess = hitObject.material.shininess;
                    const specularStrength = hitObject.material.specularStrength;

                    const viewDir = ray.direction.scale(-1).normalize();
                    const reflectDir = toLight.reflect(hitNormal).normalize();
                    const specAngle = Math.max(0, viewDir.dot(reflectDir));
                    const specular = new Color(1, 1, 1).multiply(
                        specularStrength * Math.pow(specAngle, shininess)
                    );

                    color = color.add(diffuse).add(specular);
                }
            }

            if (hitObject.material.reflectivity > 0) {
                const reflectedDir = ray.direction.reflect(hitNormal).normalize();
                const reflectedRay = new Ray(
                    hitPoint.add(hitNormal.scale(0.001)),
                    reflectedDir
                );
                const reflectedColor = this.trace(reflectedRay, depth + 1);
                color = color.blend(reflectedColor, hitObject.material.reflectivity);
            }

            if (hitObject.material.transparency > 0) {
                const n = hitNormal;
                const ni_over_nt = 1 / hitObject.material.refractiveIndex;
                const dt = ray.direction.dot(n);
                const discriminant = 1.0 - ni_over_nt * ni_over_nt * (1 - dt * dt);

                if (discriminant > 0) {
                    const refracted = ray.direction
                        .subtract(n.scale(dt))
                        .scale(ni_over_nt)
                        .subtract(n.scale(Math.sqrt(discriminant)))
                        .normalize();

                    const refractedRay = new Ray(
                        hitPoint.add(refracted.scale(0.001)),
                        refracted
                    );
                    const refractedColor = this.trace(refractedRay, depth + 1);
                    color = color.blend(refractedColor, hitObject.material.transparency);
                }
            }

            return color;
        }

        return new Color(0, 0, 0);
    }
}
