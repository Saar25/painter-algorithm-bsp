import { BSPNode, EntityOf } from '../types';
import { classifyPosition, classifyTriangle, splitTriangle } from './math.utils';
import { RenderContext, renderEntity } from './render.utils';

export const buildBSP = (triangles: readonly EntityOf<'triangle'>[]): BSPNode | undefined => {
    if (triangles.length === 0) return undefined;

    const [plane, ...rest] = triangles;

    const front: EntityOf<'triangle'>[] = [];
    const back: EntityOf<'triangle'>[] = [];
    const coplanar: EntityOf<'triangle'>[] = [plane];

    for (const triangle of rest) {
        const side = classifyTriangle(triangle, plane);

        if (side === 'front') {
            front.push(triangle);
        } else if (side === 'back') {
            back.push(triangle);
        } else if (side === 'coplanar') {
            coplanar.push(triangle);
        } else {
            const { front: f, back: b } = splitTriangle(triangle, plane);
            front.push(...f);
            back.push(...b);
        }
    }

    return { plane, triangles: coplanar, front: buildBSP(front), back: buildBSP(back) };
};

export function renderBSP(ctx: RenderContext, bspTree: BSPNode) {
    const relative = classifyPosition(ctx.camera.position, bspTree.plane);
    if (relative == 'front') {
        bspTree.back && renderBSP(ctx, bspTree.back);
        bspTree.triangles.forEach(t => renderEntity(ctx, t));
        bspTree.front && renderBSP(ctx, bspTree.front);
    } else if (relative == 'back') {
        bspTree.front && renderBSP(ctx, bspTree.front);
        bspTree.triangles.forEach(t => renderEntity(ctx, t));
        bspTree.back && renderBSP(ctx, bspTree.back);
    } else {
        bspTree.back && renderBSP(ctx, bspTree.back);
        bspTree.front && renderBSP(ctx, bspTree.front);
    }
}
