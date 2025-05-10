import { EntityOf } from './entity.types';

export type BSPNode = {
    plane: EntityOf<'triangle'>;
    triangles: readonly EntityOf<'triangle'>[];
    front?: BSPNode;
    back?: BSPNode;
};
