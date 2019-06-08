

<<<<<<< HEAD


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
=======
const w = window,
    d = document,
    e = d.documentElement,
    g = d.body;

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
  canvas.width  = w.innerWidth || e.clientWidth || g.clientWidth
  canvas.height = w.innerHeight|| e.clientHeight|| g.clientHeight
}
setResizeHandler(resizeCanvas, 100)
resizeCanvas()

var prev;
const draw = (dt) => {
  ctx.clearRect(0,0,canvas.width, canvas.height);

  ctx.fillRect(data.x, data.y, 10, 10);
  ctx.fillText(dt*1000, 10, 10);


}

var data = {x:0, y:0, r:1}

const tick = (now) => {
  window.requestAnimationFrame(tick);

  const dt = (now - prev)/1000; // change in seconds
  prev = now;

  data.r = (data.r + (dt * 10)) % (Math.PI*2);
  data.x = Math.sin(data.r) * 30 + 60;
  data.y = Math.cos(data.r) * 30 + 60;

  draw(dt);

}
prev = performance.now()
window.requestAnimationFrame(tick);
>>>>>>> 03ce0bc9adafd51309b554ad5bbbbb80bfd49398
