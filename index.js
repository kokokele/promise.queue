/**
 * file queue promise
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports && typeof require === 'function') {
      // CommonJS
      module.exports = factory();
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
      // AMD. Register as an anonymous module.
      define(factory);
  } else {
      // Browser globals
      root.Queue = factory();
  }
})(this, function() {
    function isPromise(obj) {
      return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

    function qp(list = [], {callback = function() {}, errorInterrupt = true} = {}) {
      this.running = true;
      this.list = list;
      this.callback = callback;
      this.errorInterrupt = errorInterrupt;
      this.index = 0;
    }

    qp.prototype.run = function() {
      this.index = 0;
      this.running = true;
      this.inPause = false;
      this._run();
    }

    qp.prototype.add = function() {
      if (isPromise(p)) {
        this.list.push(p);
      }
    }

    qp.prototype.pause = function() {
      this.inPause = true;
    }

    qp.prototype.resume = function() {
      this.inPause = false;
      this._run();
    }

    qp.prototype._run = function() {
      const self = this;
      const p = this.list[this.index];
      if (!p) {
        this.running = false;
        this.callback();
        return;
      }
      if (isPromise(p)) {
        p.then(function(res){
          // console.log(res);
          go();
        }).catch((err) => {
          console.log('err:', err);
          if (!self.errorInterrupt) {
            go();
          }
        });
      } else {
        go();
      }

      function go() {
        if (self.inPause) return;
        self.index++;
        self._run();
      }
    }
    return qp;
  }
);