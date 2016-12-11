window.Block = function (options) {
  var type = this.type = Block.GetType(Math.random()*7|0);

  this.pos = options.pos;
  this.field = options.field;
  this.direction = options.direction;
  this.shapeIndex = 0;
  this.shape = type.shapes[this.shapeIndex];
  this.context = options.context;
  this.image = type.image;

  this.buildSprites();
};

Block.prototype.activate = function () {
  setTimeout(this.autoMove.bind(this), this.field.stepDelay);
};

Block.prototype.buildSprites = function () {
  var offsets = this.field.getOffsets();
  this.spriteShape = [];
  this.eachInShape(function(i, j) {
    this.spriteShape[i] = this.spriteShape[i] || [];
    this.spriteShape[i][j] = new Sprite({
      image: this.image,
      height: 1,
      width: 1,
      context: this.context,
      offsets: offsets,
      dx: this.pos[0] + i,
      dy: this.pos[1] + j
    });
    this.spriteShape[i][j].render();
  }.bind(this));
};

Block.prototype.eachInShape = function (callback) {
  for(var i=0; i<this.shape.width; i++) {
    for(var j=0; j<this.shape.height; j++) {
      if(this.shape.form[i][j]) {
        callback(i, j)
      }
    }
  }
};

Block.prototype.moveBy = function (direction) {
  var step = Game.STEPS[direction];
  var newPos = [
    this.pos[0] + step[0],
    this.pos[1] + step[1]
  ];

  if (this.field.isFree(newPos, this.shape)) {
    this.field.register(this.pos, this, 0);
    this.pos = newPos;
    this.field.register(this.pos, this, 1);

    this.eachInShape(function (i, j) {
      var sprite = this.spriteShape[i][j];
      sprite.dx = this.pos[0] + i;
      sprite.dy = this.pos[1] + j;
    }.bind(this));
    this.render();
    return true;
  } else if(direction == this.direction) {
    this.freeze();
  }

  return false;
};

Block.prototype.render = function () {
  this.field.render();
  this.eachInShape(function (i, j) {
    this.spriteShape[i][j].render();
  }.bind(this));
};

Block.prototype.changeContext = function (newContext) {
  this.eachInShape(function (i, j) {
    this.spriteShape[i][j].clear();
    var newPos = [
      this.pos[0] + i,
      this.pos[1] + j
    ];

    var square = new Square({
      x: newPos[0],
      y: newPos[1],
      sprite: this.spriteShape[i][j],
      field: this.field
    })

    this.spriteShape[i][j].context = newContext;
    this.field.register(newPos, square, 2, true)

  }.bind(this));
  this.render();
}

Block.GetType = function (typeNumber) {
  return [
    {
      // I block
      shapes: [
        {
          height: 4,
          width: 1,
          form: [[1,1,1,1]]
        },
        {
          height: 1,
          width: 4,
          form: [[1], [1], [1], [1]],
        },
        {
          height: 4,
          width: 1,
          form: [[1,1,1,1]]
        },
        {
          height: 1,
          width: 4,
          form: [[1], [1], [1], [1]],
        }
      ],
      image: IMAGES.i
    }, {
      // J block
      shapes: [
        {
          height: 3,
          width: 2,
          form: [[1,0,0], [1,1,1]]
        },
        {
          height: 2,
          width: 3,
          form: [[1,1], [1,0], [1,0]]
        },
        {
          height: 3,
          width: 2,
          form: [[1,1,1], [0,0,1]]
        },
        {
          height: 2,
          width: 3,
          form: [[0,1], [0,1], [1,1]]
        }
      ],
      image: IMAGES.l
    }, {
      // L block
      shapes: [
        {
          height: 3,
          width: 2,
          form: [[1,1,1], [1,0,0]]
        },
        {
          height: 2,
          width: 3,
          form: [[1,1], [0,1], [0,1]]
        },
        {
          height: 3,
          width: 2,
          form: [[0,0,1], [1,1,1]]
        },
        {
          height: 2,
          width: 3,
          form: [[1,0], [1,0], [1,1]]
        }
      ],
      image: IMAGES.l
    }, {
      // O block
      shapes: [
        {
          height: 2,
          width: 2,
          form: [[1,1], [1,1]]
        },
        {
          height: 2,
          width: 2,
          form: [[1,1], [1,1]]
        },
        {
          height: 2,
          width: 2,
          form: [[1,1], [1,1]]
        },
        {
          height: 2,
          width: 2,
          form: [[1,1], [1,1]]
        }
      ],
      image: IMAGES.o
    }, {
      // T block
      shapes: [
        {
          height: 3,
          width: 2,
          form: [[1,1,1], [0,1,0]]
        },
        {
          height: 2,
          width: 3,
          form: [[0,1], [1,1], [0,1]]
        },
        {
          height: 3,
          width: 2,
          form: [[0,1,0], [1,1,1]]
        },
        {
          height: 2,
          width: 3,
          form: [[1,0], [1,1], [1,0]]
        }
      ],
      image: IMAGES.t
    }, {
      // S block
      shapes: [
        {
          height: 3,
          width: 2,
          form: [[1,1,0], [0,1,1]]
        },
        {
          height: 2,
          width: 3,
          form: [[0,1], [1,1], [1,0]]
        },
        {
          height: 3,
          width: 2,
          form: [[1,1,0], [0,1,1]]
        },
        {
          height: 2,
          width: 3,
          form: [[0,1], [1,1], [1,0]]
        }
      ],
      image: IMAGES.s
    }, {
      // S block server
      shapes: [
        {
          height: 3,
          width: 2,
          form: [[0,1,1], [1,1,0]]
        },
        {
          height: 2,
          width: 3,
          form: [[1,0], [1,1], [0,1]]
        },
        {
          height: 3,
          width: 2,
          form: [[0,1,1], [1,1,0]]
        },
        {
          height: 2,
          width: 3,
          form: [[1,0], [1,1], [0,1]]
        }
      ],
      image: IMAGES.s
    }
  ][typeNumber];
}

Block.prototype.autoMove = function () {
  if (this.frozen) return;

  if (this.moveBy(this.direction)) {
    setTimeout(this.autoMove.bind(this), this.field.stepDelay);
  }
};

Block.prototype.freeze = function () {
  game.blockFrozen();
  this.frozen = true;

  this.field.freeze(this);
};

Block.prototype.destroy = function () {
  this.frozen = true;
}

Block.prototype.rotate = function (cw) {
  var newShapeIndex = (this.shapeIndex + (cw ? 3 : 1)) % 4;
  var newShape = this.type.shapes[this.shapeIndex];
  if(!this.field.isFree(this.pos, newShape)) return;

  this.field.register(this.pos, this, 0);
  this.shapeIndex = newShapeIndex;
  this.shape = newShape;
  this.buildSprites();
  this.field.register(this.pos, this, 1);
  this.render();
};

Block.prototype.fall = function (direction) {
  var step = Game.STEPS[direction];
  var startPos = this.pos;
  while(this.field.isFree([startPos[0] + step[0], startPos[1] + step[1]], this.shape)) {
    startPos[0] += step[0];
    startPos[1] += step[1];
    this.moveBy(direction);
  }
}
