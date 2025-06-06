import { PerspectiveCamera } from 'three';
import { cubeFaceColors, cubeFaces, cubeVertices } from '../constants';
import { Entity, EntityOf, EntityType } from '../types';

export interface RenderContext {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    camera: PerspectiveCamera;
    stroke: boolean;
}

const renderDictionary = {
    cube: renderCube,
    triangle: renderTriangle,
} as const satisfies {
    [P in EntityType]: (context: RenderContext, entity: EntityOf<P>) => void;
};

export const renderEntity = (context: RenderContext, entity: Entity) => {
    renderDictionary[entity.type](context, entity as any);
};

function renderCube({ canvas, ctx, camera, stroke }: RenderContext, entity: EntityOf<'cube'>) {
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
        stroke && ctx.stroke();
    }
}

function renderTriangle({ canvas, ctx, camera, stroke }: RenderContext, entity: EntityOf<'triangle'>) {
    const viewMatrix = camera.matrixWorldInverse;

    const transformed = entity.vertices.map(v => {
        const worldPoint = v.clone().applyMatrix4(entity.transform);
        const cameraSpace = worldPoint.clone().applyMatrix4(viewMatrix);
        const isBehindCamera = cameraSpace.z > -camera.near;
        const p = worldPoint.clone().project(camera);

        return { p, isBehindCamera };
    });

    if (transformed.some(v => v.isBehindCamera)) return;

    const projected = transformed.map(({ p }) => {
        const x = ((p.x + 1) / 2) * canvas.width;
        const y = ((1 - p.y) / 2) * canvas.height;
        return { x, y };
    });

    ctx.beginPath();
    projected.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = entity.color ?? '#ccc';
    ctx.fill();
    ctx.strokeStyle = '#000';
    stroke && ctx.stroke();
}
