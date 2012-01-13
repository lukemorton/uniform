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
  template: """
    <div id="todo">
      <form>
        <input name="item" />
      </form>
      <ul></ul>
    </div>
  """

  # Cache some elements, equivalent to the following:
  #   @name = @find('input[name=name]')
  #   @list = @find('ul')
  elements:
    item: 'input[name=item]'
    list: 'ul'

  # Delegate some events to selectors and events found
  # within @el
  events:
    # Bind all form submits
    'form':
      submit: (e) ->
        # @ will always represent this instance *not* the
        # DOMElement triggering the click
        e.preventDefault()
        @addItem(@item.val())
        @item.val('').focus()

  # This is a custom method
  addItem: (item) ->
    item = new TodoItem({list: @, item: item})
    @list.append(item.el)

  # This is also a custom method use for adding the todo
  # list to the DOM
  render: ->
    # @el represents the built element using @template
    # alternatively you can pass in an element to the
    # constructor like so:
    #   new TodoList(el: $('#todo'))
    $('body').append(@el)
    @addItem('Go to tescos')
    @addItem('Buy some food')
    

# Time to describe the individual todo items
class TodoItem extends Uniform
  # Again a template
  template: """
    <li>
      <button class="remove">Remove</button>
    </li>
  """

  # This method is run on construction, it prepends the name
  # to the <li> element in the template
  init: -> @el.prepend(@item)

  # Some more event delegation
  events:
    '.remove':
      # This time we are using a string that references a
      # Uniform.destroy which is a method that undelegates
      # events and removes @el from the DOM
      click: 'destroy'

  destroy: ->
    next = @el.prev()
    next = @el.siblings().first() unless next.length

    if next.length
      next.children('button').focus()
    else
      @list.item.focus()

    super


# And render :)
jQuery -> (new TodoList).render()