import { Vector3 } from 'three';

export const cubeVertices = [
    new Vector3(1, 1, 1), // 0
    new Vector3(-1, 1, 1), // 1
    new Vector3(-1, -1, 1), // 2
    new Vector3(1, -1, 1), // 3
    new Vector3(1, 1, -1), // 4
    new Vector3(-1, 1, -1), // 5
    new Vector3(-1, -1, -1), // 6
    new Vector3(1, -1, -1), // 7
] as const satisfies Vector3[];

export const cubeFaces = [
    [0, 1, 2, 3], // front
    [4, 5, 6, 7], // back
    [1, 5, 6, 2], // left
    [0, 4, 7, 3], // right
    [0, 1, 5, 4], // top
    [3, 2, 6, 7], // bottom
];

export const cubeFaceColors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];
