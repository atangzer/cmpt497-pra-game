import Phaser from 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import GameScene from './scenes/GameScene'
import TitleScene from './scenes/TitleScene'

const config = {
	type: Phaser.AUTO,
	width: 1920,
	height: 900,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        },
        ]
    },
	// canvasStyle: `display: block; width: 100%; height: 100%;`,
	scene: [TitleScene, GameScene]
}

var game = new Phaser.Game(config);