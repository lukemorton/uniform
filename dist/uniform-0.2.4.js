// Uniform v0.2.4
// Written by Luke Morton, MIT licensed.
// https://github.com/DrPheltRight/uniform
!function (definition) {
  var context = this,
    old = context.Uniform;

  if (typeof define == 'function' && typeof define.amd == 'object') {
    define(['require'], definition);
  } else {
    context.Uniform = definition(function (path) {
      // This is a fake require for jQuery
      return context['jQuery'];
    });

    context.Uniform.noConflict = function () {
      context.Uniform = old;
      return this;
    };
  }
}(function(require) {
  var Uniform;

Uniform = (function() {
  var delegateEvent, isArray, normaliseEventObject, nsEvent;

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
      if (key !== 'events') this[key] = val;
    }
    this.uid || (this.uid = ++Uniform.uniqueCounter);
    this.$ || (this.$ = require('jquery'));
    if (!(this.el && (this.el.length != null))) this.el = this.buildTemplate();
    this.cacheElements();
    this.events = normaliseEventObject(this.events);
    if ((settings != null ? settings.events : void 0) != null) {
      this.delegateEvents(settings.events);
    } else {
      this.delegateEvents();
    }
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

  isArray = function(arg) {
    if (Array.isArray != null) return Array.isArray(arg);
    return Object.prototype.toString.call(arg) === '[object Array]';
  };

  normaliseEventObject = function(unEvents, nEvents) {
    var callback, eventType, events, selector, _base;
    if (nEvents == null) nEvents = {};
    for (selector in unEvents) {
      events = unEvents[selector];
      for (eventType in events) {
        callback = events[eventType];
        nEvents[selector] || (nEvents[selector] = {});
        (_base = nEvents[selector])[eventType] || (_base[eventType] = []);
        if (isArray(callback)) {
          nEvents[selector][eventType] = nEvents[selector][eventType].concat(callback);
        } else {
          nEvents[selector][eventType].push(callback);
        }
      }
    }
    return nEvents;
  };

  delegateEvent = function(eventType, selector, callbacks) {
    var callback, delegate, el, scope, _i, _len, _results;
    el = this.el;
    scope = this;
    delegate = (function(el, eventType, selector) {
      if (selector === '') {
        return function(callback) {
          return el.on(eventType, callback);
        };
      } else {
        return function(callback) {
          return el.on(eventType, selector, callback);
        };
      }
    })(el, eventType, selector);
    _results = [];
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      if (typeof callback === 'string') callback = this[callback];
      _results.push((function(callback) {
        return delegate(function() {
          var args;
          args = Array.prototype.slice.call(arguments);
          args.unshift(this);
          return callback.apply(scope, args);
        });
      })(callback));
    }
    return _results;
  };

  Uniform.prototype.delegateEvents = function(eventsToDelegate) {
    var callbacks, eventType, events, hasDelegated, scope, selector, _ref;
    if (eventsToDelegate == null) eventsToDelegate = this.events;
    scope = this;
    if (eventsToDelegate !== this.events) {
      normaliseEventObject(eventsToDelegate, this.events);
    }
    this.undelegateEvents();
    _ref = this.events;
    for (selector in _ref) {
      events = _ref[selector];
      for (eventType in events) {
        callbacks = events[eventType];
        delegateEvent.call(this, eventType, selector, callbacks);
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