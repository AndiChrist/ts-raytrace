import { Vector3 } from "../math/Vector3";
import { Color } from "../utils/Color";

export type TextureFunction = (point: Vector3) => Color;

export class Material {
    constructor(
        public baseColor: Color,
        public reflectivity: number = 0,
        public transparency: number = 0,
        public refractiveIndex: number = 1.0,
        public shininess: number = 32,
        public specularStrength: number = 0.5,
        public texture?: TextureFunction
    ) {}

    getColor(point: Vector3): Color {
        return this.texture ? this.texture(point) : this.baseColor;
    }
}
