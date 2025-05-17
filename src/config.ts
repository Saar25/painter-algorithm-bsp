import { SceneType } from './scene.types';

export const config = {
    stroke: true,
    scene: 'random',
    useBsp: true,
    random: {
        count: 20,
        size: 4,
    },
} as const satisfies any & { scene: SceneType };
