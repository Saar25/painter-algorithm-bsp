import { SceneType } from './scene.types';

export const config = {
    stroke: true,
    scene: 'random',
    useBsp: true,
    random: {
        count: 50,
        size: 10,
    },
} as const satisfies Record<string, any> & { scene: SceneType };
