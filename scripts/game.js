var context;

var bufferCanvas, buffer;

window.Game = function () {
  this.scoreboardEl = document.getElementById('scoreboard');
  this.gameOverEl = document.getElementById('game-over');
  bufferCanvas = document.createElement("canvas");
  bufferCanvas.width = Game.WIDTH;
  bufferCanvas.height = Game.HEIGHT;
  buffer = bufferCanvas.getContext("2d");
};

Game.prototype.start = function () {
  this.field = new Field();
  context = this.field.getContext();
  context.font = "VT323 48px";
  this.score = 0;
  this.active = true;

  this.gameOverEl.classList.remove('show');
  this.arrowSprite = new Sprite({
    image: null,
    height: 1,
    width: 1,
    context: context,
    offsets: this.field.getOffsets(),
    dx: this.field.width/2 - 0.5,
    dy: -2
  });

  window.game = this;
  this.spawnBlock();
};

Game.prototype.spawnBlock = function () {
  var direction = Math.random()*4|0;
  this.showArrow(direction);
  this.block = this.field.addBlock(direction);
};

Game.prototype.showArrow = function (direction) {
  this.arrowSprite.image = IMAGES['arrow' + direction];
  this.arrowSprite.render();
};

Game.STEPS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
];
Game.BLOCK_SIZE = 24;
Game.HEIGHT = 720;
Game.WIDTH = 864;

Game.prototype.input = function (direction) {
  if (direction === 7) {
    this.end();
    this.start();
  }
  if (!this.block) return;

  if (direction === 6) {
    this.block.fall(this.block.direction);
  } else if (direction === 4) {
    this.block.rotate(true);
  } else if (direction === 5) {
    this.block.rotate(false);
  } else {
    if ((this.block.direction + direction) % 2 == 1 ||
        this.block.direction == direction) {
      this.block.moveBy(direction);
    }
  }
};

Game.prototype.broadcast = function (message) {
  this.message = message;
  this.dashboard();
};

Game.prototype.blockFrozen = function () {
  this.block = null;
  setTimeout(function () {
    if(this.active) {
      this.spawnBlock();
    }
  }.bind(this), 200)
};

Game.prototype.increaseScore = function (points) {
  this.score += points;
  this.dashboard();
};

Game.prototype.dashboard = function () {
  context.clearRect(0, 0, Game.BLOCK_SIZE * Game.WIDTH, Game.BLOCK_SIZE * 4);
  this.scoreboardEl.innerHTML = ~~this.score;
};

Game.prototype.end = function () {
  this.active = false;
  if (this.block) {
    this.block.destroy();
    this.block = null;
  }
  this.gameOverEl.classList.add('show');
};
