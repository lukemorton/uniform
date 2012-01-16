(function() {
  var App, Asset;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  App = (function() {

    __extends(App, Uniform);

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
        submit: function(e) {
          e.preventDefault();
          return this.nickUrl(this.url.val()).el.appendTo(this.gallery);
        }
      }
    };

    App.prototype.neverNicked = true;

    App.prototype.nickUrl = function(url) {
      if (this.neverNicked) {
        this.gallery.html('');
        this.neverNicked = false;
      }
      return new Asset({
        url: url
      });
    };

    return App;

  })();

  Asset = (function() {

    __extends(Asset, Uniform);

    function Asset() {
      Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.url = null;

    Asset.prototype.template = "<div class=\"asset\">\n	<img />\n</div>";

    Asset.prototype.elements = {
      img: 'img'
    };

    Asset.prototype.init = function() {
      return this.img.attr('src', this.url);
    };

    return Asset;

  })();

  jQuery(function() {
    return new App;
  });

}).call(this);
