
/* canvas init */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

/* svg init */
const svgjs = SVG('svgcont')
var bird = svgjs.circle().radius(10)
window.bird = bird
bird.fill('red').move(-9999, -9999)

/* vars */
const durationAround = 34450;
let currentDegree;
let forrigeUtslag = 50
const hits = [
]
const beginningTime = new Date()

/* 
  Canvas drawing functions:
*/

/* Draw background with all taps */

function drawBG(currentDegree) {
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = "#6bff68"

  const taps = 100
  for (let i = 0; i < taps; i++) {
    const degree = (i / taps) * Math.PI * 2

    let extraLength
    let color
    extraLength = 0
    color = '#6bff68'

    let close
    const diffDegree = (degree - currentDegree) % (Math.PI * 2)
    if (Math.abs(diffDegree) < 0.2) {
      close = 1 - Math.abs(diffDegree) / 0.2
    } else {
      close = false
    }

    if (close) {
      ctx.lineWidth = 3 + 4 * close
    } else {
      ctx.lineWidth = 3
    }

    ctx.strokeStyle = color
    ctx.beginPath();
    const from = degreesToXY(degree, 280 - extraLength)
    ctx.moveTo(from.x, from.y)
    const to = degreesToXY(degree, 300 + 7 * close)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }
}

/* Draw radar */
function drawRadar(currentDegree) {
  ctx.lineWidth = 3
  const from = degreesToXY(currentDegree, 0)
  ctx.moveTo(from.x, from.y)
  const to = degreesToXY(currentDegree, 250)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}

/* Draw text */
function drawText(currentDegree) {
  ctx.fillStyle = "#6bff68"
  const from = degreesToXY(currentDegree + Math.PI, 20)
  ctx.fillText(Math.round(currentDegree / Math.PI * 180), from.x, from.y)
}


/* Calls all draw functions continously */

function renderLoop() {
  // clear canvas
  ctx.fillRect(0, 0, w, h);

  const nowTime = new Date();

  const durationTime = (nowTime - beginningTime) % durationAround
  const progress = durationTime / durationAround
  currentDegree = progress * Math.PI * 2

  drawBG(currentDegree);
  drawRadar(currentDegree)
  drawText(currentDegree)

  requestAnimationFrame(renderLoop);
}

renderLoop();


/* Trigonometric helper function */
function degreesToXY(degrees, distance) {
  const half = w / 2
  return {
    x: half + Math.sin(degrees) * distance,
    y: half + Math.cos(degrees) * distance
  }
}

/* Add (svg) bird */
function addBird(degree, distance) {
  if (distance > 50) {
    return
  }
  const from = degreesToXY(degree, Math.min(250 * (distance / 50), 250))

  const newbird = bird.clone()
  setTimeout(() => {
    newbird.node.remove()
  }, (durationAround / 2) - 1000)
  newbird.move(from.x, from.y)
    .animate({
      delay: (durationAround / 2) - 1000,
      duration: 3000
    }).opacity(0)
}

function registerHit(data) {
  hits.push({
    degree: currentDegree,
    distance: 0.5,
    bird: addBird(currentDegree, data)
  })
  forrigeUtslag = data
}

/* 
  Connectivity:
*/

var socket = io('http://172.20.10.11:3000');
socket.on('connect', function () {
  console.log('connected')
});

socket.on('a', function (data) {
  console.log('asdf', data)
  data.split('\n').forEach(function (asdfff, i) {
    // if(i == 0)
    registerHit(asdfff)
  })
});

socket.on('disconnect', function () {
  console.log('disconnected')
});
