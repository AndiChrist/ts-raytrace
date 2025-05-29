import { Color } from "../utils/Color";

export class Material {
    constructor(
        public color: Color,
        public reflectivity: number = 0,
        public transparency: number = 0,
        public refractiveIndex: number = 1.0,
        public shininess: number = 32,
        public specularStrength: number = 0.5
    ) {}
}
