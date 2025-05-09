import { Matrix4, Vector3 } from 'three';

type CubeEntity = {
    type: 'cube';
    transform: Matrix4;
};

type TriangleEntity = {
    type: 'triangle';
    transform: Matrix4;
    vertices: [Vector3, Vector3, Vector3];
    color?: string;
};

export type Entity = CubeEntity | TriangleEntity;

export type EntityType = Entity['type'];

export type EntityOf<T extends EntityType> = Entity & { type: T };
