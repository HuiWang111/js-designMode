
/**
 * @description tween为一系列动画的算法
 */
const tween = {
  linear (t, b, c, d) {
    return c*t/d + b;
  },
  easeIn (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  strongEaseIn (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  strongEaseOut (t, b, c, d) {
    return c * ( (t = t / d - 1) * t * t * t * t + 1 ) + b;
  },
  sineaseIn (t, b, c, d) {
    return c * ( t /= d ) * t * t + b;
  },
  sineaseOut (t, b, c, d) {
    return c * ( (t = t / d - 1) * t * t + 1 ) + b;
  }
};

function Animate(dom) {
  this.dom = dom;
  this.startTime = 0;
  this.startPos = 0;
  this.endPos = 0;
  this.propertyName = null;
  this.easing = null;
  this.duration = null;
}

Animate.prototype.start = function(propertyName, endPos, duration, easing) {
  this.startTime = Date.now();
  this.startPos = this.dom.getBoundingClientRect()[propertyName];
  this.propertyName = propertyName;
  this.endPos = endPos;
  this.duration = duration;
  this.easing = tween[easing];

  let timeId = setInterval(() => {
    if (this.step() === false) {
      clearInterval(timeId);
      timeId = null;
    }
  }, 19);
}

Animate.prototype.step = function() {
  const t = Date.now();
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos);
    return false;
  }

  const pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
  this.update(pos);
}

Animate.prototype.update = function(pos) {
  this.dom.style[this.propertyName] = pos + 'px';
}

// 使用
const animate = new Animate(document.querySelector('div'));
animate.start('left', 500, 1000, 'strongEaseIn');