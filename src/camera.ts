import { PerspectiveCamera, Vector3 } from 'three';

let yaw = 0;
let pitch = 0;

let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;

const pressedKeys = new Set<string>();

export const initCameraListeners = (canvas: HTMLCanvasElement) => {
    const observedKeys = ['w', 'a', 's', 'd', ' ', 'Shift'] as const;

    window.addEventListener('keydown', e => {
        if (observedKeys.some(key => key === e.key)) {
            pressedKeys.add(e.key);
        }
    });

    window.addEventListener('keyup', e => {
        if (observedKeys.some(key => key === e.key)) {
            pressedKeys.delete(e.key);
        }
    });

    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        const sensitivity = 0.005;
        yaw -= dx * sensitivity;
        pitch -= dy * sensitivity;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    });
};

export const updateCamera = (camera: PerspectiveCamera, deltaTime: number) => {
    const direction = new Vector3(
        Math.cos(pitch) * Math.sin(yaw),
        Math.sin(pitch),
        Math.cos(pitch) * Math.cos(yaw),
    );

    const right = new Vector3()
        .crossVectors(direction, new Vector3(0, 1, 0))
        .normalize();
    const forward = new Vector3().copy(direction).setY(0).normalize();

    const speed = 0.005 * deltaTime;
    const movement = { z: 0, x: 0, y: 0 };

    if (pressedKeys.has('w')) movement.z += 1;
    if (pressedKeys.has('a')) movement.x -= 1;
    if (pressedKeys.has('s')) movement.z -= 1;
    if (pressedKeys.has('d')) movement.x += 1;
    if (pressedKeys.has(' ')) movement.y += 1;
    if (pressedKeys.has('Shift')) movement.y -= 1;

    if (movement.z) {
        camera.position.add(forward.clone().multiplyScalar(movement.z * speed));
    }
    if (movement.x) {
        camera.position.add(right.clone().multiplyScalar(movement.x * speed));
    }
    if (movement.y) {
        camera.position.y += movement.y * speed;
    }

    const target = new Vector3().copy(camera.position).add(direction);
    camera.lookAt(target);
};
