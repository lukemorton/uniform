# Uniform

Uniform is a way of organising your front-end CoffeeScript.
You describe individual components of your application as
Uniform classes. They can be used for delegating events,
describing behaviour and handle the building of elements.

For example a contact form could have AJAX behaviour described
as a Uniform class.

``` coffeescript
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

## Future developments

 - v0.5.x will see the introduction of a JS interface for
   Uniform. A current example can be found in:
   https://github.com/DrPheltRight/uniform/blob/develop/examples/js-example/todo.js

 - Since we have added the add() syntax for events we can now
   remove the need for a blank string to indicate placing the
   listening directly on @el. The only thing that would break
   is the object syntax which as of v0.5.x is deprecated and
   will be remove in v0.6.x. So as of v0.6.x I will:
    - remove the object syntax from events and elements
    - remove the blank string syntax to put it in line with
      jQuery's use of a blank string (match all elements)

## License

MIT

## Author

Luke Morton
