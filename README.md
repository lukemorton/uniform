# Uniform

I present to you a ViewController for the browser. A
ViewController (in this case) is a class that describes the
behaviour of an element and it's children. It goes well with
jQuery but can use whatever you like.

Here's an example:

``` coffeescript
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
  sendResponse: (el, e) ->
    e.preventDefault()
    @btn.text('Sending...')
    $.post 'index.html', msg: @msg, =>
      @msg.val('')
      @btn.text('Send')

# Initialise
jQuery -> new ContactForm
```

You can also use your ViewControllers on elements already in
the DOM like so:

``` coffeescript
# Or use on an existing element
jQuery -> new ContactForm(el: $('#contact'))
```

## CoffeeScript in the browser?

Uniform is best used in compiled CoffeeScript browser
environments. Since Uniform is a CoffeeScript class it is
easiest to extend and use it if your front end code is also
CoffeeScript.

Use it how you like though.

## Features

 - Can build it's own element using a template
 - Can hook onto existing elements in the DOM instead of using
   a previously defined template
 - Can delegate events of child elements and directly attach
   events to itself
 - Can cache jQuery objects so that you don't have to
 - Can be used with AMD or simply included in your HTML

## Getting a copy

You can simply use the JS found in the dist folder of the
Uniform git repo [https://github.com/DrPheltRight/uniform]()

## Hacking

Clone the repository [https://github.com/DrPheltRight/uniform.git]()
and then run "cake build" to make a fresh copy of Uniform.

## License

MIT

## Author

Luke Morton