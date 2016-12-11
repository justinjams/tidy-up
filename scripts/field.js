var canvas,
    context,
    height,
    width,
    hwidth,
    hheight,
    offsetX,
    offsetY,
    sprite,
    bgCanvas,
    bgContext;

var grid = [],
    gridBlocks = [];
window.Field = function () {
  canvas = document.getElementById('game');
  canvas.width = Game.WIDTH;
  canvas.height = Game.HEIGHT;
  context = canvas.getContext('2d');

  bgCanvas = document.getElementById('bg');
  bgCanvas.style.backgroundImage = 'url(img/bg.png)';
  bgCanvas.style.backgroundSize = 'cover';
  bgCanvas.width = Game.WIDTH;
  bgCanvas.height = Game.HEIGHT;
  bgContext = bgCanvas.getContext('2d');

  offsetX = 1;
  offsetY = 2;
  this.width = width = 16;
  hwidth = 8;
  this.height = height = 12;
  hheight = 6;

  for(var i=0; i<width; i++) {
    grid[i] = [];
    gridBlocks[i] = [];
    for(var j=0; j<height; j++) {
      grid[i][j] = 0;
    }
  }

  this.stepDelay = 1000;
};

Field.prototype.render = function () {
  context.clearRect(
    offsetX * Game.BLOCK_SIZE * 2,
    offsetY * Game.BLOCK_SIZE * 2,
    width * Game.BLOCK_SIZE * 2,
    height * Game.BLOCK_SIZE * 2
  );
};

Field.prototype.addBlock = function (direction) {
  var startPos = this.getCenter();

  var block = new Block({
    context: context,
    pos: startPos,
    field: this,
    direction: direction
  });

  var opposite = (direction + 2) % 4;
  block.fall(opposite);

  if(!this.isFree(startPos, block.shape)) {
    return game.end();
  }

  block.activate();

  this.register(startPos, block, 1);

  return block;
};

Field.prototype.register = function (pos, block, state, single) {
  fn = function(i, j) {
    var x = pos[0] + i;
    var y = pos[1] + j;
    grid[x][y] = state;
    gridBlocks[x][y] = state == 0 ? null : block;
  };
  single ? fn(0, 0) : block.eachInShape(fn);
};


Field.prototype.getCenter = function () {
  var pos = [
    height/2|0,
    width/2|0,
  ];
  return pos;
};

Field.prototype.getOffsets = function () {
  return [
    offsetX,
    offsetY
  ];
};

Field.prototype.getContext = function () {
  return context;
};

Field.prototype.isFree = function (pos, shape) {
  var newPos;

  for(var i=0; i<shape.width; i++) {
    for(var j=0; j<shape.height; j++) {
      if(shape.form[i][j]) {
        newPos = [
          pos[0] + i,
          pos[1] + j
        ];

        if(newPos[0] < 0 || newPos[1] < 0 || newPos[0] >= width || newPos[1] >= height || grid[newPos[0]][newPos[1]] == 2) {
          //console.log('collision at', newPos, height, width)
          return false;
        }
      }
    }
  }

  return true;
};

Field.prototype.freeze = function (block) {
  this.register(block.pos, block, 2);
  block.changeContext(bgContext);

  var hCombos = [];
  for(var i=0; i<width; i++) hCombos[i] = 1;
  var vCombos = [];
  for(var i=0; i<height; i++) vCombos[i] = 1;

  var exploded = 0;
  for(var i=0; i<width; i++) {
    for(var j=0; j<height; j++) {
      hCombos[i] &= grid[i][j] === 2
      vCombos[j] &= grid[i][j] === 2
    }
  }

  [
    [
      [ 0, 0 ],
      [ hwidth, hheight ],
      1
    ],
    [
      [ width-1, height-1 ],
      [ hwidth-1, hheight-1 ],
      -1
    ]
  ].forEach(function(config) {
    var start = config[0];
    var end = config[1];
    var d = config[2];
    var offsets = [];
    var seq = 0;
    for(var i=start[0]; i!=end[0]; i+=d) {
      offsets.push(seq)
      if(hCombos[i]) {
        seq++;
        for(var j=0; j<height; j++) {
          gridBlocks[i][j].destroy();
          exploded++;
        }
      }
    }

    for(var i=start[0]; i!=end[0]; i+=d) {
      var offset = offsets.pop();
      if(!offset) continue;

      for(var j=0; j<height; j++) {
        if(offset && gridBlocks[i][j]) {
          gridBlocks[i][j].fall(d * offset, 0)
        }
      }
    }

    var offsets = [];
    var seq = 0;
    for(var i=start[1]; i!=end[1]; i+=d) {
      offsets.push(seq)
      if(vCombos[i]) {
        seq++;
        for(var j=0; j<width; j++) {
          gridBlocks[j][i].destroy();
          exploded++;
        }
      }
    }

    for(var i=start[1]; i!=end[1]; i+=d) {
      var offset = offsets.pop();
      if(!offset) continue;

      for(var j=0; j<width; j++) {
        if(offset && gridBlocks[j][i]) {
          gridBlocks[j][i].fall(0, d * offset)
        }
      }
    }
  });

  game.increaseScore(exploded*exploded*5)
};
