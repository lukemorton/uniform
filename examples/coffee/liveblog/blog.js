// Generated by CoffeeScript 1.3.3
(function() {
  var Blog, BlogForm,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Blog = (function(_super) {

    __extends(Blog, _super);

    function Blog() {
      return Blog.__super__.constructor.apply(this, arguments);
    }

    Blog.prototype.posts = localStorage.posts ? JSON.parse(localStorage.posts) : [];

    Blog.prototype.elements = function() {
      return {
        header: 'h1'
      };
    };

    Blog.prototype.template = function(built) {
      return built(Hogan.TemplateCache.blog.render(this, {
        post: Hogan.TemplateCache.post
      }));
    };

    Blog.prototype.init = function() {
      var form;
      Blog.__super__.init.apply(this, arguments);
      form = new BlogForm(this);
      return this.el.prepend(form.el).appendTo('body');
    };

    return Blog;

  })(Uniform);

  BlogForm = (function(_super) {

    __extends(BlogForm, _super);

    function BlogForm(blog) {
      this.blog = blog;
      BlogForm.__super__.constructor.call(this);
    }

    BlogForm.prototype.elements = function() {
      return {
        title: '#title',
        content: '#content'
      };
    };

    BlogForm.prototype.events = function() {
      return {
        '': {
          submit: function(el, e) {
            var newPost;
            e.preventDefault();
            newPost = {
              title: this.title.val(),
              content: this.content.val()
            };
            this.blog.header.after(Hogan.TemplateCache.post.render(newPost));
            this.blog.posts.push(newPost);
            localStorage.posts = JSON.stringify(this.blog.posts);
            [this.title, this.content].forEach(function(el) {
              return el.val('');
            });
            return this.title.focus();
          }
        }
      };
    };

    BlogForm.prototype.template = function(built) {
      return built(Hogan.TemplateCache.form.render(this));
    };

    return BlogForm;

  })(Uniform);

  jQuery(function() {
    return new Blog;
  });

}).call(this);
