(function() {
  var Blog, BlogForm;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Blog = (function() {

    __extends(Blog, Uniform);

    function Blog() {
      Blog.__super__.constructor.apply(this, arguments);
    }

    Blog.prototype.posts = [
      {
        title: 'Second blog title',
        content: '<p>Another paragraph.</p>'
      }, {
        title: 'A blog title',
        content: '<p>A paragraph.</p>'
      }
    ];

    Blog.prototype.elements = {
      header: 'h1'
    };

    Blog.prototype.template = function() {
      return Hogan.TemplateCache.blog.render(this, {
        post: Hogan.TemplateCache.post
      });
    };

    Blog.prototype.init = function() {
      return this.el.prepend((new BlogForm({
        blog: this
      })).el).appendTo('body');
    };

    return Blog;

  })();

  BlogForm = (function() {

    __extends(BlogForm, Uniform);

    function BlogForm() {
      BlogForm.__super__.constructor.apply(this, arguments);
    }

    BlogForm.prototype.elements = {
      title: '#title',
      content: '#content'
    };

    BlogForm.prototype.events = {
      '': {
        submit: function(e) {
          e.preventDefault();
          this.blog.header.after(Hogan.TemplateCache.post.render({
            title: this.title.val(),
            content: this.content.val()
          }));
          return [this.title, this.content].forEach(function(el) {
            return el.val('');
          });
        }
      }
    };

    BlogForm.prototype.template = function() {
      return Hogan.TemplateCache.form.render(this);
    };

    return BlogForm;

  })();

  jQuery(function() {
    return new Blog;
  });

}).call(this);
