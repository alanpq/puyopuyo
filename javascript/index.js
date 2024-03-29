const w = window,
    d = document,
    e = d.documentElement,
    g = d.body

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

const setResizeHandler = (callback, timeout) => {
  var timer_id = undefined
  window.addEventListener("resize", function() {
      if(timer_id != undefined) {
          clearTimeout(timer_id)
          timer_id = undefined
      }
      timer_id = setTimeout(function() {
          timer_id = undefined
          callback()
      }, timeout)
  })
}

const resizeCanvas = () => {
  canvas.width  = w.innerWidth  || e.clientWidth  || g.clientWidth
  canvas.height = w.innerHeight || e.clientHeight || g.clientHeight
}
setResizeHandler(resizeCanvas, 100)
resizeCanvas()

const keys = {}
const keyHandlers = {}
window.addEventListener('keydown', (e) => {
  if(keys[e.keyCode] >= 3) return;
  // console.log("down boy", keys[e.keyCode], performance.now())
  if(keyHandlers[e.keyCode] == undefined) {
    keys[e.keyCode] = 4
    // console.log("yeesh", keys[e.keyCode], performance.now())
    keyHandlers[e.keyCode] = setTimeout(() => {
      // console.log("phew", keys[e.keyCode])
      keys[e.keyCode] = 2
      // console.log(keys[e.keyCode])
    }, 100)
  }
  e.preventDefault()
})
window.addEventListener('keyup', (e) => {
  if(keyHandlers[e.keyCode]) {clearTimeout(keyHandlers[e.keyCode]); delete keyHandlers[e.keyCode]}
  delete keys[e.keyCode]
  console.log(e.key)
})
const getKeyHeld = (code) => {
  let k = keys[code]
  if (k == 4) {
    keys[code] = 3
    return true
  }
  return k == 2
}
const getKey = (code) => {
  return keys[code] != undefined
}
const getKeyDown = (code) => {
  let k = keys[code]
  if (k == 4) {
    keys[code] = 3
    return true
  }
  return false
}

const colors = [
  "transparent",
  "red",
  "green",
  "orange",
  "purple",
  "blue"
]

const activeBlock = {
  x:0,
  y:0,
  rot:0,
  colors:[1,2],
  positions: null,
  RotateBy: function(rot){
    console.log(this)
    let newRot = this.rot + rot;
    if( newRot < 0 ) newRot = 3;
    else if( newRot > 3 ) newRot = 0;

    let newPositions = blocks.basic(this.colors,newRot);

    console.log("newRot:", newRot)

    //get rotation tests for current rotations
    let tests = rotTests.basic(newRot)

    console.log("tests:", tests)

    //test if rotation possible
    let result = testBoard.TestRotationOffsetArray(this.x,this.y,newPositions,tests)

    console.log("result:", result);

    if(result){
      this.x += result[0]
      this.y += result[1]
      this.rot = newRot
      this.positions = newPositions
      console.log(this);
    }
    else if(Math.abs(rot) < 2){ // flip
      this.RotateBy(rot*2)
      //this.rot = mod((rot*2 - this.rot)*-1, 4);
      //this.positions = blocks.basic(this.colors,this.rot)
    }
  }
}
activeBlock.positions = blocks.basic(activeBlock.colors, 0)
console.log("Post-assignment:", blocks.basic(activeBlock.colors, 0))

var prev
const draw = (dt) => {
  ctx.clearRect(0,0,canvas.width, canvas.height)

  // ACTIVE BLOCK DRAWING
  for(let i = 0; i < activeBlock.positions.length; i++) {
    let block = activeBlock.positions[i]
    let x = activeBlock.x + block[0]
    let y = activeBlock.y + block[1]

    ctx.fillStyle = colors[block[2]]
    ctx.fillRect(30+x*30, 30+y*30, 30, 30)
  }

  // BOARD DRAWING
  for(let y = 0; y < testBoard.height; y++) {
    for(let x = 0; x < testBoard.width; x++) {
      ctx.fillStyle = colors[testBoard.map[y][x]]
      ctx.fillRect(30 + (x * 30), 30 + (y * 30), 30, 30)
      ctx.strokeStyle = "1px solid black"
      ctx.strokeRect(30 + (x * 30), 30 + (y * 30), 30, 30)
    }
  }

  ctx.fillStyle = "black"
  ctx.fillText(dt*1000, 10, 10)
  ctx.fillText(JSON.stringify(keys), 500, 10)
}

