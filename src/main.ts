import { Vector3 } from "./math/Vector3";
import { Camera } from "./core/Camera";
import { RayTracer } from "./core/RayTracer";
import { Color } from "./utils/Color";
import * as fs from "fs";
import { PNG } from "pngjs";
import { loadSceneFromFile } from "./sceneLoader";

// Lade Szene + Kamera-Konfig
const { scene, cameraConfig } = loadSceneFromFile("scene.json");

// Kamera aus JSON-Daten
const width = 2000;
const height = 1600;
const aspectRatio = width / height;
const viewportHeight = cameraConfig.viewportHeight;
const viewportWidth =
    cameraConfig.viewportWidth ?? aspectRatio * viewportHeight;
const camera = new Camera(
    new Vector3(...cameraConfig.position as [number, number, number]),
    viewportWidth,
    viewportHeight,
    cameraConfig.focalLength
);
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
