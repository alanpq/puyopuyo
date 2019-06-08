
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

  PlaceBasicShape(x,y,orientation,color1,color2){
    //x is an int with possible values: 0 to board.width
    //y is an int with possible values: 0 to board.height
    //orientation 0, 1, 2, 3
    //color1/color2

    //place first block
    this.PlaceBlock(x,y,color1)

    //figure out where second block should go
    orientation-=1
    //orientation -1 0 1 2
    if( orientation == -1 || orientation == 1 ){
      y += orientation;
    }
    orientation-=1
    //orientation -2 -1 0 1
    if( orientation == -1 || orientation == 1 ){
      x += orientation;
    }

    //place second block
    this.PlaceBlock(x,y,color2)
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
        this.CheckSurroundingCells([{
          x:x,
          y:y,
          color:this.state[y][x]
        }])
        if( y < this.height-1 && this.state[y][x] > 0 && this.state[y+1][x] == 0 ){
            this.state[y+1][x] = this.state[y][x]
            this.state[y][x] = 0
            changes = true
        }
      }
    }
  }

  //recursive function checks surrounding cells and adds any of the same color to an array
  CheckSurroundingCells(cells){

  }

}

let board = new Board(10,20,function(board){
  console.log(board.PrintAsString());
});

for( let i = 0; i < 4; i++){
  board.PlaceBasicShape(4,4,i,4,i+1);
}
board.SettleBoard()
