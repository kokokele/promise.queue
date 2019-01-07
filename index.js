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
      this.handle = {
        success: function(){},
        error: function(){}
      };
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

    qp.prototype.on = function(event, handle) {
      if(typeof event !== 'string') {
        throw new Error('on function event must be String');
      }
      if (!['success', 'error'].includes(event)) {
        throw new Error('on event must be "success" or "error"');
      }
      if (typeof handle !== 'function') {
        throw new Error('on function handle must be Function');
      }

      this.handle[event] = handle;
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
          self.handle['success'](res);
          go();
        }).catch((err) => {
          // console.log('err:', err);
          self.handle['error'](err);
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