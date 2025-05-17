import { BSPNode, EntityOf, Triangle } from '../types';
import { classifyPosition, classifyTriangle, splitTriangle } from './math.utils';
import { RenderContext, renderEntity } from './render.utils';

/**
 * implementation of the 3D-BSP algorithm
 */
export const buildBSP = <T extends Triangle>(triangles: readonly T[]): BSPNode<T> | undefined => {
    if (triangles.length === 0) return undefined;

    const [plane, ...rest] = triangles;
    // const plane = chooseBestSplitter(triangles);
    // const rest = triangles.filter(t => t !== plane);

    const front: T[] = [];
    const back: T[] = [];
    const coplanar: T[] = [plane];

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
export function renderBSP(ctx: RenderContext, bspNode: BSPNode<EntityOf<'triangle'>>) {
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

export const computeBSPTreeSize = (bspNode: BSPNode<EntityOf<'triangle'>> | undefined): number => {
    if (!bspNode) return 0;
    const front = computeBSPTreeSize(bspNode.front);
    const back = computeBSPTreeSize(bspNode.back);
    return bspNode.triangles.length + front + back;
};

export const printBSPTree = (bspNode: BSPNode<EntityOf<'triangle'>> | undefined): void => {
    const bspToColors = (node: BSPNode<EntityOf<'triangle'>> | undefined): any =>
        node && {
            color: node.plane?.color,
            front: bspToColors(node.front),
            back: bspToColors(node.back),
        };
    console.log(JSON.stringify(bspToColors(bspNode), null, 4));
};
