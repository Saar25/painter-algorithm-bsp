import { Matrix4, PerspectiveCamera, Vector3 } from 'three';
import { initCameraListeners, updateCamera } from './camera';
import './style.css';
import { Entity } from './types';
import { loadObjFile, RenderContext, renderEntity } from './utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const camera = new PerspectiveCamera(80, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(0, 0, -10);
camera.lookAt(0, 0, 0);

initCameraListeners(canvas);

const entities = [
    { type: 'cube', transform: new Matrix4().makeTranslation(2, 0, 0) },
    { type: 'cube', transform: new Matrix4().makeTranslation(-2, 0, 0) },
    { type: 'cube', transform: new Matrix4().makeTranslation(0, 2, 0) },
    {
        type: 'triangle',
        transform: new Matrix4().makeTranslation(0, 2, 3),
        vertices: [new Vector3(-1, -1, 0), new Vector3(1, -1, 0), new Vector3(0, 1, 0)],
    },
] satisfies Entity[];

let lastUpdate = performance.now();

const draw = (): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const current = performance.now();
    updateCamera(camera, current - lastUpdate);

    const renderContext = { canvas, ctx, camera } satisfies RenderContext;
    entities.forEach(entity => renderEntity(renderContext, entity));

    lastUpdate = current;
    requestAnimationFrame(draw);
};

const main = async () => {
    const objEntities = await loadObjFile('/suzanne.obj');
    entities.push(...objEntities);

    draw();
};
main();
