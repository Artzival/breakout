class ExampleScene extends Phaser.Scene {
    ball;
    paddle;
    bricks;
  preload() {
    this.load.image('ball', '/assets/ball.png');
    this.load.image('paddle', '/assets/paddle.png');
    this.load.image('brick', '/assets/brick.png');
  }
  create() {
    this.ball = this.add.sprite(this.scale.width * 0.5, this.scale.height - 25, 'ball')
        .setScale(0.02);
    this.physics.add.existing(this.ball);
    this.ball.body.setVelocity(150, 150);
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.paddle = this.add.sprite(
        this.scale.width * 0.5,
        this.scale.height - 5,
        "paddle",
    );
    this.paddle.setOrigin(0.5, 1);
    this.physics.add.existing(this.paddle);
    this.paddle.body.setImmovable(true);
    this.ball.body.setBounce(1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.checkCollision.down = false;
    this.initBricks();
    this.paddle.body.setCollideWorldBounds(true);

  }
    update() {
        this.physics.collide(this.ball, this.paddle);
        if (this.cursors.left.isDown) {
            this.paddle.body.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.paddle.body.setVelocityX(160);
        } else {
            this.paddle.body.setVelocityX(0);
        }
        const ballIsOutOfBounds = !Phaser.Geom.Rectangle.Overlaps(
            this.physics.world.bounds,
            this.ball.getBounds()
        );
        if (ballIsOutOfBounds) {
            this.scene.restart();
        }
        this.physics.collide(this.ball, this.bricks, (ball, brick) => 
            this.hitBrick(ball, brick),
        );
        this.physics.add.collider(this.ball, this.paddle, this.handlePaddleBounce, null, this);
        
    }
    initBricks() {
        const bricksLayout = {
            width: 50,
            height: 20,
            count: {
                row: 3,
                col: 7,
            },
            offset: {
                top: 50,
                left: 60,
            },
            padding: 10,
        };
        this.bricks = this.add.group();
        for (let c = 0; c < bricksLayout.count.col; c++) {
            for (let r = 0; r < bricksLayout.count.row; r++) {
                const brickX = 
                    c * (bricksLayout.width + bricksLayout.padding) + bricksLayout.offset.left;
                const brickY = 
                    r * (bricksLayout.height + bricksLayout.padding) + bricksLayout.offset.top;

                const newBrick = this.add.sprite(brickX, brickY, 'brick')
                this.physics.add.existing(newBrick);
                newBrick.body.setImmovable(true);
                this.bricks.add(newBrick);
            }
        }
    }
    hitBrick(ball, brick) {
        brick.destroy();
    }
    handlePaddleBounce(ball, paddle) {
        const relativeIntersectX = ball.x - paddle.x;
        const normalizedRelativeIntersectionX = relativeIntersectX / (paddle.width / 2);
        const bounceAngle = normalizedRelativeIntersectionX * (Math.PI / 3);
        const speed = ball.body.speed;
        ball.body.setVelocity(
            speed * Math.sin(bounceAngle),
            -speed * Math.cos(bounceAngle)
        );
    }   
}

const config = {
  type: Phaser.CANVAS,
  width: 480,
  height: 320,
  scene: ExampleScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#eeeeee',
  type: Phaser.WEBGL,
  render: {
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    antialias: false,
  },
  physics: {
    default: 'arcade',
  },
};

const game = new Phaser.Game(config);