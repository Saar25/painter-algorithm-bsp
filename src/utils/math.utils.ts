import { Vector3 } from 'three';
import { EntityOf } from '../types';

export function getPlaneFromTriangle(entity: EntityOf<'triangle'>): { normal: Vector3; d: number } {
    const [a, b, c] = entity.vertices.map(v => v.clone().applyMatrix4(entity.transform));
    const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    const d = -normal.dot(a);
    return { normal, d };
}

export function classifyTriangle(
    triangle: EntityOf<'triangle'>,
    plane: EntityOf<'triangle'>,
    epsilon = 1e-5,
): 'front' | 'back' | 'coplanar' | 'spanning' {
    const { normal, d } = getPlaneFromTriangle(plane);
    let front = 0;
    let behind = 0;

    for (const v of triangle.vertices) {
        const worldV = v.clone().applyMatrix4(triangle.transform);
        const dist = normal.dot(worldV) + d;
        if (dist > epsilon) front++;
        else if (dist < -epsilon) behind++;
    }

    if (front > 0 && behind > 0) return 'spanning';
    if (front > 0) return 'front';
    if (behind > 0) return 'back';
    return 'coplanar';
}

export function classifyPosition(vector: Vector3, plane: EntityOf<'triangle'>, epsilon = 1e-5) {
    const { normal, d } = getPlaneFromTriangle(plane);
  
    const dist = normal.dot(vector) + d;
    if (dist > epsilon) return 'front';
    if (dist < -epsilon) return 'back';
    return 'coplanar';
}
