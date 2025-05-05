import { PerspectiveCamera } from 'three';
import { cubeFaceColors, cubeFaces, cubeVertices } from '../constants';
import { EntityOf } from '../types';

export const renderCube = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    camera: PerspectiveCamera,
    entity: EntityOf<'cube'>,
) => {
    const viewMatrix = camera.matrixWorldInverse;
    const transformed = cubeVertices.map(v => {
        const worldPoint = v.clone().applyMatrix4(entity.transform);
        const cameraSpace = worldPoint.clone().applyMatrix4(viewMatrix);
        const isBehindCamera = cameraSpace.z > -camera.near;
        const p = worldPoint.clone().project(camera);

        return { p, isBehindCamera };
    });

    const faceData = cubeFaces.flatMap((face, i) => {
        // If any point is behind camera — skip face
        if (face.some(idx => transformed[idx].isBehindCamera)) {
            return [];
        }

        const projected = face.map(idx => {
            const { p } = transformed[idx];
            const x = ((p.x + 1) / 2) * canvas.width;
            const y = ((1 - p.y) / 2) * canvas.height;
            return { x, y };
        });

        return [{ projected, color: cubeFaceColors[i] }] as const;
    });

    // Sort faces back to front
    // faceData.sort((a, b) => b.z - a.z);

    for (const face of faceData) {
        ctx.beginPath();
        face.projected.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = face.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }
};
