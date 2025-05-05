import { Matrix4 } from 'three';

type CubeEntity = {
    type: 'cube';
    transform: Matrix4;
};

export type Entity = CubeEntity;

export type EntityType = Entity['type'];

export type EntityOf<T extends EntityType> = Entity & { type: T };
