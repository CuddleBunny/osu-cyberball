export function getCaughtBallPosition(player: Phaser.GameObjects.Sprite) {
    return { x: player.x + (player.flipX ? -50 : 50), y: player.y - 15 };
}

export function getActiveBallPosition(player: Phaser.GameObjects.Sprite) {
    return { x: player.x + (player.flipX ? 40 : -40), y: player.y - 20 };
}
