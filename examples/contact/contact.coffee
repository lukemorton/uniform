# Let's describe a contact form
class ContactForm extends Uniform
  # The HTML template
  template: """
    <form>
      <textarea></textarea>
      <button>Send</button>
    </form>
  """

  # On initialise we want to add the form to the body
  init: -> $('body').append(@el)

  # We cache some children to properties on this object
  elements:
    msg: 'textarea'
    btn: 'button'
  
  # We delegate the submit event to @sendResponse()
  events:
    '': # This empty string means attach to thyself
      'submit': 'sendResponse'

  # Do the sending :)
  sendResponse: (e) ->
    e.preventDefault()
    @btn.text('Sending...')
    $.post 'index.html', msg: @msg, =>
      @msg.val('')
      @btn.text('Send')

# Initialise
jQuery -> new ContactForm