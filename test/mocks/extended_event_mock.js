// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.ExtendedEventMock = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.events = function() {
      var events;
      events = _Class.__super__.events.apply(this, arguments);
      events[''].another_event = function(el, e) {
        return this.events_triggered.push('another_event');
      };
      return events;
    };

    return _Class;

  })(this.EventMock);

}).call(this);
