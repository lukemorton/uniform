// Uniform
// Written by Luke Morton, MIT licensed.
// https://github.com/DrPheltRight/uniform
!function (definition) {
  if (typeof define == 'function' && typeof define.amd == 'object')
    define(['jquery'], definition);
  else
    this.Uniform = definition(this.jQuery);
}(function() {
  var Uniform;

Uniform = (function() {
  var eventMap;

  function Uniform(settings) {
    var key, val;
    for (key in settings) {
      val = settings[key];
      this.key = val;
    }
    this.delegateEvents();
    if (!(this.el && (this.el.length != null))) this.el = this.buildTemplate();
    if (this.$ == null) this.$ = require('jquery');
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
    return this.$(this.template);
  };

  eventMap = function(fn, events) {
    var callback, eventType, selector, _results;
    _results = [];
    for (selector in events) {
      events = events[selector];
      if (selector === '') {
        _results.push((function() {
          var _results2;
          _results2 = [];
          for (eventType in events) {
            callback = events[eventType];
            _results2.push(this.el[fn](eventType + this.ns, callback));
          }
          return _results2;
        }).call(this));
      } else {
        _results.push((function() {
          var _results2;
          _results2 = [];
          for (eventType in events) {
            callback = events[eventType];
            _results2.push(this.el[fn](eventType + this.ns, selector, callback));
          }
          return _results2;
        }).call(this));
      }
    }
    return _results;
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

  Uniform.prototype.destroy = function() {
    this.undelegateEvents();
    this.el.remove();
    return this.el = null;
  };

  return Uniform;

})();

  return Uniform;
});