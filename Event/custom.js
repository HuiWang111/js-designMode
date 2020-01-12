const ListnerCache = (function() {
  const _default = 'default';

  function ListnerCache() {
    Object.defineProperty(this, 'list', {
      value: {}
    });
    Object.defineProperty(this, 'current', {
      value: _default,
      writable: true
    });
    Object.defineProperty(this.list, _default, {
      value: {},
      configurable: false
    });
  }

  Object.assign(ListnerCache.prototype, {
    add(key, fn, namespace) {
      namespace = namespace || this.current;

      if (!this.list[namespace][key]) {
        this.list[namespace][key] = [];
      }
      this.list[namespace][key].push(fn);
      return this;
    },
    has(key, fn, namespace) {
      namespace = namespace || this.current;
      const listeners = this.list[namespace][key];

      if (!fn) {
        return listeners && listeners.length > 0;
      } else {
        for (let i = 0, len = listeners.length; i < len; i++ ) {
          if (fn === listeners[i]) {
            return true;
          }
        }
        return false;
      }
    },
    remove(key, fn, namespace) {
      namespace = namespace || this.current;
      const listeners = this.list[namespace][key];

      if (!fn) {
        this.list[key].length = 0;
      } else {
        for (let i = listeners.length - 1; i > -1; i-- ) {
          if (fn === listeners[i]) {
            return listeners.splice(i, 1);
          }
        }
      }
      return this;
    },
    get(key, namespace) {
      namespace = namespace || this.current;
      if (this.list[namespace]) {
        return this.list[namespace][key];
      }
      return undefined;
    },
    addNamespace(namespace) {
      if (this.list[namespace]) {
        return false;
      }
      Object.defineProperty(this.list, namespace, {
        value: {},
        configurable: true
      });
      return this;
    },
    hasNamespace(namespace) {
      return !!this.list[namespace];
    },
    removeNamespace: function(namespace, newNamespace) {
      if (!this.hasNamespace(namespace)) {
        return false;
      }
      delete this.list[namespace];
      this.setCurrentNamespace(newNamespace || _default);
      return this;
    },
    setCurrentNamespace(namespace) {
      if (!this.hasNamespace(namespace)) {
        return false;
      }
      this.current = namespace;
      return this;
    }
  });

  return ListnerCache;
})()

const Event = (function() {
  function Event() {
    this.listenerList = new ListnerCache();
  }

  Object.assign(Event.prototype, {
    addListener(key, fn) {
      this.listenerList.add(key, fn);
      return this;
    },
    removeListener(key, fn) {
      this.listenerList.remove(key, fn);
      return this;
    },
    create(namespace) {
      if (!this.listenerList[namespace]) {
        this.listenerList.addNamespace(namespace);
      }
      this.setCurrentNamespace(namespace);
      return this;
    },
    trigger() {
      const key = Array.prototype.shift.call(arguments);
      const listeners = this.listenerList.get(key);
      for (let i = 0, fn; fn = listeners[i++];) {
        fn.apply(this, arguments);
      }
    }
  });

  return Event;
})()