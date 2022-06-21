export default class Page {
    constructor(scene) {
        this.render = (x, y, sprite, text) => {
            let page = scene.add.image(0, 0, sprite).setScale(0.1)
            let page_text = scene.add.text(0, 0, text, { font: "25px Arial Black", fill: "#000" }).setOrigin(0.5, 0.5);
            let page_container = scene.add.container(x, y, [ page, page_text ]).setSize(page.width / 10, page.height / 10).setInteractive();
            scene.input.setDraggable(page_container);
            scene.input.enableDebug(page_container);
            return page_container;
        }
    }
}