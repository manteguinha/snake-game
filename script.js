const canvas = document.getElementById('game-board')
const ctx = canvas.getContext('2d')
const scoreElement = document.getElementById('score')

const snakeSize = 20
const speed = 5

let snake = [
  { x: canvas.width / 2, y: canvas.height / 2 },
  { x: canvas.width / 2 - snakeSize, y: canvas.height / 2 },
  { x: canvas.width / 2 - 2 * snakeSize, y: canvas.height / 2 },
]
let food = getRandomFoodPosition()
let xVelocity = 1
let yVelocity = 0
let lastRenderTime = 0
let gameOver = false
let score = 0

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      if (yVelocity === 0) {
        xVelocity = 0
        yVelocity = -1
      }
      break
    case 'ArrowDown':
      if (yVelocity === 0) {
        xVelocity = 0
        yVelocity = 1
      }
      break
    case 'ArrowLeft':
      if (xVelocity === 0) {
        xVelocity = -1
        yVelocity = 0
      }
      break
    case 'ArrowRight':
      if (xVelocity === 0) {
        xVelocity = 1
        yVelocity = 0
      }
      break
  }
})

function main(currentTime) {
  if (gameOver) {
    if (confirm('Você perdeu. Pressione OK para reiniciar.')) {
      window.location.reload()
    }
    return
  }

  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000

  if (secondsSinceLastRender < 1 / speed) return

  lastRenderTime = currentTime

  updateSnake()
  checkDeath()
  drawBackground()
  drawSnake()
  drawFood()
}

window.requestAnimationFrame(main)

function updateSnake() {
  const newSnakeHead = {
    x: snake[0].x + xVelocity * snakeSize,
    y: snake[0].y + yVelocity * snakeSize,
  }

  if (equalPositions(newSnakeHead, food)) {
    expandSnake()
    food = getRandomFoodPosition()
  }

  snake.unshift(newSnakeHead)
  snake.pop()
}

function expandSnake() {
  snake.push({ ...snake[snake.length - 1] })
  score++ // Incrementa a pontuação
  scoreElement.textContent = score // Atualiza o conteúdo do elemento <span>
}

function drawSnake() {
  ctx.fillStyle = '#424242'
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize)
    ctx.strokeStyle = index === 0 ? '#212121' : '#616161'
    ctx.strokeRect(segment.x, segment.y, snakeSize, snakeSize)
  })
}

function drawFood() {
  ctx.fillStyle = 'red'
  ctx.fillRect(food.x, food.y, snakeSize, snakeSize)
  ctx.strokeStyle = 'darkred'
  ctx.strokeRect(food.x, food.y, snakeSize, snakeSize)
}

function drawBackground() {
  ctx.fillStyle = '#1b5e20'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function getRandomFoodPosition() {
  let newFoodPosition
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = {
      x: Math.floor(Math.random() * canvas.width / snakeSize) * snakeSize,
      y: Math.floor(Math.random() * canvas.height / snakeSize) * snakeSize,
    }
  }
  return newFoodPosition
}

function onSnake(position) {
  return snake.some((segment) => equalPositions(segment, position))
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

function checkDeath() {
  gameOver = outsideGrid() || snakeIntersection()
}

function outsideGrid() {
  return (
    snake[0].x < 0 ||
    snake[0].y < 0 ||
    snake[0].x > canvas.width - snakeSize ||
    snake[0].y > canvas.height - snakeSize
  )
}

function snakeIntersection() {
  return snake.slice(1).some((segment) => equalPositions(segment, snake[0]))
}