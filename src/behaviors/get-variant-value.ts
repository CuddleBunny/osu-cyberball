export function getVariantValue(base: number, variance: number): number {
    return base + (Phaser.Math.RND.between(0, variance) * Phaser.Math.RND.sign());
}
