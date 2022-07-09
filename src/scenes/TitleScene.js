import Phaser from 'phaser'

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('title-scene');
    }

    preload() {

    }

    create() {
        var text = this.add.text(900, 600, 'Play', { font: "25px Arial Black", fill: "#FFF" }).setInteractive({ useHandCursor: true });

        text.on('pointerdown', () => {
            this.scene.switch('game-scene');
        })
    }
}