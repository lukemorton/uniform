# Uniform

I present to you a view model for the browser. A view model
(in this case) is a class that describes the behaviour of an
element and it's children. It goes well with jQuery but can
use whatever you like (e.g. Zepto).

Here's an example:

``` coffeescript
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
  elements: ->
    msg: 'textarea'
    btn: 'button'
  
  # We delegate the submit event to @sendResponse()
  events: ->
    '': # This empty string means attach to thyself
      'submit': (el, e) ->
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
```

You can also use your view models on elements already in
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

You can simply use the JS found in the `dist` folder of the
Uniform git repo [https://github.com/DrPheltRight/uniform]().

## Hacking

Clone the repository [https://github.com/DrPheltRight/uniform.git]()
and then run "cake build" to make a fresh copy of Uniform.

## Mini roadmap

In a future version (v0.5.x) I will:

 - Remove constructor overriding. Although handy to change
   things when creating an instance, I only think a specific
   set of elements should be changable, i.e. `el`.
 - Remove ability for events and elements to be objects, they
   will in future have to be methods that return objects.

## License

MIT

## Author

Luke Morton