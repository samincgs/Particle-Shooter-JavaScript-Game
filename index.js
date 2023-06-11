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
const player = new Player(x, y, 12, '#fff');

const projectiles = [];
const enemies = [];

const spawnEnemies = function () {
  setInterval(() => {
    const radius = Math.random() * (30 - 8) + 8;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const hue = Math.random() * 360;
    const color = `hsl(${hue}, 50%, 50%)`;
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
let animationId;
const animate = function () {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0,0,0,0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  projectiles.forEach((proj, index) => {
    proj.update();

    if (
      proj.x + proj.radius < 0 ||
      proj.x - proj.radius > canvas.width ||
      proj.y + proj.radius < 0 ||
      proj.y - proj.radius > canvas.height
    ) {
      //off the screen on the left
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, i) => {
    enemy.update();

    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (distance - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
    }

    projectiles.forEach((proj, pi) => {
      const distance = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
      if (distance - enemy.radius - proj.radius < 1) {
        //when projectile touches enemy
        setTimeout(() => {
          enemies.splice(i, 1);
          projectiles.splice(pi, 1);
        }, 0);
      }
    });
  });
};

// CREATING A PROJECTILE CLASS AFTER A PLAYER MOUSE CLICK
addEventListener('click', (e) => {
  const angle = Math.atan2(e.clientY - y, e.clientX - x); //right angle of a triangle to the mouse click
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
    //gives me x and y velocity using the angle variable
  };
  projectiles.push(new Projectile(x, y, 5, 'white', velocity));
});

// CALLING ANIMATION LOOP FUNCTION
animate();
spawnEnemies();