const data = {x:0, y:0, r:1}

var discreteTimer = 0;
var discreteTimer2 = 0;

var blockFallingDelay = 0.5;
var realBlockFallingDelay = 0.5;

var blockMovementDelay = 0.05;

const tick = (now) => {
  window.requestAnimationFrame(tick)

  const dt = (now - prev)/1000 // change in seconds
  prev = now

  switch(testBoard.state) {
    case state.SETTLING:
      discreteTimer += dt;
      if (discreteTimer > 0.05) {
        discreteTimer = 0
        if (!testBoard.SettleBoard()) {   // if settling the board does not result in a change, board is done settling
          if(!testBoard.DestroyGroups()) {          // and if after board is settled no groups are destroyed
            testBoard.state = state.DEFAULT  // return to normal play
          } else {
            //TODO print current score
            //testBoard.score
          }
        } else {
          //TODO print current chain multiplier
          //testBoard.current_chain.chain_power
        }
      }
    break;

    case state.DEFAULT:
      // TIMED BLOCK FALLING (aka gravity)
      discreteTimer += dt;
      discreteTimer2 += dt;
      if (discreteTimer > realBlockFallingDelay) {
        discreteTimer = 0;
        if( !testBoard.TestIfBlockCollides(activeBlock.x,activeBlock.y+1,activeBlock.positions) ){
          activeBlock.y += 1
        }
      }

      // ACTIVE BLOCK MOVEMENT
      if(discreteTimer2 > blockMovementDelay) {
        discreteTimer2 = 0;
        if (getKeyHeld(65) && !testBoard.TestIfBlockCollides(activeBlock.x-1,activeBlock.y,activeBlock.positions)) {
          activeBlock.x -= 1
        } else if (getKeyHeld(68) && !testBoard.TestIfBlockCollides(activeBlock.x+1,activeBlock.y,activeBlock.positions)) {
          activeBlock.x += 1
        }
      }
      if (getKey(83)) {
        realBlockFallingDelay = blockFallingDelay * 0.1
      } else {
        realBlockFallingDelay = blockFallingDelay
      }
      //else if (getKeyDown(87)) {
      //   activeBlock.y -= 1
      // }
      // ACTIVE BLOCK ROTATION
      if(getKeyDown(81)) {
        activeBlock.RotateBy(1)
      } else if (getKeyDown(69)) {
        activeBlock.RotateBy(-1)
      }

      // MISC KEYS
      if(getKeyDown(32)) { //SPACEBAR - Place block
        testBoard.PlaceBlock(activeBlock.x, activeBlock.y, activeBlock.positions)
      }
      if(getKeyDown(71)) { //G - Destroy Groups
        testBoard.DestroyGroups()
      }
      if(getKeyDown(78)) { //N - Force Settle Board
        testBoard.SettleBoard()
      }

      // COLLISION DETECTION
      /*for(let i = 0; i < activeBlock.positions.length; i++) {
        let block = activeBlock.positions[i]
        let x = activeBlock.x + block[0]
        let y = activeBlock.y + block[1]

        if(x<0)                 activeBlock.x += 1;
        if(x>=testBoard.width)  activeBlock.x -= 1;
        if(y>=testBoard.height) activeBlock.y -= 1;
      }*/
    break;
    default:

    break;
  }



  // data.r = (data.r + (dt * 10)) % (Math.PI*2)
  // data.x = Math.sin(data.r) * 30 + 60
  // data.y = Math.cos(data.r) * 30 + 60

  draw(dt)
}

var testBoard = new Board(10,20,function(board){

});
//testBoard.PlaceBlock(2,10,blocks.basic([2,3], activeBlock.rot));
let test = "\
000000000,\
333300000,\
004040000,\
040100000,\
002100202,\
001100101,\
"

testBoard.SetBoardMap(test.split(","))


// for( let i = 0; i < 4; i++){
//   testBoard.PlaceBasicShape(4,4,i,4,i+1);
// }
// testBoard.SettleBoard()


prev = performance.now()
window.requestAnimationFrame(tick)
