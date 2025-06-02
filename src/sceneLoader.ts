import * as fs from "fs";
import { Vector3 } from "./math/Vector3";
import { Color } from "./utils/Color";
import { Material } from "./scene/Material";
import { Sphere } from "./scene/Sphere";
import { Plane } from "./scene/Plane";
import { Light, Scene } from "./scene/Scene";
import { checkerTexture } from "./scene/CheckerTexture";

export function loadSceneFromFile(filePath: string): { scene: Scene; cameraConfig: any } {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const materials: { [name: string]: Material } = {};
    for (const name in data.materials) {
        const m = data.materials[name];
        materials[name] = new Material(
            new Color(...m.baseColor as [number, number, number]),
            m.reflectivity,
            m.transparency,
            m.refractiveIndex,
            m.shininess,
            m.specularStrength
        );
    }

    // Spezialmaterial für Checker
    materials["checker"] = new Material(new Color(1, 1, 1), 0, 0, 1, 32, 0.5, checkerTexture);

    const objects = data.objects.map((obj: any) => {
        const mat = materials[obj.material];
        if (obj.type === "sphere") {
            return new Sphere(new Vector3(...obj.center as [number, number, number]), obj.radius, mat);
        } else if (obj.type === "plane") {
            return new Plane(new Vector3(...obj.point as [number, number, number]), new Vector3(...obj.normal as [number, number, number]), mat);
        } else {
            throw new Error(`Unknown object type: ${obj.type}`);
        }
    });

    const lights = data.lights.map((l: any) => new Light(new Vector3(...l.position as [number, number, number]), l.intensity));

    return {
        scene: new Scene(objects, lights),
        cameraConfig: data.camera
    };
}
