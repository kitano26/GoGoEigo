class KataKataHanabi extends Phaser.Scene {
    constructor() {
        super({ key: 'KataKataHanabi' });
    }

    /**
     * Load assets into scene
     */
    preload() {
        this.load.image('redLauncher', 'assets/images/redLauncher.png');
    }

    /**
     * Set up the scene
     */
    create() {
        // Add launcher image
        this.launcher = this.add.image(0, 250, 'redLauncher');
        this.launcher.setScale(0.1);
        this.launcher.xSpeed = 1;

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
        this.targetWordText = this.add.text(wordBoxX, wordBoxY, this.targetWord, {
            fontFamily: 'Comic Sans MS',
            fontSize: 36,
            color: '#000000'
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
        // this.launcher.x += this.launcher.xSpeed;

        // Reset launcher position if it goes off screen
        if (this.launcher.x > this.scale.width + this.launcher.width / 2) {
            this.launcher.x = -this.launcher.width / 2;
        }
    }

    /**
     * CUSTOM METHODS
     */
    
    // Handle keyboard input
    handleKey(event) {
        if (event.repeat) {
            return;
        }

        const key = event.key.toLowerCase();    // Normalize to lowercase
        // Only process a-z keys
        if (key.length === 1 && key >= 'a' && key <= 'z') {
            // check if key matches next letter in target word
            if (key === this.targetWord.charAt(this.userInput.length)) {
                this.userInput += key;
                console.log(this.userInput);
            }

            // Check if user input matches target word
            if (this.userInput === this.targetWord) {
                console.log('Word completed!');

                // Select new target word
                this.targetWord = Phaser.Math.RND.pick(this.wordList);
                this.targetWordText.setText(this.targetWord);

                // Clear user input
                this.userInput = '';
            }
        }
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
