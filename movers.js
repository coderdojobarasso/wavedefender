class Mover {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.mass = 1;
  }

  applyForce(force) {
    let acceleration = p5.Vector.div(force, m);
    this.velocity.add(acceleration);
  }

  update() {
    this.position.add(this.velocity);
  }

  render() {
    ellipseMode(CENTER);
    ellipse(this.position.x, this.position.y, 10 * this.mass);
  }

  isAlive() {
    return (
      this.position.x >= 0 &&
      this.position.x <= width &&
      this.position.y >= 0 &&
      this.position.y <= width
    );
  }

  static random() {
    let m = new Mover(
      new p5.Vector(random(width), random(height)),
      p5.Vector.random2D().limit(5)
    );
    return m;
  }
}

class Bullet extends Mover {
  constructor(position, velocity, frames, damage) {
    super(position, velocity);
    this.frames = frames;
    this.damage = damage;
  }

  render() {
    imageMode(CENTER);
    image(this.frames[0], this.position.x, this.position.y);
  }

  static random(frames, damage) {
    let m = new Bullet(
      new p5.Vector(random(width), random(height)),
      p5.Vector.random2D().limit(5),
      frames,
      damage
    );
    return m;
  }
}

class Ghost extends Bullet {
  constructor(position, velocity, frames, damage) {
    super(position, velocity, frames, damage);
    this.frame=0;
  }

  update() {
    super.update();
    this.position.add(this.velocity);
    this.frame += frameSpeed;
    if (Math.floor(this.frame) >= this.frames.length) this.frame = 0;
  }
  
  render() {
    imageMode(CENTER);
    image(this.frames[Math.floor(this.frame)], this.position.x, this.position.y);
  }

  static random(frames, damage) {
    let m = new Ghost(
      new p5.Vector(random(width), random(height)),
      p5.Vector.random2D().limit(0.5),
      frames,
      damage
    );
    return m;
  }
}