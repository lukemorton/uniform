// Uniform v0.2.0
// Written by Luke Morton, MIT licensed.
// https://github.com/DrPheltRight/uniform
!function (definition) {
  if (typeof define == 'function' && typeof define.amd == 'object') {
    define(['require'], definition);
  } else {
    this.Uniform = definition(function (path) {
      // This is a fake require for jQuery
      return this['jQuery'];
    });
  }
}(function(require) {
  var Uniform;

Uniform = (function() {
  var nsEvent;

  Uniform.uniqueCounter = 0;

  Uniform.prototype.uid = null;

  Uniform.prototype.el = null;

  Uniform.prototype.template = '';

  Uniform.prototype.$ = null;

  Uniform.prototype.ns = 'Uniform';

  Uniform.prototype.events = {};

  Uniform.prototype.elements = {};

  Uniform.prototype.hasDelegated = false;

  function Uniform(settings) {
    var key, val;
    for (key in settings) {
      val = settings[key];
      this[key] = val;
    }
    this.uid || (this.uid = ++Uniform.uniqueCounter);
    this.$ || (this.$ = require('jquery'));
    if (!(this.el && (this.el.length != null))) this.el = this.buildTemplate();
    this.cacheElements();
    this.delegateEvents();
    this.init();
  }

  Uniform.prototype.init = function() {
    return null;
  };

  Uniform.prototype.buildTemplate = function() {
    if (typeof this.template === 'function') this.template = this.template();
    return this.$(this.template);
  };

  Uniform.prototype.find = function(sel) {
    return this.el.find(sel);
  };

  nsEvent = function(eventType) {
    if (eventType == null) eventType = '';
    return "" + eventType + "." + this.ns + this.uid;
  };

  Uniform.prototype.delegateEvents = function(eventsToDelegate) {
    var callback, eventType, events, hasDelegated, scope, selector, _fn, _fn2, _ref,
      _this = this;
    if (eventsToDelegate == null) eventsToDelegate = this.events;
    scope = this;
    if (eventsToDelegate !== this.events) {
      for (selector in eventsToDelegate) {
        events = eventsToDelegate[selector];
        this.events[selector] = events;
      }
    }
    this.undelegateEvents();
    _ref = this.events;
    for (selector in _ref) {
      events = _ref[selector];
      if (selector === '') {
        _fn = function(eventType, callback) {
          if (typeof callback === 'string') callback = _this[callback];
          return _this.el.on(nsEvent.call(_this, eventType), function() {
            var args;
            args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return callback.apply(scope, args);
          });
        };
        for (eventType in events) {
          callback = events[eventType];
          _fn(eventType, callback);
        }
      } else {
        _fn2 = function(eventType, callback) {
          if (typeof callback === 'string') callback = _this[callback];
          return _this.el.on(nsEvent.call(_this, eventType), selector, function() {
            var args;
            args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return callback.apply(scope, args);
          });
        };
        for (eventType in events) {
          callback = events[eventType];
          _fn2(eventType, callback);
        }
      }
    }
    hasDelegated = true;
    return this;
  };

  Uniform.prototype.undelegateEvents = function() {
    var hasDelegated;
    if (hasDelegated) this.el.off(nsEvent.call(this));
    hasDelegated = false;
    return this;
  };

  Uniform.prototype.cacheElements = function() {
    var name, sel, _ref;
    _ref = this.elements;
    for (name in _ref) {
      sel = _ref[name];
      this[name] = this.find(sel);
    }
    return this;
  };

  Uniform.prototype.destroy = function() {
    this.undelegateEvents();
    this.el.remove();
    this.el = null;
    return this;
  };

  return Uniform;

})();

  return Uniform;
});