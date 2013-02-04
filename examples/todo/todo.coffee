# A simple Todo application written in CoffeeScript
#
# To re-compile this example all you need to is run the
# following command:
#
#  cake build:example
#
# Read through the comments and see if you like

# The main todo list element is described first
class TodoList extends Uniform
  # The HTML template, this could have been a jQuery obj
  # or a callback returning HTML or a jQuery obj
  template: (built) -> built """
    <div id="todo">
      <form>
        <input name="item" autofocus />
      </form>
      <ul></ul>
    </div>
  """

  # Cache some elements, equivalent to the following:
  #   @item = @find('input[name=name]')
  #   @list = @find('ul')
  #   @form = @find('form')
  elements: (add) ->
    add('item', 'input[name=item]')
    add('list', 'ul')
    add('form', 'form')

  # Register submit callback to @form
  events: (add) ->
    add @form, 'submit', (el, e) ->
      # @ will always represent this instance *not* the
      # DOMElement triggering the click
      e.preventDefault()
      @addItem(val) if val = @item.val()
      @item.val('').focus()

  # This is a custom method
  addItem: (item) ->
    item = new TodoItem(@, item)
    @list.append(item.el)

  # This is also a custom method use for adding the todo
  # list to the DOM
  render: ->
    # @el represents the built element using @template
    # alternatively you can pass in an element to the
    # constructor like so:
    #   new TodoList(el: $('#todo'))
    $('body').append(@el)

    # Add some examples
    @addItem('Go to tescos')
    @addItem('Buy some food')


# Time to describe the individual todo items
class TodoItem extends Uniform
  constructor: (@list, @item) -> super()
  
  # Again a template
  template: (built) -> built """
    <li>
      <button class="remove">Remove</button>
    </li>
  """

  # This method is run on construction, it prepends the name
  # to the <li> element in the template
  init: ->
    super
    @el.prepend(@item)

  # Some more event delegation
  events: (add) ->
    # This time we are using a string that references a
    # Uniform.destroy which is a method that undelegates
    # events and removes @el from the DOM
    add('.remove', 'click', 'destroy')

  destroy: ->
    next = @el.prev()
    next = @el.siblings().first() unless next.length

    if next.length
      # Focus another list items remove button if possible
      next.children('button').focus()
    else
      # Otherwise we put focus back to the input box
      @list.item.focus()

    super

# And render :)
jQuery -> (new TodoList).render()
