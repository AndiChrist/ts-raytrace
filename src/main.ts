import { Vector3 } from "./math/Vector3";
import { Camera } from "./core/Camera";
import { Scene, Light } from "./scene/Scene";
import { Sphere } from "./scene/Sphere";
import { RayTracer } from "./core/RayTracer";
import { Color } from "./utils/Color";
import * as fs from "fs";
import { PNG } from "pngjs";
import { Material } from "./scene/Material";

const width = 1200;
const height = 1000;
const aspectRatio = width / height;
const camera = new Camera(new Vector3(0, 0, 0), 2.0, 2.0 / aspectRatio, 1.0);

const glass = new Material(new Color(0.6, 0.8, 1.0), 0.1, 0.9, 1.5);
const metal = new Material(new Color(0.8, 0.8, 0.8), 0.9, 0.0);
const wood = new Material(new Color(0.5, 0.3, 0.1), 0.0, 0.0);

const redSphere = new Sphere(new Vector3(0, 0, -5), 1, glass);
const greenSphere = new Sphere(new Vector3(-1.5, 0, -4), 0.5, wood);
const blueSphere = new Sphere(new Vector3(1.5, 0, -6), 0.75, metal);

const light1 = new Light(new Vector3(5, 5, 0), 1.0);
const light2 = new Light(new Vector3(-5, 5, 0), 0.5);

const scene = new Scene([redSphere, greenSphere, blueSphere], [light1, light2]);
const tracer = new RayTracer(scene);

const png = new PNG({ width, height });

const samplesPerPixel = 4;

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        let finalColor = new Color(0, 0, 0);

        for (let s = 0; s < samplesPerPixel; s++) {
            const u = (x + Math.random()) / (width - 1);
            const v = 1 - (y + Math.random()) / (height - 1);
            const ray = camera.getRay(u, v);
            finalColor = finalColor.add(tracer.trace(ray));
        }

        finalColor = finalColor.multiply(1 / samplesPerPixel);
        const rgb = finalColor.toRGB();
        const idx = (y * width + x) * 4;
        png.data[idx] = rgb[0];
        png.data[idx + 1] = rgb[1];
        png.data[idx + 2] = rgb[2];
        png.data[idx + 3] = 255;
    }
}

png.pack().pipe(fs.createWriteStream("output.png"));
