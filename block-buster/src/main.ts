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
			mode: Phaser.Scale.ScaleModes.NONE, // We handle scaling manually for perfect PC-to-Mobile consistency
		},
		dom: {
			createContainer: true
		},
		scene: [Boot, Preload, MainMenu, Level, Scene, UIScene]
	});

	game.scene.start("Boot");

	function handleResize() {
		const app = document.getElementById('app');
		if (!app) return;

		const ww = window.innerWidth;
		const wh = window.innerHeight;
		const isPortrait = wh > ww;
		const isMobile = window.matchMedia("(pointer: coarse)").matches;

		let scale: number;
		let rotation: number = 0;

		if (isMobile && isPortrait) {
			// Telefon dikeyde -> 90 derece döndür ve dikey boşluğa (wh) genişliği sığdır
			rotation = 90;
			// 1280'i wh'ye, 720'yi ww'ye sığdıracak oranı seç
			scale = Math.min(wh / 1280, ww / 720);
		} else {
			// Masaüstü veya yatay mobil -> Normal sığdır
			rotation = 0;
			scale = Math.min(ww / 1280, wh / 720);
		}

		app.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
	}

	window.addEventListener('resize', handleResize);
	window.addEventListener('orientationchange', () => setTimeout(handleResize, 200));
	handleResize();
});