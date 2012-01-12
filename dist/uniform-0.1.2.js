// Uniform
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
  var eventMap, previouslyMapped;

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

  Uniform.prototype.el = null;

  Uniform.prototype.template = '';

  Uniform.prototype.$ = null;

  Uniform.prototype.find = function(sel) {
    return this.el.find(sel);
  };

  Uniform.prototype.init = (function() {});

  Uniform.prototype.ns = 'Uniform';

  Uniform.prototype.events = {};

  Uniform.prototype.buildTemplate = function() {
    if (typeof this.template === 'function') this.template = this.template();
    return this.$(this.template);
  };

  previouslyMapped = false;

  eventMap = function(fn, events) {
    var callback, eventType, previousMapped, selector;
    var _this = this;
    if (fn === 'off' && previouslyMapped === false) return;
    for (selector in events) {
      events = events[selector];
      if (selector === '') {
        for (eventType in events) {
          callback = events[eventType];
          if (typeof callback === 'string') callback = this[callback];
          this.el[fn]("" + eventType + "." + this.ns, function() {
            return callback.apply(_this, arguments);
          });
        }
      } else {
        for (eventType in events) {
          callback = events[eventType];
          if (typeof callback === 'string') callback = this[callback];
          this.el[fn]("" + eventType + "." + this.ns, selector, function() {
            return callback.apply(_this, arguments);
          });
        }
      }
    }
    if (fn === 'off') previousMapped = false;
  };

  Uniform.prototype.delegateEvents = function(eventsToDelegate) {
    var events, selector;
    if (eventsToDelegate == null) eventsToDelegate = this.events;
    if (eventsToDelegate !== this.events) {
      for (selector in eventsToDelegate) {
        events = eventsToDelegate[selector];
        this.events[selector] = events;
      }
    }
    this.undelegateEvents();
    return eventMap.call(this, 'on', this.events);
  };

  Uniform.prototype.undelegateEvents = function() {
    return eventMap.call(this, 'off', this.events);
  };

  Uniform.prototype.cacheElements = function() {
    var name, sel, _ref, _results;
    _ref = this.elements;
    _results = [];
    for (name in _ref) {
      sel = _ref[name];
      _results.push(this[name] = this.find(sel));
    }
    return _results;
  };

  Uniform.prototype.destroy = function() {
    this.undelegateEvents();
    this.el.remove();
    return this.el = null;
  };

  return Uniform;

})();

  return Uniform;
});