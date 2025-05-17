import { Matrix4, Vector3 } from 'three';
import { Triangle } from '../types';

export function getPlaneFromTriangle(entity: Triangle): { normal: Vector3; d: number } {
    const [a, b, c] = entity.vertices.map(v => v.clone().applyMatrix4(entity.transform));
    const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    const d = -normal.dot(a);
    return { normal, d };
}

export function classifyTriangle<T extends Triangle>(
    triangle: T,
    plane: T,
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

export function classifyPosition(vector: Vector3, plane: Triangle, epsilon = 1e-5) {
    const { normal, d } = getPlaneFromTriangle(plane);

    const dist = normal.dot(vector) + d;
    if (dist > epsilon) return 'front';
    if (dist < -epsilon) return 'back';
    return 'coplanar';
}

function lerpVector(a: Vector3, b: Vector3, t: number): Vector3 {
    return a.clone().lerp(b, t);
}

export function splitTriangle<T extends Triangle>(
    triangle: T,
    planeEntity: T,
    epsilon = 1e-5,
): { front: T[]; back: T[] } {
    const { normal, d } = getPlaneFromTriangle(planeEntity);
    const verts = triangle.vertices.map(v => v.clone().applyMatrix4(triangle.transform));

    const distances = verts.map(v => normal.dot(v) + d);
    const sides = distances.map(dist => (dist > epsilon ? 'front' : dist < -epsilon ? 'back' : 'coplanar'));

    const frontVerts: Vector3[] = [];
    const backVerts: Vector3[] = [];

    for (let i = 0; i < 3; i++) {
        const j = (i + 1) % 3;
        const vi = verts[i];
        const vj = verts[j];
        const si = sides[i];
        const sj = sides[j];
        const di = distances[i];
        const dj = distances[j];

        if (si !== 'back') frontVerts.push(vi.clone());
        if (si !== 'front') backVerts.push(vi.clone());

        if ((si === 'front' && sj === 'back') || (si === 'back' && sj === 'front')) {
            const t = di / (di - dj);
            const intersect = lerpVector(vi, vj, t);
            frontVerts.push(intersect.clone());
            backVerts.push(intersect.clone());
        }
    }

    const toTriangles = (verts: Vector3[]): T[] => {
        const result: T[] = [];
        for (let i = 1; i < verts.length - 1; i++) {
            result.push({
                ...triangle,
                transform: new Matrix4(),
                vertices: [verts[0], verts[i], verts[i + 1]],
            });
        }
        return result;
    };

    return {
        front: toTriangles(frontVerts),
        back: toTriangles(backVerts),
    };
}

export function chooseBestSplitter<T extends Triangle>(triangles: readonly T[]): T {
    let bestTriangle = triangles[0];
    let bestScore = Infinity;

    for (const candidate of triangles) {
        let splits = 0;
        let frontCount = 0;
        let backCount = 0;

        for (const triangle of triangles) {
            const side = classifyTriangle(triangle, candidate);

            if (side === 'front') {
                frontCount++;
            } else if (side === 'back') {
                backCount++;
            } else if (side === 'spanning') {
                splits++;
            }
        }

        const balance = Math.abs(frontCount - backCount);
        const score = splits * 3 + balance; // Weighted cost function

        if (score < bestScore) {
            bestScore = score;
            bestTriangle = candidate;
        }
    }

    return bestTriangle;
}
