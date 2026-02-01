import Phaser from "phaser";
import Level from "./scenes/Level";
import Scene from "./scenes/Scene";
import Preload from "./scenes/Preload";
import UIScene from "./scenes/UIScene";
import MainMenu from "./scenes/MainMenu";

class Boot extends Phaser.Scene {

	constructor() {
		super("Boot");
	}

	preload() {

		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Preload");
	}
}

window.addEventListener('load', function () {

	const game = new Phaser.Game({
		width: 1280,
		height: 720,
		backgroundColor: "#242424",
		pixelArt: true,
		roundPixels: true,
		parent: "game-container",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
		},
		dom: {
			createContainer: true
		},
		scene: [Boot, Preload, MainMenu, Level, Scene, UIScene]
	});

	game.scene.start("Boot");
});