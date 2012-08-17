// Uniform v0.3.2
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

    context.Uniform.no_conflict = function () {
      context.Uniform = old;
      return this;
    };
  }
}(function(require) {
  var Uniform;

Uniform = (function() {
  var delegate_event, is_array, normalise_event_object, ns_event;

  Uniform.unique_counter = 0;

  Uniform.prototype.uid = null;

  Uniform.prototype.el = null;

  Uniform.prototype.template = '';

  Uniform.prototype.$ = null;

  Uniform.prototype.ns = 'Uniform';

  Uniform.prototype.events = {};

  Uniform.prototype.elements = {};

  Uniform.prototype.has_delegated = false;

  function Uniform(settings) {
    var key, val;
    for (key in settings) {
      val = settings[key];
      if (key !== 'events') this[key] = val;
    }
    this.uid || (this.uid = ++Uniform.unique_counter);
    this.$ || (this.$ = require('jquery'));
    this.events = normalise_event_object({}, this.events);
    if (settings != null ? settings.events : void 0) {
      normalise_event_object(this.events, settings.events);
    }
    this.build_template(function() {
      return this.init();
    });
  }

  Uniform.prototype.init = function() {
    this.cache_elements();
    return this.delegate_events();
  };

  Uniform.prototype.build_template = function(callback) {
    var _this = this;
    if (this.el && (this.el.length != null)) {
      callback.call(this);
    } else if (typeof this.template === 'function') {
      this.template(function(view) {
        _this.el = _this.$(view);
        return callback.call(_this);
      });
    } else {
      this.el = this.$(this.template);
      callback.call(this);
    }
    return this;
  };

  Uniform.prototype.find = function(sel) {
    return this.el.find(sel);
  };

  ns_event = function(event_type) {
    if (event_type == null) event_type = '';
    return "" + event_type + "." + this.ns + this.uid;
  };

  is_array = function(arg) {
    if (Array.isArray != null) return Array.isArray(arg);
    return Object.prototype.toString.call(arg) === '[object Array]';
  };

  normalise_event_object = function(norm_events, unnorm_events) {
    var callback, event_type, events, selector, _base;
    for (selector in unnorm_events) {
      events = unnorm_events[selector];
      for (event_type in events) {
        callback = events[event_type];
        norm_events[selector] || (norm_events[selector] = {});
        (_base = norm_events[selector])[event_type] || (_base[event_type] = []);
        if (is_array(callback)) {
          norm_events[selector][event_type] = norm_events[selector][event_type].concat(callback);
        } else {
          norm_events[selector][event_type].push(callback);
        }
      }
    }
    return norm_events;
  };

  Uniform.extend_events = function(events) {
    var n;
    n = normalise_event_object;
    return this.prototype.events = n(n({}, this.prototype.events), events);
  };

  delegate_event = function(event_type, selector, callbacks) {
    var callback, delegate, el, scope, _i, _len, _results;
    el = this.el;
    scope = this;
    event_type = ns_event.call(this, event_type);
    delegate = (function(el, event_type, selector) {
      if (selector === '') {
        return function(callback) {
          return el.on(event_type, callback);
        };
      } else {
        return function(callback) {
          return el.on(event_type, selector, callback);
        };
      }
    })(el, event_type, selector);
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

  Uniform.prototype.delegate_events = function() {
    var callbacks, event_type, events, selector, _ref;
    this.undelegate_events();
    _ref = this.events;
    for (selector in _ref) {
      events = _ref[selector];
      for (event_type in events) {
        callbacks = events[event_type];
        delegate_event.call(this, event_type, selector, callbacks);
      }
    }
    this.has_delegated = true;
    return this;
  };

  Uniform.prototype.undelegate_events = function() {
    if (this.has_delegated) this.el.off(ns_event.call(this));
    this.has_delegated = false;
    return this;
  };

  Uniform.prototype.cache_elements = function() {
    var name, sel, _ref;
    _ref = this.elements;
    for (name in _ref) {
      sel = _ref[name];
      this[name] = this.find(sel);
    }
    return this;
  };

  Uniform.prototype.destroy = function() {
    this.undelegate_events();
    this.el.remove();
    this.el = null;
    return this;
  };

  return Uniform;

})();

  return Uniform;
});