class KataKataHanabi extends Phaser.Scene {
    constructor() {
        super({ key: 'KataKataHanabi' });
    }

    /**
     * Load assets into scene
     */
    preload() {
        // Load BBCode text plugin
        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
        
        // Load images
        this.load.image('redLauncher', 'assets/images/redLauncher.png');
        this.load.image('spark', 'assets/particles/fireworkSpark.png');
        this.load.image('fireworkTrail', 'assets/images/fireworkTrail.png');
    }

    /**
     * Set up the scene
     */
    create() {
        // Add launcher image
        this.launcher = this.add.image(0, 250, 'redLauncher');
        this.launcher.setScale(0.1);
        this.launcher.xSpeed = 2;

        // Word box configuration
        const wordBoxWidth = 300;
        const wordBoxHeight = 60;
        const wordBoxX = (this.scale.width - wordBoxWidth) / 2;
        const wordBoxY = 280;

        // Draw word box
        this.wordBox = this.add.rectangle(wordBoxX, wordBoxY, wordBoxWidth, wordBoxHeight, 0xffffff);
        this.wordBox.setOrigin(0, 0); // top-left origin
        this.wordBox.setStrokeStyle(3, 0x00000); // border color and thickness
        this.wordBox.setDepth(-1); // send to back

        // Load word list and set current target word
        this.wordList = ['hanabi', 'firework', 'sparkle', 'rocket'];
        this.targetWord =  Phaser.Math.RND.pick(this.wordList);

        // Display target word text
        this.targetWordText = this.add.rexBBCodeText(wordBoxX, wordBoxY, this.targetWord, {
            fontFamily: 'Comic Sans MS',
            fontSize: 36,
            color: '#666666ff'
        });
        this.targetWordText.setOrigin(0.5, 0.5);
        this.targetWordText.setPosition(wordBoxX + wordBoxWidth / 2, wordBoxY + wordBoxHeight / 2);
 
        // Store user input
        this.userInput = ''; 

        // Listen for keyboard input
        this.input.keyboard.on('keydown', this.handleKey, this);
    }

    /**
     * Update scene
     */
    update() {
        // Move launcher
        this.launcher.x += this.launcher.xSpeed;

        // Reset launcher position if it goes off screen
        if (this.launcher.x > this.scale.width) {
            this.launcher.x = 0;
            this.setNewTargetWord();
        }
    }

    /**********************
     *   CUSTOM METHODS   *
     **********************/
    
    /**
     * Set new target word
     */
    setNewTargetWord() {
        this.targetWord = Phaser.Math.RND.pick(this.wordList);
        this.targetWordText.setText(this.targetWord);
    }
    
    /**
     * Handle keyboard input
     */
    handleKey(event) {
        if (event.repeat) {
            return;
        }

        const key = event.key.toLowerCase();    // Normalize to lowercase
        // Only process a-z keys
        if (key.length === 1 && key >= 'a' && key <= 'z') {
            // Check if key matches next letter in target word
            if (key === this.targetWord.charAt(this.userInput.length)) {
                this.userInput += key;                                              // Append key to user input
                this.correctText = `[color=green]${this.userInput}[/color]`;        // Only make correct letters in green
                this.targetWordText.setText(this.correctText + this.targetWord.slice(this.userInput.length)); // Update displayed text
            }

            // Check if user input matches target word
            if (this.userInput === this.targetWord) {
                // Launch firework
                this.explodeFirework(this.launcher.x, 100);

                // Select new target word
                this.setNewTargetWord();

                // Clear user input
                this.userInput = '';
                this.correctText = '';
            }
        }
    }

    /**
     * Launch firework from (x, y)
     */
    launchFirework() {
        const launcherX = this.launcher.x;
        const launcherY = this.launcher.y;

        // Firework sprite
        const rocket = this.add.sprite(launcherX, launcherY, 'redLauncher');

        // Move rocket up using a tween
        this.tweens.add({
            targets: rocket,
            y: launcherY - 300,  // height of the launch
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                // explode when reached top
                this.explodeFirework(rocket.x, rocket.y);
                rocket.destroy();
            }
        });
    }

    /**
     * Create firework explosion at (x, y)
     */
    explodeFirework(x, y) {
        const emitter = this.add.particles(x, y, 'spark', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            lifespan: { min: 300, max: 600 },
            blendMode: 'ADD',
            quantity: 500,
//             tint: Phaser.Display.Color.GetColor(
//     Phaser.Math.Between(50, 255),
//     Phaser.Math.Between(50, 255),
//     Phaser.Math.Between(50, 255)
// )
            tint: [     
                0xFF0000, // deep red
                0xFF4500, // orange red
                0xFFA500, // orange
                0xFFD700, // gold
                0xFFFF00, // yellow
        ]

        });

        emitter.explode(50);
    }
}


/**
 * Phaser game configuration
 */
const config = {
    type: Phaser.AUTO,
    width: 800,
	height: 360,
	backgroundColor: "#0b1c2d",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: KataKataHanabi,
}

const game = new Phaser.Game(config)
