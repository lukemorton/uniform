# Let's describe a contact form

class ContactForm extends Uniform

  # On initialise we want to add the form to the body
  init: ->
    super
    $('body').append(@el)
    
  # The HTML template
  template: (built) -> built """
    <form>
      <textarea></textarea>
      <button>Send</button>
    </form>
  """

  # We cache some children to properties on this object
  elements: (add) ->
    add('msg', 'textarea')
    add('btn', 'button')
  
  # We delegate the submit event to @sendResponse()
  events: (add) ->
    # Attach submit event to @el
    add 'submit', (el, e) ->
      e.preventDefault()
      @sendResponse()

  # Do the sending :)
  sendResponse: ->
    @btn.text('Sending...')
    $.post 'index.html', msg: @msg, =>
      @msg.val('')
      @btn.text('Send')

# Initialise
jQuery -> new ContactForm
