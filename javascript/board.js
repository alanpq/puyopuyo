class Board {

  constructor(width, height, callback){
    this.state = state.SETTLING
    this.map = []
    this.match = 4

    for( let l = height, row; l--; ){
      row = [];
      for( let k = width; k--; ){
        row.push(0)
      }
      this.map.push(row)
    }

    this.width = width;
    this.height = height;
    this.callback = callback;
  }

  EmitUpdate(){
    this.callback(this)
  };

  PrintAsString(){
    let str = "";
    for( let h = this.map.length; h--; ){
      str = this.map[h].join(" ")+"\n"+str;
    }
    return str;
  }

  SetCell(x,y,color){
    this.map[y][x] = color;
  }

  PlaceShape(x,y,blocks){
    for( let l = blocks.length, block_x, block_y, color; l--; ){
      block_x = blocks[l][0];
      block_y = blocks[l][1];
      color = blocks[l][2];
      console.log(l)
      this.SetCell(x+block_x,y+block_y,color);
    }
    this.SettleBoard()
    this.EmitUpdate()
  }

  SettleBoard(){
    let changes = false;
    //interate up the board
    for(let y = this.height, x; y--; ){
      for( x = this.width; x--; ){
        //if current block is not empty and the one below it is, move it down
        if( y < this.height-1 && this.map[y][x] > 0 && this.map[y+1][x] == 0 ){
            this.map[y+1][x] = this.map[y][x]
            this.map[y][x] = 0
            changes = true;
        }
      }
    }

    if(changes){
      this.EmitUpdate();
    }
    //if(changes)
      //this.SettleBoard();
    return changes;
  }

  DestroyGroups(){
    //interate up the board
    let changes = false;
    for(let y = this.height, x, block_group; y--; ){
      for( x = this.width; x--; ){
        //if current block is not empty and the one below it is, move it down
        if( this.map[y][x] > 0 ){
          block_group = this.CheckSurroundingCells(this.map[y][x],[x+","+y],[]);

          console.log(block_group)

          if(block_group.length >= this.match){
            changes = true;
            for( let i = 0, l = block_group.length, pos, x, y; i < l; i++ ){
              pos = block_group[i].split(",")
              x = parseInt(pos[0])
              y = parseInt(pos[1])
              this.map[y][x] = 0;
            }
          }
        }
      }
    }
    if( changes )
      this.EmitUpdate();
    return changes
  }

  //recursive function checks surrounding cells and adds any of the same color to an array
  CheckSurroundingCells(color,cells,checked_cells){
    let cellsToCheck = [];

    for( let i = 0, l = cells.length, pos, x, y; i < l; i++ ){
      pos = cells[i].split(",")
      x = parseInt(pos[0])
      y = parseInt(pos[1])

      //check surrounding blocks so long as they aren't out of bounds or previously checked
      if( x < this.width-1
        && !checked_cells.includes( (x+1)+","+y )
        && !cellsToCheck.includes( (x+1)+","+y )
        && this.map[y][x+1] == color ){
          cellsToCheck.push( (x+1)+","+y )
      }

      if( x > 0
        && !checked_cells.includes( (x-1)+","+y )
        && !cellsToCheck.includes( (x-1)+","+y )
        && this.map[y][x-1] == color ){
          cellsToCheck.push( (x-1)+","+y )
      }

      if( y < this.height-1
        && !checked_cells.includes( x+","+(y+1) )
        && !cellsToCheck.includes( x+","+(y+1) )
        && this.map[y+1][x] == color ){
          cellsToCheck.push( x+","+(y+1) )
      }

      if( y > 0
        && !checked_cells.includes( x+","+(y-1) )
        && !cellsToCheck.includes( x+","+(y-1) )
        && this.map[y-1][x] == color ){
          cellsToCheck.push( x+","+(y-1) )
      }

      checked_cells.push(cells[i])
    }

    //check surrounding cells of cells that were the same color
    if(cellsToCheck.length > 0){
      return this.CheckSurroundingCells(color,cellsToCheck,checked_cells)
    } else {
      return checked_cells
    }
  }

  SetBoardMap(map){
    for( let y = 0, h = Math.min(this.height,map.length), x, w; y < h; y++ ){
      for( x = 0, w = Math.min(this.width,map[y].length); x < w; x++ ){
        this.map[y][x] = map[y][x];
      }
    }
    this.EmitUpdate()
  }

}

let board = new Board(10,20,function(board){
  console.log(board.PrintAsString());
});

for( let i = 0; i < 4; i++){

  //board.PlaceShape(4,4,blocks.basic([9,i+1],i));
}

let test = "\
000000,\
333300,\
004040,\
040100,\
002100,\
001100,\
"

board.SetBoardMap(test.split(","))
board.SettleBoard()
board.DestroyGroups()
