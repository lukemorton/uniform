// Let's describe a contact form
! function ($) {
  "use strict";

  var ContactForm = Uniform.create_class({
    
    // The HTML template
    "template": function (built) {
      built("<form>"
          + " <textarea></textarea>"
          + "  <button>Send</button>"
          + "</form>")
    },

    // We cache some children to properties on this object
    "elements": function (add) {
      add('msg', 'textarea')
      add('btn', 'button')
    },
  
    // We delegate the submit event to @sendResponse()
    "events": function (add) {
      // attach submit event to @el
      add('submit', function (el, e) {
        e.preventDefault()
        this.sendResponse()
      })
    },

    // Do the sending :)
    sendResponse: function () {
      this.btn.text('Sending...')
      $.post('index.html', {msg: this.msg.val()}, $.proxy(function () {
        this.msg.val('')
        this.btn.text('Send')
      }, this))
    }
  })

  // Initialise
  $(function () {
    var form = new ContactForm
    $('body').append(form.el)
  })

}(window.jQuery)
