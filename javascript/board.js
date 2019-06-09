
class Board {

  constructor(width, height, callback){
    this.state = [];
    this.match = 4;

    for( let l = height, row; l--; ){
      row = [];
      for( let k = width; k--; ){
        row.push(0)
      }
      this.state.push(row)
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
    for( let h = this.state.length; h--; ){
      str = this.state[h].join(" ")+"\n"+str;
    }
    return str;
  }

  PlaceBlock(x,y,color){
    this.state[y][x] = color;
  }

  PlaceShape(x, y, blocks){
    console.log(blocks)
    for( let l = blocks.length, color; --l; ){
      let xx = blocks[l][0] + x;
      let yy = blocks[l][1] + y;
      console.log(xx,yy)
      color = blocks[l][2];
      this.PlaceBlock(xx,yy,color);
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
        if( y < this.height-1 && this.state[y][x] > 0 && this.state[y+1][x] == 0 ){
            this.state[y+1][x] = this.state[y][x]
            this.state[y][x] = 0
            changes = true;
        }
      }
    }

    this.EmitUpdate();
    if(changes)
      this.SettleBoard();

  }

  DestroyGroups(){
    //interate up the board
    for(let y = this.height, x; y--; ){
      for( x = this.width; x--; ){
        //if current block is not empty and the one below it is, move it down
        this.CheckSurroundingCells(this.state[y][x],[x+","+y],[]);

        if( y < this.height-1 && this.state[y][x] > 0 && this.state[y+1][x] == 0 ){
            this.state[y+1][x] = this.state[y][x]
            this.state[y][x] = 0
            changes = true
        }
      }
    }
  }

  //recursive function checks surrounding cells and adds any of the same color to an array
  CheckSurroundingCells(color,cells,checked_cells){
    let cellsToCheck = [];

    for( let i = 0, l = cells.length, pos; i < l; i++ ){
      pos = cells[i].split(",")

      if( pos[0] < this.width-1 && !checked_cells.includes( (pos[0]+1)+","+pos[1]) ){

      }



    }
  }

}

// let board = new Board(10,20,function(board){
//   console.log(board.PrintAsString());
// });

// for( let i = 0; i < 4; i++){
//   board.PlaceBasicShape(4,4,i,4,i+1);
// }
// board.SettleBoard()
