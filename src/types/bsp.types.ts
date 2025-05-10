import { EntityOf } from './entity.types';

export type BSPNode = {
    plane: EntityOf<'triangle'>;
    front?: BSPNode;
    back?: BSPNode;
};
