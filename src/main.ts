import { Matrix4, PerspectiveCamera, Vector3 } from 'three';
import { initCameraListeners, updateCamera } from './camera';
import './style.css';
import { BSPNode, Entity } from './types';
import { buildBSP, loadObjFile, renderBSP, RenderContext } from './utils';

const fpsElement = document.getElementById('fps') as HTMLSpanElement;
const frameElement = document.getElementById('frame') as HTMLSpanElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const camera = new PerspectiveCamera(80, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(0, 0, -1);
camera.lookAt(0, 0, 0);

initCameraListeners(canvas);

const entities = [
    { type: 'cube', transform: new Matrix4().makeTranslation(2, 0, 5) },
    { type: 'cube', transform: new Matrix4().makeTranslation(-2, 0, 5) },
    { type: 'cube', transform: new Matrix4().makeTranslation(0, 2, 5) },
    {
        type: 'triangle',
        transform: new Matrix4().makeTranslation(0, 2, 3),
        vertices: [new Vector3(-1, -1, -1), new Vector3(1, -1, 1), new Vector3(1, -1, -1)],
        color: '#ff0000',
    },
    {
        type: 'triangle',
        transform: new Matrix4().makeTranslation(0, 2, 3),
        vertices: [new Vector3(-1, -1, -1), new Vector3(1, -1, 1), new Vector3(-1, 1, -1)],
        color: '#ffff00',
    },
    {
        type: 'triangle',
        transform: new Matrix4().makeTranslation(0, 2, 3),
        vertices: [new Vector3(1, -1, -1), new Vector3(-0, -1, 0), new Vector3(1, 1, -1)],
        color: '#00ff00',
    },
    {
        type: 'triangle',
        transform: new Matrix4().makeTranslation(0, 2, 1),
        vertices: [new Vector3(1, -1, -1), new Vector3(1, -1, 1), new Vector3(1, 1, -1)],
        color: '#ff00ff',
    },
    {
        type: 'triangle',
        transform: new Matrix4().makeTranslation(0, 2, 1),
        vertices: [new Vector3(-1, -1, -1), new Vector3(-1, -1, 1), new Vector3(-1, 1, -1)],
        color: '#0000ff',
    },
] satisfies Entity[];

let bspTree: BSPNode | undefined = undefined;

let frameTime = 0;
let lastFrame = performance.now();

const draw = (): void => {
    const current = performance.now();
    const delta = current - lastFrame;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera(camera, delta);

    const renderContext = { canvas, ctx, camera } satisfies RenderContext;
    // entities.forEach(entity => renderEntity(renderContext, entity));
    bspTree && renderBSP(renderContext, bspTree);

    const alpha = 0.05; // smoothing factor
    frameTime = alpha * delta + (1 - alpha) * frameTime;
    const fps = 1000 / frameTime;

    frameElement.textContent = `Frame: ${frameTime.toFixed(2)}`;
    fpsElement.textContent = `Fps: ${fps.toFixed(2)}`;

    lastFrame = current;
    requestAnimationFrame(draw);
};
const bspToColors = (node: BSPNode | undefined) => {
  return !node ? undefined : {
    color: node.plane?.color,
    front: bspToColors(node.front),
    back: bspToColors(node.back),
  }
}

const main = async () => {
    const objEntities = await loadObjFile('/suzanne.obj');
    // entities.push(...objEntities);
    const triangleEntities = entities.filter(e => e.type == 'triangle');
    bspTree = buildBSP(triangleEntities);
  console.log(bspToColors(bspTree));
  

    lastFrame = performance.now();
    draw();
};
main();
