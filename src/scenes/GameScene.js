import Phaser from 'phaser'

import Page from '../helpers/Page'
import Frame from '../helpers/Frame'
import PageFault from '../helpers/PageFault'

// Randomized array of 12 numbers from [0,10]
var page_sequence = Array.from({length: 12}, () => Math.floor(Math.random() * 10));

// # of frames
var n = 4;

// # of page faults determined by player 
let user_pf;

// Correct # of page faults
let answer_pf;

let score; 

let unselect;

var page_squares;

const COLOR_CORRECT = 0xC1E1C1;
const COLOR_WRONG = 0xFDFD96;
export default class GameScene extends Phaser.Scene {
	constructor() {
		super('game-scene');
	}

	preload() {
        this.load.image('background', 'images/background.jpg');
        this.load.image('square', 'images/square.png');
        this.load.image('frame', 'images/frame.png');
        this.load.image('arrow', 'images/arrow.png');
        this.load.image('radio_button', 'images/empty_radio_button.png');
        this.load.image('selected_radio_button', 'images/red_dot.png');

        console.log("[DEBUG] FIFO: " + this.fifo(page_sequence));
        console.log("[DEBUG] LRU: " + this.lru(page_sequence));
        console.log("[DEBUG] OPT: " + this.opt(page_sequence));

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });   
	}

	create() {
        // Load images into game scene    
        // this.add.image(960, 500, 'background');

        // Set # of PF to 0 
        score = 0;

        unselect = 0;

        // Page Replacement Algorithm Selection
        this.algorithm = this.add.text(20, 40, '', { font: "25px Arial Black", fill: "#000" });
        answer_pf = this.randomizeAlgorithm();

        // Scoreboard
        this.scoreText = this.add.text(20, 10, '', { font: "25px Arial Black", fill: "#000" });
        this.updatePfCount();

        // Frames/Grid - Drop Zone
        var x_frame = 140;
        var y_frame = 170;
        for (var i = 0; i < 12; i++) {
            var frame = this.add.image(x_frame, y_frame, 'frame');
            var dropzone_frame = this.add.zone(x_frame, y_frame, frame.width, frame.height).setRectangleDropZone(x_frame, y_frame);
            for (var j = 0; j < n - 1; j++) {
                y_frame += 150;
                var frame = this.add.image(x_frame, y_frame, 'frame');
                var dropzone_frame = this.add.zone(x_frame, y_frame, frame.width, frame.height).setRectangleDropZone(x_frame, y_frame);
            }
            y_frame = 170;
            x_frame += 150; 
            this.input.enableDebug(dropzone_frame)
        }
        
        // Page Sequence
        // page_squares = this.add.group()

        // var x_square = 400;
        let page_square = new Page(this);
        page_squares = this.add.group();
        this.createPageSquares();

        // Game button
        var button_img = this.add.image(0, 0, 'arrow').setScale(0.2);
        var button_text = this.add.text(0, 0, 'Next', { font: "25px Arial Black", fill: "#000" }).setOrigin(0.5, 0.5);
        var button = this.add.container(1000, 800, [ button_img, button_text ]).setSize(button_img.width / 6, button_img.height / 20).setInteractive();
        this.input.enableDebug(button)

        button.on('pointerdown', () => { 
            this.checkAnswer();

            if (unselect == 1) {
                // console.log(page_squares.getLength())
                // console.log(page_squares)
                unselect = 0;
                selected_buttons.clear(true, true);
                page_squares.clear(true, true);
                this.createPageSquares();   
                // console.log(page_squares.getLength())
                
            }
        });

        // Page Fault Indicators
        var page_fault_button = this.add.group({
            key: 'radio_button',
            repeat: 12,
            setXY: { x: 135, y: 710, stepX: 150 }
        })

        var selected_buttons = this.add.group();

        page_fault_button.children.iterate((children) => {
            children.setScale(0.05)
                    .setSize(children.width, children.height)
                    .setInteractive();

            children.on('pointerdown', () => {
                var selected = this.add.image(children.x, children.y, 'selected_radio_button')
                        .setScale(0.05)
                        .setSize(children.width, children.height)
                        .setInteractive();
                selected_buttons.add(selected);
                this.incrementPf();    
                
                selected.on('pointerdown', () => {
                    selected.destroy();
                    this.decrementPf();
                })
            })
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            page_squares.add(page_square.render(this._temp[0].x, this._temp[0].y, 'square', gameObject.list[1]._text));
            // this.scene.input.setDraggable(cloned_container);
        });

        this.input.on('dragend', function (pointer, gameObject) {
            gameObject.input.draggable = false; 
        });

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            gameObject.input.enabled = true; 
        });     
	}

    update() { }

    // Page Fault Radio Button Helper Functions
    incrementPf() {
        user_pf += 1;
        console.log("[# of page faults]: " + user_pf);
    }

    decrementPf() {
        user_pf -= 1;
        console.log("[# of page faults]: " + user_pf);
    }

    // Update Count
    updatePfCount() {
        this.scoreText.setText('Score: ' + score);
    }

    resetRound() {
        this.updatePfCount();
        page_sequence = Array.from({length: 12}, () => Math.floor(Math.random() * 10));

        console.log(page_sequence);

        answer_pf = this.randomizeAlgorithm();

        console.log("[DEBUG] FIFO: " + this.fifo(page_sequence));
        console.log("[DEBUG] LRU: " + this.lru(page_sequence));
        console.log("[DEBUG] OPT: " + this.opt(page_sequence)); 

        // Flag to unselect radio buttons
        unselect = 1;

        // TODO: Clear drop zone
        // TODO: Refactor
        // var x_square = 400;
        // let page_square = new Page(this);
        // for (var i = 0; i < 12; i++) {
        //     page_square.render(x_square + (i * 100), 50, 'square', page_sequence[i]);
        // }
    }

    createPageSquares() {
        console.log("123123")
        var x_square = 400;
        let page_square = new Page(this);
        for (var i = 0; i < 12; i++) {
            page_squares.add(page_square.render(x_square + (i * 100), 50, 'square', page_sequence[i]));
        }
    }

    checkAnswer() {
        if (answer_pf == user_pf) { 
            // Increment score
            score += 1;

            this.rexUI.add.toast({
                x: 950,
                y: 400,
                width: 600,
                height: 200,
    
                background: this.rexUI.add.roundRectangle(300, 200, 2, 2, 20, COLOR_CORRECT),
                text: this.add.text(0, 0, '', { font: "20px Arial Black", fill: "#000" }),
                space: {
                    left: 240,
                    right: 20,
                    top: 20,
                    bottom: 20,
                },
            }).showMessage('Good Job!')

            this.resetRound();
        } else {
            // Wrong Answer: Continue round
            this.rexUI.add.toast({
                x: 950,
                y: 400,
                width: 600,
                height: 200,

                background: this.rexUI.add.roundRectangle(300, 200, 2, 2, 20, COLOR_WRONG),
                text: this.add.text(0, 0, '', { font: "25px Arial Black", fill: "#000" }),
                space: {
                    left: 240,
                    right: 20,
                    top: 20,
                    bottom: 20,
                },
            }).showMessage('Try Again!')
        }
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

    randomizeAlgorithm() {
        const choice = Math.floor(Math.random() * 3);

        // Reset score
        user_pf = 0;
        unselect = 0; 

        switch(choice) {
            case 0:
                console.log("LRU Selected");
                this.algorithm.setText('LRU');
                return this.lru(page_sequence);
            case 1:
                console.log("FIFO Selected");
                this.algorithm.setText('FIFO');
                return this.fifo(page_sequence);
            case 2:
                console.log("OPT Selected");
                this.algorithm.setText('OPT');
                return this.opt(page_sequence);         
        }
    }
}