# Let's describe a contact form
class ContactForm extends Uniform
    
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
    # attach submit event to @el
    add 'submit', (el, e) ->
      e.preventDefault()
      @send_response()

  # Do the sending :)
  send_response: ->
    @btn.text('Sending...')
    $.post 'index.html', msg: @msg, =>
      @msg.val('')
      @btn.text('Send')

# Initialise
jQuery ->
  form = new ContactForm
  $('body').append(form.el)
