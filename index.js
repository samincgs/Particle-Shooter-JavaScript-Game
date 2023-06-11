// CANVAS
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreEl = document.querySelector('#score');
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

const friction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

// USING THE PLAYER CLASS
const player = new Player(x, y, 12, '#fff');

const projectiles = [];
const enemies = [];
const particles = [];

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
let score = 0;
const animate = function () {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0,0,0,0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  particles.forEach((part, i) => {
    if (part.alpha <= 0) {
      particles.splice(i, 1);
    } else {
      part.update();
    }
  });
  projectiles.forEach((proj, index) => {
    proj.update();

    if (
      proj.x + proj.radius < 0 ||
      proj.x - proj.radius > canvas.width ||
      proj.y + proj.radius < 0 ||
      proj.y - proj.radius > canvas.height
    ) {
      //off the screen all 4 sides
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
        for (let i = 0; i < enemy.radius * 2; i++) {
          //creating explosions
          particles.push(
            new Particle(proj.x, proj.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 7),
              y: (Math.random() - 0.5) * (Math.random() * 7),
            })
          );
        }

        //when projectile touches enemy
        if (enemy.radius - 10 > 5) {
          //increase score
          score += 50;
          scoreEl.textContent = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(pi, 1);
          }, 0);
        } else {
          //increase score
          score += 150;
          scoreEl.textContent = score;
          setTimeout(() => {
            enemies.splice(i, 1);
            projectiles.splice(pi, 1);
          }, 0);
        }
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
