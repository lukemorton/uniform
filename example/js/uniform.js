// Uniform v0.1.3
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
  var delegated, nsEvent;

  Uniform.uniqueCount = 0;

  Uniform.prototype.uid = ++Uniform.uniqueCounter;

  Uniform.prototype.el = null;

  Uniform.prototype.template = '';

  Uniform.prototype.$ = null;

  Uniform.prototype.ns = 'Uniform';

  Uniform.prototype.events = {};

  delegated = false;

  function Uniform(settings) {
    var key, val;
    for (key in settings) {
      val = settings[key];
      this[key] = val;
    }
    if (this.$ == null) this.$ = require('jquery');
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
    var callback, eventType, events, selector, _ref;
    var _this = this;
    if (eventsToDelegate == null) eventsToDelegate = this.events;
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
        for (eventType in events) {
          callback = events[eventType];
          if (typeof callback === 'string') callback = this[callback];
          this.el.on(nsEvent.call(this, eventType), function() {
            return callback.apply(_this, arguments);
          });
        }
      } else {
        for (eventType in events) {
          callback = events[eventType];
          if (typeof callback === 'string') callback = this[callback];
          this.el.on(nsEvent.call(this, eventType), selector, function() {
            return callback.apply(_this, arguments);
          });
        }
      }
    }
    delegated = true;
    return this;
  };

  Uniform.prototype.undelegateEvents = function() {
    var delegate;
    if (delegated != null) this.el.off(nsEvent.call(this));
    delegate = false;
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