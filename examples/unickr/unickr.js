(function() {
  var App, Asset,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  App = (function(_super) {

    __extends(App, _super);

    function App() {
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.el = $('#unickr');

    App.prototype.elements = {
      url: '#url',
      gallery: '#gallery'
    };

    App.prototype.events = {
      form: {
        submit: function(el, e) {
          e.preventDefault();
          return this.nickUrl(this.url.val()).el.appendTo(this.gallery);
        }
      }
    };

    App.prototype.nickUrl = function(url) {
      if (this.hasNicked == null) {
        this.gallery.html('');
        this.hasNicked = true;
      }
      return new Asset({
        url: url
      });
    };

    return App;

  })(Uniform);

  Asset = (function(_super) {

    __extends(Asset, _super);

    function Asset() {
      Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.template = function() {
      return "<div class=\"asset\">\n  <img src=\"" + this.url + "\" />\n</div>";
    };

    return Asset;

  })(Uniform);

  jQuery(function() {
    return new App;
  });

}).call(this);
