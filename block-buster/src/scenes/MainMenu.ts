
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class MainMenu extends Phaser.Scene {

    constructor() {
        super("MainMenu");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    editorCreate(): void {
        this.events.emit("scene-awake");
    }

    /* START-USER-CODE */

    private bgBlocks!: Phaser.GameObjects.Group;

    create() {

        this.editorCreate();

        // Background Color (Dark Grey/Black to match game vibe)
        this.cameras.main.setBackgroundColor('#242424');

        // 1. Background Floating Blocks
        this.bgBlocks = this.add.group();
        this.createFloatingBlocks();

        // 2. Title "BLOCK BUSTER"
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Show HTML Menu
        const menuLayer = document.getElementById('menu-layer');
        const btnPlay = document.getElementById('btn-play');
        const titleEl = document.getElementById('menu-title');

        if (menuLayer) {
            menuLayer.classList.remove('hidden');
            menuLayer.style.opacity = '1';
        }

        if (btnPlay) {
            btnPlay.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                // Click Animation
                (btnPlay as HTMLElement).style.transform = 'translateY(8px) scale(0.95)';
                this.sound.play('blockPop');

                // Hide and Start
                if (menuLayer) {
                    menuLayer.style.opacity = '0';
                    menuLayer.style.transition = 'opacity 0.5s ease-out';
                }

                setTimeout(() => {
                    if (menuLayer) menuLayer.classList.add('hidden');
                    this.startGame();
                }, 500);
            }, { once: true });
        }

        // Add a simple bobbing animation to the title via CSS transition or manual update
        // But for now, let's just keep the parallax background blocks running.
        if (titleEl) {
            let time = 0;
            this.time.addEvent({
                delay: 16,
                callback: () => {
                    time += 0.05;
                    const y = Math.sin(time) * 10;
                    titleEl.style.transform = `translateY(${y}px)`;
                },
                loop: true
            });
        }

        // Audio Handling
        const music = this.sound.get('bgMusic');
        if (!music) {
            this.sound.play('bgMusic', { loop: true, volume: 0.5 });
        } else if (!music.isPlaying) {
            music.play({ loop: true, volume: 0.5 });
        }

    }

    createFloatingBlocks() {
        // Spawn some random blocks in the background that fall down or float up
        for (let i = 0; i < 20; i++) {
            this.spawnBackgroundBlock(true);
        }

        // Continually spawn new ones
        this.time.addEvent({
            delay: 500,
            callback: () => this.spawnBackgroundBlock(false),
            loop: true
        });
    }

    spawnBackgroundBlock(randomY: boolean) {
        const x = Phaser.Math.Between(0, this.scale.width);
        const y = randomY ? Phaser.Math.Between(0, this.scale.height) : this.scale.height + 50;
        const size = Phaser.Math.Between(30, 80);
        const color = Phaser.Utils.Array.GetRandom([0xffffff, 0xff0000, 0x4444ff]);
        const darkColor = Phaser.Display.Color.ValueToColor(color).darken(30).color;

        const container = this.add.container(x, y);

        // Shape mimic the game blocks
        const side = this.add.rectangle(size / 10, size / 10, size, size, darkColor);
        side.setStrokeStyle(2, 0x000000);

        const top = this.add.rectangle(0, 0, size, size, color);
        top.setStrokeStyle(2, 0x000000);

        container.add([side, top]);

        // Random Rotation
        container.rotation = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const rotSpeed = Phaser.Math.FloatBetween(-0.02, 0.02);

        // Movement Speed (Float Upwards)
        const speed = Phaser.Math.Between(20, 100);

        this.bgBlocks.add(container);

        container.setData('speed', speed);
        container.setData('rotSpeed', rotSpeed);
        container.setAlpha(0.6); // Slightly transparent background
        container.setScale(0.8);
    }

    update(_time: number, delta: number) {
        this.bgBlocks.getChildren().forEach((child: any) => {
            const block = child as Phaser.GameObjects.Container;
            const speed = block.getData('speed');
            const rotSpeed = block.getData('rotSpeed');

            block.y -= speed * (delta / 1000); // Move Up
            block.rotation += rotSpeed;

            // Reset if goes off top
            if (block.y < -100) {
                block.destroy();
            }
        });
    }

    startGame(isTestMode: boolean = false) {
        // Transition
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("Scene", { isTestMode });
        });
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
