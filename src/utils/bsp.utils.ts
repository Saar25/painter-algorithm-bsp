import { BSPNode, EntityOf } from '../types';
import { classifyPosition, classifyTriangle } from './math.utils';
import { RenderContext, renderEntity } from './render.utils';

export const buildBSP = (entities: readonly EntityOf<'triangle'>[]): BSPNode | undefined => {
    if (entities.length === 0) return undefined;

    const [plane, ...rest] = entities;

    const front: EntityOf<'triangle'>[] = [];
    const back: EntityOf<'triangle'>[] = [];

    for (const tri of rest) {
        const side = classifyTriangle(tri, plane);

        if (side === 'front') front.push(tri);
        else if (side === 'back') back.push(tri);
        else {
            // Optional: Handle splitting coplanar triangles
            front.push(tri); // or choose where to put it
        }
    }

    return {
        plane,
        front: buildBSP(front),
        back: buildBSP(back),
    };
};

export function renderBSP(ctx: RenderContext, bspTree: BSPNode) {
    const relative = classifyPosition(ctx.camera.position, bspTree.plane);
    if (relative == 'front') {
        bspTree.back && renderBSP(ctx, bspTree.back);
        renderEntity(ctx, bspTree.plane);
        bspTree.front && renderBSP(ctx, bspTree.front);
    } else if (relative == 'back') {
        bspTree.front && renderBSP(ctx, bspTree.front);
        renderEntity(ctx, bspTree.plane);
        bspTree.back && renderBSP(ctx, bspTree.back);
    } else {
        bspTree.back && renderBSP(ctx, bspTree.back);
        bspTree.front && renderBSP(ctx, bspTree.front);
    }
}
