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
window.addEventListener('keydown', (e) => {
  keys[e.keyCode] = 2
  e.preventDefault()
})
window.addEventListener('keyup', (e) => {
  keys[e.keyCode] = 0
})
const getKey = (code) => {
  return keys[code] != 0
}
const getKeyDown = (code) => {
  const r = keys[code]
  if (r == 2) {
    keys[code] = 1
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
  positions: blocks.basic([1,2], 0)
}

var prev
const draw = (dt) => {
  ctx.clearRect(0,0,canvas.width, canvas.height)

  // if (getKeyDown(32)) {
  //   ctx.fillStyle = "red"
  // } else if (getKey(32)) {
  //   ctx.fillStyle = "orange"
  // }
  // console.log(activeBlockPositions)
  for(let i = 0; i < activeBlock.positions.length; i++) { 
    let block = activeBlock.positions[i];
    ctx.fillStyle = colors[block[2]]
    // console.log((30+block[0]+activeBlock.x)*10, (30+block[1]+activeBlock.y)*10)
    ctx.fillRect(30+(block[0]+activeBlock.x)*30, 30+(block[1]+activeBlock.y)*30, 30, 30);
  }

  for(let y = 0; y < testBoard.height; y++) {
    for(let x = 0; x < testBoard.width; x++) {
      ctx.fillStyle = colors[testBoard.state[y][x]]
      ctx.fillRect(30 + (x * 30), 30 + (y * 30), 30, 30)
      ctx.strokeStyle = "1px solid black"
      ctx.strokeRect(30 + (x * 30), 30 + (y * 30), 30, 30)
    }
  }

  

  // ctx.fillRect(data.x, data.y, 10, 10)
  ctx.fillStyle = "black";
  ctx.fillText(dt*1000, 10, 10)
}

const data = {x:0, y:0, r:1}

const tick = (now) => {
  window.requestAnimationFrame(tick)

  const dt = (now - prev)/1000 // change in seconds
  prev = now

  

  if (getKeyDown(65)) {
    activeBlock.x -= 1
  } else if (getKeyDown(68)) {
    activeBlock.x += 1
  } else if (getKeyDown(87)) {
    activeBlock.y -= 1
  } else if (getKeyDown(83)) {
    activeBlock.y += 1
  }

  if(getKeyDown(81)) {
    activeBlock.rot = (activeBlock.rot + 1) % 4
    activeBlock.positions = blocks.basic([1,2], activeBlock.rot)
  } else if (getKeyDown(69)) {
    activeBlock.rot = (activeBlock.rot - 1) % 4
    if (activeBlock.rot < 0) {
      activeBlock.rot += 4
    }
    activeBlock.positions = blocks.basic([1,2], activeBlock.rot)
  }

  if(getKeyDown(31)) {

  }

  // data.r = (data.r + (dt * 10)) % (Math.PI*2)
  // data.x = Math.sin(data.r) * 30 + 60
  // data.y = Math.cos(data.r) * 30 + 60

  draw(dt)
}

var testBoard = new Board(10,20,function(board){
  
});
testBoard.PlaceBlock(2,10,blocks.basic([2,3], activeBlock.rot));

// for( let i = 0; i < 4; i++){
//   testBoard.PlaceBasicShape(4,4,i,4,i+1);
// }
// testBoard.SettleBoard()


prev = performance.now()
window.requestAnimationFrame(tick)

