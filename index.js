// CANVAS
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// CANVAS WIDTH & HEIGHT
canvas.width = innerWidth;
canvas.height = innerHeight;

// PLAYER VARIABLES
const x = canvas.width / 2;
const y = canvas.height / 2;

// INITIALIZING PLAYER OBJECT
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
  }
}

// INITIALIZING PROJECTILE CLASS
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

// INITIALIZING ENEMY CLASS
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

// USING THE PLAYER CLASS
const player = new Player(x, y, 30, 'blue');

const projectiles = [];
const enemies = [];

const spawnEnemies = function () {
  setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 30;
    const color = 'green';
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x); //right angle of a triangle to the mouse click
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
      //gives me x and y velocity using the angle variable
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
};

// ANIMATION LOOP FUNCTION
const animate = function () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();

  projectiles.forEach((proj) => {
    proj.update();
  });
  enemies.forEach((enemy) => {
    enemy.update();
  });
};

// CREATING A PROJECTILE CLASS AFTER A PLAYER MOUSE CLICK
addEventListener('click', (e) => {
  const angle = Math.atan2(e.clientY - y, e.clientX - x); //right angle of a triangle to the mouse click
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
    //gives me x and y velocity using the angle variable
  };
  projectiles.push(new Projectile(x, y, 5, 'red', velocity));
});

// CALLING ANIMATION LOOP FUNCTION
animate();
spawnEnemies();