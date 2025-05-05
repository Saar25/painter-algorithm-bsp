import { Camera } from 'three';
import { cubeVertices, cubeFaces, cubeFaceColors } from '../constants';
import { EntityOf } from '../types';
import { rotateX, rotateY, project } from '../utils';

export const renderCube = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    entity: EntityOf<'cube'>,
) => {
    const transformed = cubeVertices.map(v => {
        const worldPoint = v.clone().applyMatrix4(entity.transform);

        // Step 2: Project to screen (NDC) using camera
        const ndcPoint = worldPoint.clone().project(camera); // now in [-1, 1] range

        // Step 3: Convert NDC to screen pixels
        return ndcPoint;
    });

    // Create face objects with projected points and average Z
    const faceData = cubeFaces.map((face, i) => {
        const poly3D = face.map(idx => transformed[idx]);

        const projected = poly3D.map(p => {
            const x = ((p.x + 1) / 2) * canvas.width;
            const y = ((1 - p.y) / 2) * canvas.height;
            return { x, y };
        });

        const avgZ = poly3D.reduce((sum, p) => sum + p.z, 0) / poly3D.length;
        return { projected, color: cubeFaceColors[i], z: avgZ } as const;
    });

    // Sort faces back to front
    // faceData.sort((a, b) => b.z - a.z);

    // Draw each face
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
