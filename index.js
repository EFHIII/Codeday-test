const ACCELERATION = 1/100;

let can = document.getElementById('canvas');
let ctx = can.getContext('2d');
ctx.fillStyle = 'rgb(255,0,0)';

let keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

// player is the 0th projectile
let projectiles = [];

function addProjectile(type, x, y, vx, vy, sx, sy, c = '#f00') {
  projectiles.push({
    type,
    x: x - sx/2,
    y: y - sy/2,
    vx,
    vy,
    sx,
    sy,
    c
  });
}

let player = projectiles[0];

function resetGame() {
  projectiles = [];
  addProjectile('player', 300, 300, 0, 0, 40, 40, '#00f');
  player = projectiles[0];
}

function drawProjectiles() {
  for(let p of projectiles) {
    ctx.fillStyle = p.c;
    p.x += p.vx;
    p.y += p.vy;

    if(p.x > 600-p.sx/2) {
      p.x -= 600;
    }
    if(p.y > 600-p.sy/2) {
      p.y -= 600;
    }
    if(p.x < -p.sx/2) {
      p.x += 600;
    }
    if(p.y < -p.sy/2) {
      p.y += 600;
    }

    ctx.fillRect(p.x, p.y, p.sx, p.sy);
  }
}

function spawnAstroid() {
  if(Math.random() < 1/2000) {
    addProjectile('astroid', Math.random()*600, 0, Math.random()*2-1, Math.random()*2-1, Math.random()*50+20, Math.random()*50+20, '#fff');
  }
  if(Math.random() < 1/2000) {
    addProjectile('astroid', 0, Math.random()*600, Math.random()*2-1, Math.random()*2-1, Math.random()*50+20, Math.random()*50+20, '#fff');
  }
  if(Math.random() < 1/2000) {
    addProjectile('astroid', Math.random()*600, 600, Math.random()*2-1, Math.random()*2-1, Math.random()*50+20, Math.random()*50+20, '#fff');
  }
  if(Math.random() < 1/2000) {
    addProjectile('astroid', 0, Math.random()*600, 600, Math.random()*2-1, Math.random()*2-1, Math.random()*50+20, Math.random()*50+20, '#fff');
  }
}

function aabb(a, b) {
  return (
    a.x <= b.x + b.sx &&
    a.x+a.sx >= b.x &&
    a.y <= b.y+b.sy &&
    a.y+a.sy >= b.y
  );
}

function collideCheck() {
  for(let p1 = 0; p1 < projectiles.length; p1++) {
    for(let p2 = p1 + 1; p2 < projectiles.length; p2++) {
      let pr1 = projectiles[p1];
      let pr2 = projectiles[p2];
      if(
          ((pr1.type === 'astroid' && pr2.type === 'bullet') ||
          (pr1.type === 'astroid' && pr2.type === 'bullet')
        )
        && aabb(pr1, pr2)) {
        projectiles.splice(p2, 1);
        p2--;
        projectiles.splice(p1, 1);
        p1--;
      }
      if(
        (
          (pr1.type === 'player' && (pr2.type === 'astroid' || pr2.type === 'bullet')) ||
          (pr2.type === 'player' && (pr1.type === 'astroid' || pr1.type === 'bullet'))
        )
        && aabb(pr1, pr2)) {
        alert('You lose. Go home. Game over.');
        resetGame();
      }
    }
  }
}

function draw() {
  // draw background
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, 600, 600);

  // update player position
  if(keys.w) {
    player.vy -= ACCELERATION;
  }
  if(keys.s) {
    player.vy += ACCELERATION;
  }
  if(keys.a) {
    player.vx -= ACCELERATION;
  }
  if(keys.d) {
    player.vx += ACCELERATION;
  }

  spawnAstroid();
  collideCheck();
  drawProjectiles();

  // Draw the next frame
  window.requestAnimationFrame(draw);
}

document.body.addEventListener('keydown', (e) => {
  //console.log(e.key);
  keys[e.key] = true;

  if(e.key === ' ') {
    let vel = Math.sqrt(player.vx * player.vx + player.vy + player.vy);
    let normalizedV = {
      x: player.vx / vel,
      y: player.vy / vel
    };
    addProjectile('bullet', player.x+player.sx/2 + normalizedV.x * player.sx, player.y+player.sy/2 + normalizedV.y * player.sx, player.vx*2, player.vy*2, 20, 20);
  }
})

document.body.addEventListener('keyup', (e) => {
  //console.log(e.key);
  keys[e.key] = false;
})

draw();
