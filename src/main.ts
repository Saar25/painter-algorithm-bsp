import { PerspectiveCamera } from 'three';
import { initCameraListeners, updateCamera } from './camera';
import { scenes } from './scene';
import './style.css';
import { BSPNode } from './types';
import { buildBSP, renderBSP, RenderContext } from './utils';

const fpsElement = document.getElementById('fps') as HTMLSpanElement;
const frameElement = document.getElementById('frame') as HTMLSpanElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const camera = new PerspectiveCamera(80, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(0, 0, -1);
camera.lookAt(0, 0, 0);

initCameraListeners(canvas);

let bspTree: BSPNode | undefined = undefined;

let frameTime = 0;
let lastFrame = performance.now();

const draw = (): void => {
    const current = performance.now();
    const delta = current - lastFrame;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera(camera, delta);

    const renderContext = { canvas, ctx, camera } satisfies RenderContext;
    bspTree && renderBSP(renderContext, bspTree);

    const alpha = 0.05; // smoothing factor
    frameTime = alpha * delta + (1 - alpha) * frameTime;
    const fps = 1000 / frameTime;

    frameElement.textContent = `Frame: ${frameTime.toFixed(2)}`;
    fpsElement.textContent = `Fps: ${fps.toFixed(2)}`;

    lastFrame = current;
    requestAnimationFrame(draw);
};

const bspToColors = (node: BSPNode | undefined): any => {
    return (
        node && {
            color: node.plane?.color,
            front: bspToColors(node.front),
            back: bspToColors(node.back),
        }
    );
};

const main = async () => {
    const entities = await scenes.suzanne();
    bspTree = buildBSP(entities);

    console.log(bspToColors(bspTree));

    lastFrame = performance.now();
    draw();
};
main();
