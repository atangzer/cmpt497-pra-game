import Phaser from 'phaser'

// Sequence that user inputs into grid
let user_input;
let page_square;
let page_square_text;
let page_square_container;
var page_sequence = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
export default class GameScene extends Phaser.Scene {
	constructor() {
		super('game-scene');
	}

	preload() {
        this.load.image('background', 'images/background.jpg');
        this.load.image('square', 'images/square.png');
        this.load.image('frame', 'images/frame.png');
        this.load.image('arrow', 'images/arrow.png');
        console.log("FIFO: " + this.fifo(page_sequence));
        console.log("LRU: " + this.lru(page_sequence));
        console.log("OPT: " + this.opt(page_sequence));
	}

	create() {
        //TODO: Randomize sequence on start up 
        // var page_sequence = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];

        // Load images into game scene    
        this.add.image(960, 500, 'background')

        // Frames/Grid - Drop Zone
        var x_frame = 140;
        var y_frame = 300;
        for (var i = 0; i < 12; i++) {
            var frame = this.add.image(x_frame, y_frame, 'frame');
            var dropzone_frame = this.add.zone(x_frame, y_frame, frame.width, frame.height).setRectangleDropZone(x_frame, y_frame);
            for (var j = 0; j < 2; j++) {
                y_frame += 150;
                var frame = this.add.image(x_frame, y_frame, 'frame');
                var dropzone_frame = this.add.zone(x_frame, y_frame, frame.width, frame.height).setRectangleDropZone(x_frame, y_frame);
            }
            y_frame = 300;
            x_frame += 150; 
        }
        
        // Page Sequence
        var x_square = 400;
        for (var i = 0; i < 12; i++) {  
            page_square = this.add.sprite(0, 0, 'square').setScale(0.1);
            page_square_text = this.add.text(0, 0, page_sequence[i].toString(), { font: "25px Arial Black", fill: "#000" }).setOrigin(0.5, 0.5);
            var page_square_placeholder = this.add.sprite(0, 0, 'square').setScale(0.1);
            var page_square_text_placeholder = this.add.text(0, 0, page_sequence[i].toString(), { font: "25px Arial Black", fill: "#000" }).setOrigin(0.5, 0.5);
            
            var page_square_container_placeholder = this.add.container(x_square, 100, [ page_square_placeholder, page_square_text_placeholder ]).setSize(page_square_placeholder.width / 10, page_square_placeholder.height / 10);
            page_square_container = this.add.container(x_square, 100, [ page_square, page_square_text ]).setSize(page_square.width / 10, page_square.height / 10).setInteractive({ useHandCursor: true });

            this.input.setDraggable(page_square_container);

            x_square += 100;
        }

        this.input.on('dragstart', function (_pointer, gameObject) {

            this.children.bringToTop(gameObject);
    
        }, this);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            gameObject.input.enabled = true; 
            console.log("Tile drop initiated.");
            console.log(gameObject.list[1]._text);
            console.log(dropZone)
        });     
	}

    update() {

    }

    // These functions should return the number of page faults
    // LRU Page Replacement Algorithm Function
    lru(sequence) {
        let pf, ind; 
        let n = 4; //TODO: change to be dynamic
        var st = [];
        var frame = [];

        pf = 0;
        for (var i = 0; i < sequence.length; i++) {
            if (!frame.includes((sequence[i]))) {
                if (frame.length < n) {
                    frame.push(sequence[i]);
                    st.push(frame.length - 1);
                } else {
                    ind = st.shift();
                    frame[ind] = i;
                    st.push(ind);
                }
                pf += 1; 
            } else {
                st.push(st.shift(st.indexOf(frame.indexOf(i))));
            }
        }

        return pf;
    }

    // FIFO Page Replacement Algorithm Function
    fifo(sequence) {
        let pf, top; 
        let n = 4; //TODO: change to be dynamic
        var frame = [];

        // console.log(sequence);

        pf = 0;
        top = 0; 
        for (var i = 0; i < sequence.length; i++) {
            if (!frame.includes(sequence[i])) {
                if (frame.length < n) {
                    frame.push(sequence[i]);
                } else {
                    frame[top] = sequence[i];
                    top = (top + 1) % n;
                }
                pf += 1;
            }
            // console.log("frame: " + frame);
        }
        return pf; 
    }

    // OPT Page Replacement Algorithm Function
    opt(sequence) {
        let pf, flag; 
        let n = 4; //TODO: change to be dynamic
        var frame = [];
        var occurance = new Uint8Array(n);

        pf = 0;
        for (var i = 0; i < sequence.length; i++) {
            if (!frame.includes(sequence[i])) {
                if (frame.length < n) {
                    frame.push(sequence[i]);
                } else {
                    for (var j = 0; j < frame.length; j++) {
                        if (!sequence.slice(i+1).includes(frame[j])) {
                            frame[j] = sequence[i];
                            flag = 1;
                            break;
                        } else {
                            occurance[j] = sequence.slice(i + 1).indexOf(frame[j]);
                        }
                    } 
                    if (flag) {
                        frame[occurance.indexOf(Math.max.apply(null, occurance))] = sequence[i];
                    }
                }
                pf += 1;
            }
        }

        return pf; 
    }
}