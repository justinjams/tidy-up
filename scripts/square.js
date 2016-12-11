window.Square = function (options) {
  this.x = options.x;
  this.y = options.y;
  this.sprite = options.sprite;
  this.field = options.field;
};

Square.prototype.destroy = function () {
  this.field.register([this.x, this.y], this, 0, true);
  this.sprite.clear();
};

Square.prototype.fall = function (dx, dy) {
  var newPos = [this.x - dx, this.y - dy];

  this.sprite.clear();
  this.field.register([this.x, this.y], this, 0, true);

  this.sprite.dx = newPos[0];
  this.sprite.dy = newPos[1];
  this.sprite.render();
  this.x = newPos[0];
  this.y = newPos[1];
  console.log(this.x, this.y, newPos)
  this.field.register(newPos, this, 2, true);
}