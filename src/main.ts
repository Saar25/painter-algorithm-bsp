import { PerspectiveCamera } from 'three';
import { initCameraListeners, updateCamera } from './camera';
import { config } from './config';
import { gameLoop } from './game-loop';
import { scenes } from './scene';
import './style.css';
import { BSPNode, EntityOf } from './types';
import { buildBSP, computeBSPTreeSize, printBSPTree, renderBSP, RenderContext, shuffled } from './utils';

const fpsElement = document.getElementById('fps') as HTMLSpanElement;
const frameElement = document.getElementById('frame') as HTMLSpanElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const camera = new PerspectiveCamera(80, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(0, 0, -1);
camera.lookAt(0, 0, 0);

let triangles: readonly EntityOf<'triangle'>[] | undefined = undefined;
let bspTree: BSPNode | undefined = undefined;

let frameTime = 0;

const updateMetadataDisplay = (delta: number) => {
    const alpha = 0.05; // smoothing factor
    frameTime = alpha * delta + (1 - alpha) * frameTime;
    const fps = 1000 / frameTime;

    frameElement.textContent = `Frame: ${frameTime.toFixed(2)}`;
    fpsElement.textContent = `Fps: ${fps.toFixed(2)}`;
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

    printBSPTree(bspTree);
    const size = computeBSPTreeSize(bspTree);
    console.log(`Built BSP tree with ${size} triangles`);

    initCameraListeners(canvas);
    gameLoop(frame);
};
main();
