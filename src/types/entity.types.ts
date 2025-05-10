import { Matrix4 } from 'three';
import { Triangle } from './bsp.types';

type CubeEntity = {
    type: 'cube';
    transform: Matrix4;
};

type TriangleEntity = {
    type: 'triangle';
    color?: string;
} & Triangle;

export type Entity = CubeEntity | TriangleEntity;

export type EntityType = Entity['type'];

export type EntityOf<T extends EntityType> = Entity & { type: T };
