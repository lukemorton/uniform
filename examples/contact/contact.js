(function() {
  var ContactForm,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ContactForm = (function(_super) {

    __extends(ContactForm, _super);

    function ContactForm() {
      ContactForm.__super__.constructor.apply(this, arguments);
    }

    ContactForm.prototype.template = "<form>\n  <textarea></textarea>\n  <button>Send</button>\n</form>";

    ContactForm.prototype.init = function() {
      return $('body').append(this.el);
    };

    ContactForm.prototype.elements = {
      msg: 'textarea',
      btn: 'button'
    };

    ContactForm.prototype.events = {
      '': {
        'submit': 'sendResponse'
      }
    };

    ContactForm.prototype.sendResponse = function(el, e) {
      var _this = this;
      e.preventDefault();
      this.btn.text('Sending...');
      return $.post('index.html', {
        msg: this.msg
      }, function() {
        _this.msg.val('');
        return _this.btn.text('Send');
      });
    };

    return ContactForm;

  })(Uniform);

  jQuery(function() {
    return new ContactForm;
  });

}).call(this);
