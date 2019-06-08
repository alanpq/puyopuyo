



class Board {

  state = [];

  callback;

  constructor(width, height, callback){
      for( let l = height, row; l--; ){
        row = [];
        for( let k = width; k--; ){
          row.push(0)
        }
        this.state.push(row)
      }

      callback = callback;
  }

  EmitUpdate(){
    callback(this)
  };

  
}

let board = new Board(10,20,function(board){
  console.log(board.state);
})

console.log(board)
