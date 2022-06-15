import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene
{
	constructor()
	{
		super('game-scene')
	}

	preload()
	{
        this.load.image('totoro', 'images/totoro.gif')
        this.load.image('background', 'images/background.jpg')
        this.load.image('square', 'images/square.png')
	}

	create()
	{
        this.add.image(960, 500, 'background')
        var frame = this.add.image(0, 0, 'square').setScale(0.1)

        var container = this.add.container(400, 400, [ frame ])
        this.add.container(500, 500)
        container.setSize(frame.width / 10, frame.height / 10)
        container.setInteractive()
        this.input.setDraggable(container)
        
        container.on('pointerover', function () {
            frame.setTint(0x44ff44);
        });

        container.on('pointerout', function () {
            frame.clearTint();
        });

        
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            gameObject.x = dragX;
            gameObject.y = dragY;
    
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {

            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
    
        });
	}
}