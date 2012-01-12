(function() {
  var TodoItem, TodoList;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TodoList = (function() {

    __extends(TodoList, Uniform);

    function TodoList() {
      TodoList.__super__.constructor.apply(this, arguments);
    }

    TodoList.prototype.template = "<div id=\"todo\">\n  <form>\n    <input name=\"name\" />\n    <button class=\"add\">Add</button>\n  </form>\n  <ul></ul>\n</div>";

    TodoList.prototype.elements = {
      name: 'input[name=name]',
      list: 'ul'
    };

    TodoList.prototype.events = {
      'form': {
        submit: function(e) {
          e.preventDefault();
          this.addItem(this.name.val());
          return this.name.val('').focus();
        }
      }
    };

    TodoList.prototype.addItem = function(name) {
      var item;
      item = new TodoItem({
        name: name
      });
      return this.list.append(item.el);
    };

    TodoList.prototype.render = function() {
      $('body').append(this.el);
      this.addItem('Go to tescos');
      return this.addItem('Buy some food');
    };

    return TodoList;

  })();

  TodoItem = (function() {

    __extends(TodoItem, Uniform);

    function TodoItem() {
      TodoItem.__super__.constructor.apply(this, arguments);
    }

    TodoItem.prototype.template = "<li>\n  <button class=\"remove\">Remove</button>\n</li>";

    TodoItem.prototype.init = function() {
      return this.el.prepend(this.name);
    };

    TodoItem.prototype.events = {
      '.remove': {
        click: 'destroy'
      }
    };

    return TodoItem;

  })();

  jQuery(function() {
    return (new TodoList).render();
  });

}).call(this);
