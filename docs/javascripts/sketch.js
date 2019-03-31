let pg = null;
let pg_origin = null;
let ps = [];
const PERTICLE_NUM = 500;
const HUE = 30;
const SAT = 70;
const VAL = 80;

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 100);
  smooth();
  frameRate(60);

  pg = createGraphics(width, height);
  pg.colorMode(RGB, 255, 255, 255, 100);
  pg.smooth();
  pg.noStroke();

  const d = 50;
  for (let i = 0; i < width; i += d) {
    for (let j = 0; j < height; j += d / 2) {
      let dx = 0;
      if (j % d === 0) {
        dx = d / 2;
      }
      const c = color(HUE, SAT / 4, 90, 100);
      pg.fill(red(c), green(c), blue(c), alpha(c));
      pg.ellipse(i + dx, j, 7, 7);
    }
  }

  const c = color(HUE, SAT, 80, 100);
  pg.fill(red(c), green(c), blue(c), alpha(c));

  pg.textAlign(CENTER, CENTER);
  pg.textStyle(BOLD);
  pg.textFont("serif");

  pg.textSize(250);
  pg.text("風化", width / 2, height / 2 - 50);
  pg.textSize(70);
  pg.text("WEATHERING", width / 2, height / 2 + 200);

  pg_origin = createGraphics(width, height);
  pg_origin.copy(pg, 0, 0, width, height, 0, 0, width, height);

  for (let i = 0; i < PERTICLE_NUM; i++) {
    ps.push(new Particle(random(-width, 0), random(0, height)));
  }
}

function draw() {
  background(HUE, SAT / 10, 100, 100);

  beginShape(POINTS);
  strokeWeight(1);
  ps.forEach(p => { p.update(); });
  endShape();

  const d = 50
  pg.copy(pg_origin, mouseX - d / 2, mouseY - d / 2, d, d, mouseX - d / 2, mouseY - d / 2, d, d);

  image(pg, 0, 0);
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = color(HUE, SAT, VAL, 30);
  }

  update() {
    if (getColorSum(pg, this.x, this.y) !== 0) {
      this.color = color(HUE, SAT, VAL, 100);
      pg.set(this.x, this.y, [0, 0, 0, 0]);
      pg.updatePixels();

      // あえて二重ループを脱出しない
      //loop1:
      for (let dx = -1; dx < 2; dx++) {
        for (let dy = -1; dy < 2; dy++) {
          if (dx === 0 && dy === 0) break;// loop1;
          if (getColorSum(pg, this.x + dx, this.y + dy) !== 0) {
            this.x += dx;
            this.y += dy;
            break;// loop1:
          }
        }
      }

    } else {
      this.x += 1;
      if (width <= this.x) {
        this.x = 0;
        this.y++;
        this.color = color(HUE, SAT, VAL, 30);
      }
      if (height <= this.y) {
        this.y = 0;
        this.color = color(HUE, SAT, VAL, 30);
      }
    }

    stroke(this.color);
    vertex(this.x, this.y);
  }
}

function getColorSum(pg, x, y) {
  let c = pg.get(x, y);
  if (c[0] === undefined) return 0;
  return red(c) + green(c) + blue(c);
}