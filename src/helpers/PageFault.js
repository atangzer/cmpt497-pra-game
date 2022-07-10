export default class PageFault {
    constructor(scene) {
        this.render = (x, y, sprite1, sprite2, callback1, callback2) => {
            let page_fault = scene.add.image(0, 0, sprite1).setScale(0.05);
            let page_fault_container = scene.add.container(x, y, [ page_fault ])
                                                .setSize(page_fault.width / 50, page_fault.height / 50)
                                                .setInteractive()
                                                .on('pointerdown', () => { 
                                                    this.enterPointerDownState(x, y, sprite2, callback2);
                                                    callback1();
                                                });
            scene.input.enableDebug(page_fault_container);
            return page_fault_container; 
        };

        // Unselect radio button
        this.enterPointerDownState = (x, y, sprite2, callback2) => {
            var selected = scene.add.image(x, y, sprite2).setInteractive();
            selected.setScale(0.035).setOrigin(0.5, 0.5).setInteractive().on('pointerdown', () => { 
                selected.destroy();
                callback2(); 
            });
        }

        this.unselect = () => {
            console.log("hello world!");
        }
    }
}