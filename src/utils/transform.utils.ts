import { Point } from '../types';

export function rotateY(p: Point, angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: p.x * cos - p.z * sin,
        y: p.y,
        z: p.x * sin + p.z * cos,
    };
}

export function rotateX(p: Point, angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos,
    };
}
