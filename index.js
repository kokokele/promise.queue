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

    function isFun(fun) {
      return typeof fun === 'function';
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
      this.results = [];
      this._run();
    }

    qp.prototype.add = function(fun) {
      if (isFun(fun)) {
        this.list.push(fun);
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
      this.running = false;
    }

    qp.prototype.resume = function() {
      this.inPause = false;
      this.running = true;
      this._run();
    }

    qp.prototype._run = function() {
      const self = this;
      const fun = this.list[this.index];
      if (!fun) {
        this.running = false;
        this.callback(self.results);
        return;
      }
      if (isFun(fun)) {
        const p = fun();
        if (isPromise(p)) {
          p.then(function(res){
            self.results[self.index] = res;
            self.handle['success'](res, self.index);
            go();
          }).catch((err) => {
            self.handle['error'](err, self.index);
            if (!self.errorInterrupt) {
              go();
            } else {
              // if errorInterrupt === true , all done
              this.callback(self.results);
            }
          });
        } else {
          self.handle['error'](new Error('return value is not Promise type'));
          go();
        }
       
      } else {
        go();
      }

      function go() {
        self.index++;
        if (self.inPause) {
          self.running = false;
          return;
        };
        self._run();
      }
    }
    return qp;
  }
);