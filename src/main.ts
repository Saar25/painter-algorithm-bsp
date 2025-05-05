import { renderCube } from './utils';
import './style.css';
import { Entity } from './types';
import { Matrix4, PerspectiveCamera, Vector3 } from 'three';
import { initCameraListeners, updateCamera } from './camera';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const camera = new PerspectiveCamera(
    80,
    canvas.width / canvas.height,
    0.1,
    1000,
);
camera.position.set(0, 0, -10);
camera.lookAt(0, 0, 0);

initCameraListeners(canvas);

const entities = [
    { type: 'cube', transform: new Matrix4().makeTranslation(2, 0, 0) },
    { type: 'cube', transform: new Matrix4().makeTranslation(-2, 0, 0) },
    { type: 'cube', transform: new Matrix4().makeTranslation(0, 2, 0) },
] as const satisfies Entity[];

let lastUpdate = performance.now();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const current = performance.now();
    updateCamera(camera, current - lastUpdate);

    entities.forEach(entity => {
        renderCube(canvas, ctx, camera, entity);
    });

    lastUpdate = current;
    requestAnimationFrame(draw);
}

draw();
