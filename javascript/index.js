
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
  console.log(e.keyCode)
  console.log(keys)
  e.preventDefault()
})

window.addEventListener('keyup', (e) => {
  keys[e.keyCode] = 0
  console.log(keys)
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

var prev
const draw = (dt) => {
  ctx.clearRect(0,0,canvas.width, canvas.height)

  if (getKeyDown(32)) {
    ctx.fillStyle = "red"
  } else if (getKey(32)) {
    ctx.fillStyle = "orange"
  }

  ctx.fillRect(data.x, data.y, 10, 10)
  ctx.fillStyle = "black";
  ctx.fillText(dt*1000, 10, 10)
}

const data = {x:0, y:0, r:1}

const tick = (now) => {
  window.requestAnimationFrame(tick)

  const dt = (now - prev)/1000 // change in seconds
  prev = now

  data.r = (data.r + (dt * 10)) % (Math.PI*2)
  data.x = Math.sin(data.r) * 30 + 60
  data.y = Math.cos(data.r) * 30 + 60

  draw(dt)
}

prev = performance.now()
window.requestAnimationFrame(tick)