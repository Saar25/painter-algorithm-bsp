import { Pane, Point } from '../types';

export const paneProjector = (pane: Pane) => {
    return (p: Point) => project(p, pane);
};

export function project(p: Point, container: Pane) {
    const scale = 300 / (p.z + 5);
    return {
        x: p.x * scale + container.width / 2,
        y: -p.y * scale + container.height / 2,
    };
}
