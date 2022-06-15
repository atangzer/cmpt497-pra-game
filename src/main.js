import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import GameScene from './scenes/GameScene'

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
	// canvasStyle: `display: block; width: 100%; height: 100%;`,
	scene: [GameScene, HelloWorldScene]
}

export default new Phaser.Game(config)
