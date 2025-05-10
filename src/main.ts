import { PerspectiveCamera } from 'three';
import { initCameraListeners, updateCamera } from './camera';
import { config } from './config';
import { gameLoop } from './game-loop';
import { scenes } from './scene';
import './style.css';
import { BSPNode, EntityOf } from './types';
import { buildBSP, computeBSPTreeSize, printBSPTree, renderBSP, RenderContext, shuffled } from './utils';

const metadataElement = document.getElementById('metadata') as HTMLDivElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const camera = new PerspectiveCamera(80, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(0, 0, -1);
camera.lookAt(0, 0, 0);

let triangles: readonly EntityOf<'triangle'>[] | undefined = undefined;
let bspTree: BSPNode | undefined = undefined;
let bspTreeSize: number | undefined = undefined;

let frameTime = 0;

const computeFrameTime = (delta: number) => {
    const alpha = 0.05; // smoothing factor
    return (frameTime = alpha * delta + (1 - alpha) * frameTime);
};

const updateMetadata = (metadata: Record<string, string>) => {
    metadataElement.innerHTML = '';
    const children = Object.entries(metadata).map(([key, value]) => {
        const element = document.createElement('span');
        element.innerText = `${key}: ${value}`;
        return element;
    });
    metadataElement.replaceChildren(...children);
};
const updateMetadataDisplay = (delta: number) => {
    const frameTime = computeFrameTime(delta);
    const fps = 1000 / frameTime;

    updateMetadata({
        Fps: fps.toFixed(2),
        'Frame Time': frameTime.toFixed(2),
        Triangles: (bspTreeSize ?? 0).toString(),
    });
};

const draw = (delta: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera(camera, delta);

    const renderContext = { canvas, ctx, camera } satisfies RenderContext;
    bspTree && renderBSP(renderContext, bspTree);
    // triangles?.forEach(t => renderEntity(renderContext, t));
};

const frame = (delta: number) => {
    draw(delta);
    updateMetadataDisplay(delta);
};

const main = async () => {
    triangles = shuffled(await scenes[config.scene]());
    bspTree = buildBSP(triangles);
    bspTreeSize = computeBSPTreeSize(bspTree);

    printBSPTree(bspTree);

    initCameraListeners(canvas);
    gameLoop(frame);
};
main();
