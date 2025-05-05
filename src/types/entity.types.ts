import { Matrix } from 'mathjs';

type CubeEntity = {
    type: 'cube';
    transform: Matrix;
};

export type Entity = CubeEntity;

export type EntityType = Entity['type'];

export type EntityOf<T extends EntityType> = Entity & { type: T };
