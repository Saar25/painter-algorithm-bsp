import { Matrix4, Vector3 } from 'three';
import { config } from './config';
import { SceneType } from './scene.types';
import { EntityOf } from './types';
import { loadObjFile, randomColor } from './utils';

type Promisable<T> = Promise<T> | T;

export type Scene = (...args: any[]) => Promisable<readonly EntityOf<'triangle'>[]>;

export const simpleScene = (() => [
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
]) satisfies Scene;

export const crossScene = (() => [
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
        vertices: [new Vector3(1, -1, -1), new Vector3(-1, -1, 1), new Vector3(1, 1, -1)],
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
]) satisfies Scene;

export const suzanneScene = (async () => await loadObjFile('/suzanne.obj')) satisfies Scene;

export const randomScene = (() => {
    const size = config.random.size;
    const triangleCountElement = document.getElementById('triangle-count') as HTMLInputElement;
    const count = +triangleCountElement.value;

    return Array.from({ length: count }, () => ({
        type: 'triangle',
        transform: new Matrix4().makeTranslation(new Vector3().random().multiplyScalar(size)),
        vertices: [
            new Vector3().random().subScalar(0.5).normalize(),
            new Vector3().random().subScalar(0.5).normalize(),
            new Vector3().random().subScalar(0.5).normalize(),
        ],
        color: randomColor(),
    }));
}) satisfies Scene;

export const scenes = {
    simple: simpleScene,
    suzanne: suzanneScene,
    random: randomScene,
    cross: crossScene,
} as const satisfies Record<SceneType, Scene>;
