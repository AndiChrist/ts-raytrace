import { Vector3 } from "../math/Vector3";
import { Color } from "../utils/Color";

export const checkerTexture = (point: Vector3): Color => {
    const scale = 8.0; // mehr Kacheln pro Einheit
    const s = Math.floor(point.x * scale);
    const t = Math.floor(point.z * scale);
    const isWhite = (s + t) % 2 === 0;
    return isWhite ? new Color(1, 1, 1) : new Color(1, 0, 0); // weiß und rot
};
