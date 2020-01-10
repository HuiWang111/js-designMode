/**
 * 策略模式是定义一系列的算法，并且把他们封装起来。策略模式也可以用于封装一系列业务规则。只要这些业务规则指向的目标一致，并且可以被替换使用，我们就可以使用策略模式封装它们。
 */

const strategies = {
  isEmpty (value, errorMsg) {
    if (value === '') {
      return errorMsg;
    }
  },
  minLength (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile (value, errorMsg) {
    if (!/^1[3|5|8][0-9]{9}$/.test(value)) {
      return errorMsg;
    }
  }
};

function Validator() {
  this.cache = [];
}

Validator.prototype.add = function(node, rules) {
  rules.forEach(rule => {
    const arr = rule.strategy.split(':');
    const errorMsg = rule.errorMsg;

    this.cache.push(function() {
      const strategy = arr.shift();
      arr.unshift(node.value);
      arr.push(errorMsg);
      return strategies[strategy].apply(node, arr);
    });
  });
}

Validator.prototype.start = function() {
  let i = -1,
      fn,
      len = this.cache.length;

  while(++i < len) {
    fn = this.cache[i];
    const errorMsg = fn();
    if (errorMsg) {
      return errorMsg;
    }
  }
}

// 使用
const registerForm = document.querySelector('#registerForm');

const validateFunc = function() {
  const validator = new Validator();

  validator.add(registerForm.username, [{
    strategy: 'isEmpty',
    errorMsg: '用户名不能为空'
  }]);
  validator.add(registerForm.password, [{
    strategy: 'minLength:6',
    errorMsg: '密码不能小于6位'
  }]);
  validator.add(registerForm.phoneNumber, [{
    strategy: 'isMobile',
    errorMsg: '请输入正确的手机号'
  }]);

  const errorMsg = validator.start();
  return errorMsg;
}

registerForm.onsubmit = function(e) {
  e.preventDefault();
  
  const errorMsg = validateFunc();
  if (errorMsg) {
    console.log(errorMsg);
  }
}