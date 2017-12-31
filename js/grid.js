function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};

// Both tiles can merge
Grid.prototype.tilesCanMerge = function (atile, btile) {
    var merge = false;
    if (atile.x === btile.x && atile.y !== btile.y) {
        var max = btile.y;
        var min = atile.y;
        var x = atile.x;
        if (atile.y > max) {
            max = atile.y;
            min = btile.y;
        }

        // Go throught each cell to know if is available, leave when is occupied.
        var cell = null;
        var occupied = false;
        for (var y = min + 1; y < max && !occupied; y++) {
            cell = {x: x, y: y};
            occupied = !this.cellAvailable(cell);
        }
        // If any cell are not occupied then they can merge.
        merge = !occupied;
    } else if (atile.y === btile.y && atile.x !== btile.x) {
        var max = btile.x;
        var min = atile.x;
        var y = atile.y;
        if (atile.x > max) {
            max = atile.x;
            min = btile.x;
        }

        // Go throught each cell to know if is available, leave when is occupied.
        var cell = null;
        var occupied = false;
        for (var x = min + 1; x < max && !occupied; x++) {
            cell = {x: x, y: y};
            occupied = !this.cellAvailable(cell);
        }
        merge = !occupied;
    }

    return merge;
}
