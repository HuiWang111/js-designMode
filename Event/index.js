const Event = (function() {

  let Event,
      _default = 'default';

  Event = function() {
    let _listen,
        _trigger,
        _remove,
        _shift = Array.prototype.shift,
        _unshift = Array.prototype.unshift,
        namespaceCache = {},
        _create,
        each = function(ary, fn) {
          let ret;
          for (let i = 0, l = ary.length; i < l; i++) {
            const n = ary[i];
            ret = fn.call(n, i, n);
          }
          return ret;
        };
        
    _listen = function(key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };

    _remove = function(key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (let i = cache[key].length - 1; i > -1; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };

    _trigger = function() {
      let cache = _shift.call(arguments),
          key = _shift.call(arguments),
          args = arguments,
          _self = this,
          stack = cache[key];

      if (!stack || !stack.length) {
        return;
      }

      return each(stack, function() {
        return this.apply(_self, args);
      });
    }

    _create = function(namespace) {
      namespace = namespace || _default;
      let cache = {},
          offlineStack = [],
          ret = {
            listen(key, fn, last) {
              _listen(key, fn, cache);
              if (offlineStack === null) {
                return;
              }

              if (last === 'last') {
                offlineStack.length && offlineStack.pop()();
              } else {
                each(offlineStack, function() {
                  this();
                })
              }

              offlineStack = null;
            },
            one(key, fn, last) {
              _remove(key, cache);
              this.listen(key, fn, last);
            },
            remove(key, fn) {
              _remove(key, cache, fn);
            },
            trigger() {
              let fn,
                  args,
                  _self = this;

              _unshift.call(arguments, cache);
              args = arguments;
              fn = function() {
                return _trigger.apply(_self, args);
              }

              if (offlineStack) {
                offlineStack.push(fn);
              }

              return fn();
            }
          };

      return namespace ? 
        ( namespaceCache[namespace] ? namespaceCache[namespace] :
          namespaceCache[namespace] = ret )
            : ret;
    }

    return {
      create: _create,
      one(key, fn, last) {
        const event = this.create();
        event.one(key, fn, last);
      },
      remvoe(key, fn) {
        const event = this.create();
        event.remove(key, fn);
      },
      listen(key, fn, last) {
        const event = this.create();
        event.listen(key, fn, last);
      },
      trigger() {
        const event = this.create();
        event.trigger.apply(this, arguments);
      }
    };
  }()

  return Event;
})()