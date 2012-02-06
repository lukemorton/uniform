(function() {
  var TodoItem, TodoList,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TodoList = (function(_super) {

    __extends(TodoList, _super);

    function TodoList() {
      TodoList.__super__.constructor.apply(this, arguments);
    }

    TodoList.prototype.template = "<div id=\"todo\">\n  <form>\n    <input name=\"item\" autofocus />\n  </form>\n  <ul></ul>\n</div>";

    TodoList.prototype.elements = {
      item: 'input[name=item]',
      list: 'ul'
    };

    TodoList.prototype.events = {
      form: {
        submit: function(e) {
          var val;
          e.preventDefault();
          if (val = this.item.val()) this.addItem(val);
          return this.item.val('').focus();
        }
      }
    };

    TodoList.prototype.addItem = function(item) {
      item = new TodoItem({
        list: this,
        item: item
      });
      return this.list.append(item.el);
    };

    TodoList.prototype.render = function() {
      $('body').append(this.el);
      this.addItem('Go to tescos');
      return this.addItem('Buy some food');
    };

    return TodoList;

  })(Uniform);

  TodoItem = (function(_super) {

    __extends(TodoItem, _super);

    function TodoItem() {
      TodoItem.__super__.constructor.apply(this, arguments);
    }

    TodoItem.prototype.template = "<li>\n  <button class=\"remove\">Remove</button>\n</li>";

    TodoItem.prototype.init = function() {
      return this.el.prepend(this.item);
    };

    TodoItem.prototype.events = {
      '.remove': {
        click: 'destroy'
      }
    };

    TodoItem.prototype.destroy = function() {
      var next;
      next = this.el.prev();
      if (!next.length) next = this.el.siblings().first();
      if (next.length) {
        next.children('button').focus();
      } else {
        this.list.item.focus();
      }
      return TodoItem.__super__.destroy.apply(this, arguments);
    };

    return TodoItem;

  })(Uniform);

  jQuery(function() {
    return (new TodoList).render();
  });

}).call(this);
