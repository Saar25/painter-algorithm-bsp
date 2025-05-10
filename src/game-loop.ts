export const gameLoop = (callback: (delta: number) => void): void => {
    let lastFrame = performance.now();

    const loop = () => {
        const current = performance.now();
        const delta = current - lastFrame;

        callback(delta);

        lastFrame = current;
        requestAnimationFrame(loop);
    };

    loop();
};
