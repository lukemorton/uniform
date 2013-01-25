// A simple Todo application written using Uniform.create_class
// CoffeeScript version: https://github.com/DrPheltRight/uniform/blob/develop/examples/todo/todo.coffee
! function ($) {
  "use strict";

  // The main todo list element is described first
  var TodoList = Uniform.create_class({
    // The HTML template, this could have been a jQuery obj
    // or a callback returning HTML or a jQuery obj
    "template": function (built) {
      built('<div id="todo">'
          + '  <form>'
          + '    <input name="item" autofocus />'
          + '  </form>'
          + '  <ul></ul>'
          + '</div>')
    },

    // Cache some elements, equivalent to the following:
    //   this.item = this.find('input[name=name]')
    //   this.list = this.find('ul')
    //   this.form = this.find('form')
    "elements": function (add) {
      add('item', 'input[name=item]')
      add('list', 'ul')
      add('form', 'form')
    },

    // Register submit callback to @form
    "events": function (add) {
      add(this.form, 'submit', function (el, e) {
        var val = this.item.val()

        // @ will always represent this instance *not* the
        // DOMElement triggering the click
        e.preventDefault()

        if (val) {
          this.addItem(val)
        }

        this.item.val('').focus()
      })
    },

    // This is a custom method
    "addItem": function (item) {
      var i = new TodoItem(this, item)
      this.list.append(i.el)
    },

    // This is also a custom method use for adding the todo
    // list to the DOM
    "render": function () {
      // @el represents the built element using @template
      // alternatively you can pass in an element to the
      // constructor like so:
      //   new TodoList(el: $('#todo'))
      $('body').append(this.el)

      // Add some examples
      this.addItem('Go to tescos')
      this.addItem('Buy some food')
    }
  })

  // Time to describe the individual todo items
  var TodoItem = Uniform.create_class({
    "constructor": function (list, item) {
      this.list = list
      this.item = item
      TodoItem.__super__.constructor.call(this)
    },

    // Again a template
    "template": function (built) {
      built('<li>'
          + '  <button class="remove">Remove</button>'
          + '</li>')
    },

    // This method is run on construction, it prepends the name
    // to the <li> element in the template
    "init": function () {
      TodoItem.__super__.init.call(this)
      this.el.prepend(this.item)
    },

    // Some more event delegation
    "events": function (add) {
      // This time we are using a string that references a
      // Uniform.destroy which is a method that undelegates
      // events and removes @el from the DOM
      add('.remove', 'click', 'destroy')
    },

    "destroy": function () {
      var next = this.el.prev()

      if ( ! next.length) {
        next = this.el.siblings().first()
      } 

      if (next.length) {
        // Focus another list items remove button if possible
        next.children('button').focus()
      } else {
        // Otherwise we put focus back to the input box
        this.list.item.focus()
      }

      TodoItem.__super__.destroy.call(this)
    }
  })

  // And render :)
  $(function () {
    var todoList = new TodoList
    todoList.render()
  })
}(window.jQuery)
