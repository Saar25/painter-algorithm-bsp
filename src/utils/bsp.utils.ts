import { BSPNode, EntityOf } from '../types';
import { classifyPosition, classifyTriangle, splitTriangle } from './math.utils';
import { RenderContext, renderEntity } from './render.utils';

/**
 * implementation of the 3D-BSP algorithm
 */
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

/**
 * implementation of the Painter algorithm
 */
export function renderBSP(ctx: RenderContext, bspNode: BSPNode) {
    const cameraSide = classifyPosition(ctx.camera.position, bspNode.plane);
    if (cameraSide == 'front') {
        bspNode.back && renderBSP(ctx, bspNode.back);
        bspNode.triangles.forEach(t => renderEntity(ctx, t));
        bspNode.front && renderBSP(ctx, bspNode.front);
    } else if (cameraSide == 'back') {
        bspNode.front && renderBSP(ctx, bspNode.front);
        bspNode.triangles.forEach(t => renderEntity(ctx, t));
        bspNode.back && renderBSP(ctx, bspNode.back);
    } else {
        bspNode.back && renderBSP(ctx, bspNode.back);
        bspNode.front && renderBSP(ctx, bspNode.front);
    }
}

export const computeBSPTreeSize = (bspNode: BSPNode | undefined): number => {
    if (!bspNode) return 0;
    const front = computeBSPTreeSize(bspNode.front);
    const back = computeBSPTreeSize(bspNode.back);
    return bspNode.triangles.length + front + back;
};

export const printBSPTree = (bspNode: BSPNode | undefined): void => {
    const bspToColors = (node: BSPNode | undefined): any =>
        node && {
            color: node.plane?.color,
            front: bspToColors(node.front),
            back: bspToColors(node.back),
        };
    console.log(JSON.stringify(bspToColors(bspNode), null, 4));
};
