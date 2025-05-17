import { SceneType } from './scene.types';

export const config = {
    stroke: false,
    scene: 'simple',
    useBsp: true,
    random: {
        count: 20,
        size: 4,
    },
} as const satisfies Record<string, any> & { scene: SceneType };
