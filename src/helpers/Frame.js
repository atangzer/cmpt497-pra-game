export default class Frame {
    constructor(scene) {
        this.renderFrame = (x, y, sprite) => {
            let frame = scene.add.image(x, y, sprite);
            return frame;
        }

        this.renderZone = (x, y, sprite) => {
            let dropzone = scene.add.zone(x, y, sprite.width, sprite.height).setRectangleDropZone(x, y);
            scene.input.enableDebug(dropzone);
            return dropzone;
        }
    }
}