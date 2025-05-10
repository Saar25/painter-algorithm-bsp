export function shuffled<T>(array: readonly T[]): T[] {
    let currentIndex = array.length;
    const shuffled = [...array];

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }

    return shuffled;
}
