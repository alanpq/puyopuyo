class Chain {
  chain_power_table = [4,	13,	25,	32,	47,	91,	150,	221,	290,	356,	438,	516,	581,	652,	720,	785,	847,	888,	999]
  chain_power_index = 0
  current_colors = {}

  constructor(fever){
      this.puyos_cleared = 0
      this.chain_power = 0
      this.color_bonus = 0
      this.group_bonus = 0
  }

  Calculate(){
    return ( this.puyos_cleared * 10 ) * Math.max(Math.min( this.chain_power + this.color_bonus + this.group_bonus, 999),1)
  }

  IncrementChain(){
    if(this.chain_power_index < this.chain_power_table.length-1){
      this.chain_power_index++
      this.chain_power = this.chain_power_table[ this.chain_power_index ]
    }
  }

  AddColor(color){
    this.current_colors[color] = true
    let bonus_index = Object.keys(this.current_colors).length
    if( bonus_index < 2 ){
      this.color_bonus = 0
    } else {
      this.color_bonus = 3*Math.pow(2,bonus_index)
    }
  }

  AddGroup(size){
    this.puyos_cleared += size;

    if( size < 5 ){
      this.group_bonus += 0
    } else if( size > 10 ){
      this.group_bonus += 10
    } else {
      this.group_bonus += size-3
    }
  }
}

/*
  Score = (10 * PC) * (CP + CB + GB)

  PC = Number of puyo cleared in the chain.
  CP = Chain Power (These values are listed in the Chain Power Table.)
  CB = Color Bonus
  GB = Group Bonus
  The value of (CP + CB + GB) is limited to between 1 and 999 inclusive.*/


class Board {

  constructor(width, height, callback){
    this.state = state.SETTLING
    this.map = []
    this.match = 4

    this.score = 0;
    this.current_chain = new Chain();

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

  PlaceBlock(x,y,cells){
    for( let l = cells.length, block_x, block_y, color; --l; ){
      block_x = cells[l][0];
      block_y = cells[l][1];
      color = cells[l][2];
      this.SetCell(x+block_x,y+block_y,color);
    }
    this.SettleBoard()
    this.EmitUpdate()
  }

  TestIfBlockCollides(x,y,cells){
    for( let l = cells.length, block_x, block_y; --l; ){
      block_x = cells[l][0]
      block_y = cells[l][1]
      if( x+block_x < 0 || x+block_x > this.width-1 || block_y+y < 0 || block_y+y > this.height-1 ){
        return true
      }
      console.log(y+block_y,x+block_x)
      if( this.map[y+block_y][x+block_x] > 0){
        return true
      }
    }
    return false
  }

  TestRotationOffsetArray(x,y,cells,offsetArray){
    for( let i = 0, l = offsetArray.length, offset_x, offset_y; i < l; i++ ){
      offset_x = offsetArray[i][0]
      offset_y = offsetArray[i][1]

      if( this.TestIfBlockCollides(x+offset_x,y+offset_y,cells) == false ){
        return [offset_x,offset_y];
      }
    }
    return false
  }



  SettleBoard(){
    let changes = false;
    //interate up the board
    for(let y = this.height, x; y--; ){
      for( x = this.width; x--; ){
        //if current cell is not empty and the one below it is, move it down
        if( y < this.height-1 && this.map[y][x] > 0 && this.map[y+1][x] == 0 ){
            this.map[y+1][x] = this.map[y][x]
            this.map[y][x] = 0
            changes = true;
        }
      }
    }

    if(changes){
      this.EmitUpdate()
    }
    //if(changes)
      //this.SettleBoard();
    return changes;
  }

  DestroyGroups(){
    let changes = false;
    //interate up the board
    for(let y = this.height, x, block_group; y--; ){
      for( x = this.width; x--; ){
        //if cell has a block, i.e. is greater than 0
        if( this.map[y][x] > 0 ){
          //get surrounding cells that match in color
          block_group = this.CheckSurroundingCells(this.map[y][x],[x+","+y],[]);

          //if group of matching blocks is larger than or equal to match property
          if(block_group.length >= this.match){
            if(!changes){
              changes = true;
              this.current_chain.IncrementChainPower();
            }

            this.current_chain.AddColor(this.map[y][x]);

            this.current_chain.AddGroup(block_group.length);


            //set all those blocks to 0
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
    else {
      this.score += this.current_chain.Calculate()
      this.current_chain = new Chain();
    }

    return changes
  }

  //recursive function checks surrounding cells and adds any of the same color to an array
  CheckSurroundingCells(color,cells,checked_cells){
    let cellsToCheck = [];

    for( let i = 0, l = cells.length, pos, x, y; i < l; i++ ){
      pos = cells[i].split(",")
      x = parseInt(pos[0])
      y = parseInt(pos[1])

      //check surrounding cells so long as they aren't out of bounds or previously checked
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
/*
let board = new Board(10,20,function(board){
  console.log(board.PrintAsString());
});

for( let i = 0; i < 4; i++){

  //board.PlaceBlock(4,4,blocks.basic([9,i+1],i));
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
board.DestroyGroups()*/
