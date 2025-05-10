import { Matrix4, Vector3 } from 'three';

export type BSPNode<T extends Triangle> = {
    plane: T;
    triangles: readonly T[];
    front?: BSPNode<T>;
    back?: BSPNode<T>;
};

export type Triangle = {
    transform: Matrix4;
    vertices: [Vector3, Vector3, Vector3];
};
