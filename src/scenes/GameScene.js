import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene
{
	constructor() {
		super('game-scene')
	}

	preload() {
        this.load.image('totoro', 'images/totoro.gif')
        this.load.image('background', 'images/background.jpg')
        this.load.image('square', 'images/square.png')
        this.load.image('frame', 'images/frame.png')
	}

	create() {
        // Load images into game scene    
        this.add.image(960, 500, 'background')

        // Frames/Grid - Drop Zone
        var x_frame = 300;
        var y_frame = 300;
        for (var i = 0; i < 10; i++) {
            var frame = this.add.image(x_frame, y_frame, 'frame');
            var dropzone_frame = this.add.zone(x_frame, y_frame, frame.width, frame.height).setDropZone();
            for (var j = 0; j < 2; j++) {
                y_frame += 150;
                var frame = this.add.image(x_frame, y_frame, 'frame');
                var dropzone_frame = this.add.zone(x_frame, y_frame, frame.width, frame.height).setDropZone();
            }
            y_frame = 300;
            x_frame += 150; 
        }
        
        // Page Sequence
        var x_square = 100;
        for (var i = 0; i < 10; i++) {  
            var page_square = this.add.sprite(0, 0, 'square').setScale(0.1);
            var page_square_text = this.add.text(0, 0, '1', { font: "25px Arial Black", fill: "#000" }).setOrigin(0.5, 0.5);
            
            var page_square_container = this.add.container(x_square, 100, [ page_square, page_square_text ]);
            page_square_container.setSize(page_square.width / 10, page_square.height / 10).setInteractive();
            
            this.input.setDraggable(page_square_container);
            // this.input.setDraggable(page_square);
            // this.input.setDraggable(page_square_text);
            x_square += 100;
        }
        
        page_square_container.on('pointerover', function () {
            page_square.setTint(0x44ff44);
        });

        page_square_container.on('pointerout', function () {
            page_square.clearTint();
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