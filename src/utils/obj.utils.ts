import { BufferGeometry, Matrix4, Mesh, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { EntityOf } from '../types';
import { randomColor } from './color.utils';

const loader = new OBJLoader();

export const loadObjFile = (url: string) => {
    return new Promise<EntityOf<'triangle'>[]>((resolve, reject) => {
        loader.load(
            url,
            object => {
                const triangles: { a: Vector3; b: Vector3; c: Vector3 }[] = [];

                object.traverse(child => {
                    if ((child as Mesh).isMesh) {
                        const mesh = child as Mesh;
                        const geometry = mesh.geometry as BufferGeometry;
                        const position = geometry.attributes.position;

                        const index = geometry.index;

                        if (index) {
                            for (let i = 0; i < index.count; i += 3) {
                                const a = index.getX(i);
                                const b = index.getX(i + 1);
                                const c = index.getX(i + 2);

                                triangles.push({
                                    a: new Vector3().fromBufferAttribute(position, a),
                                    b: new Vector3().fromBufferAttribute(position, b),
                                    c: new Vector3().fromBufferAttribute(position, c),
                                });
                            }
                        } else {
                            // Non-indexed geometry
                            for (let i = 0; i < position.count; i += 3) {
                                triangles.push({
                                    a: new Vector3().fromBufferAttribute(position, i),
                                    b: new Vector3().fromBufferAttribute(position, i + 1),
                                    c: new Vector3().fromBufferAttribute(position, i + 2),
                                });
                            }
                        }
                    }
                });

                const transform = new Matrix4();
                resolve(
                    triangles.map(({ a, b, c }) => ({
                        type: 'triangle',
                        transform,
                        vertices: [a, b, c],
                        color: randomColor(),
                    })),
                );
            },
            console.log,
            reject,
        );
    });
};
