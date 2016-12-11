window.Sprite = function (options) {
  this.context = options.context;
  this.width = options.width;
  this.height = options.height;
  this.image = options.image;
  this.dx = options.dx;
  this.dy = options.dy;
  this.offsets = options.offsets;
}

Sprite.prototype.render = function () {
  this.context.imageSmoothingEnabled = false;
  this.context.mozImageSmoothingEnabled = false;
  this.context.webkitImageSmoothingEnabled = false;
  this.context.drawImage(
    this.image,
    0,
    0,
    this.width * Game.BLOCK_SIZE,
    this.height * Game.BLOCK_SIZE,
    (this.dx + this.offsets[0]) * Game.BLOCK_SIZE * 2,
    (this.dy + this.offsets[1]) * Game.BLOCK_SIZE * 2,
    this.width * Game.BLOCK_SIZE * 2,
    this.height * Game.BLOCK_SIZE * 2
  );
};

Sprite.prototype.clear = function () {
  this.context.clearRect(
    (this.dx + this.offsets[0]) * Game.BLOCK_SIZE * 2,
    (this.dy + this.offsets[1]) * Game.BLOCK_SIZE * 2,
    this.width * Game.BLOCK_SIZE * 2,
    this.height * Game.BLOCK_SIZE * 2
  );
}