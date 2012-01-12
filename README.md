# Uniform

A ViewController for CoffeeScript in the browser. In the case
of Uniform a ViewController is a class that describes the
behaviour of an element and it's children.

It goes well with jQuery.

``` coffeescript
# Let's scribe a contact form
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
    '':
      'submit': 'sendResponse'

  # Do the sending :)
  sendResponse: (e) ->
    e.preventDefault()
    @btn.text('Sending...')
    $.post '/contact', msg: @msg, =>
      @msg.val('')
      @btn.text('Send')

# Initialise
new ContactForm
```

## CoffeeScript in the browser?

Uniform is best used in compiled CoffeeScript browser scripts.
Since Uniform is a CoffeeScript class it is easiest to extend
and use Uniform if your front end code is also CoffeeScript.

Use it how you like though.

## Getting a copy

You can simply use the JS found in the dist folder of the
Uniform git repo [http://github.com/DrPheltRight/uniform]()

## Hacking

Clone the repository [http://github.com/DrPheltRight/uniform.git]()
and then run "cake build" to make a fresh copy of Uniform.

## License

MIT

## Author

Luke Morton