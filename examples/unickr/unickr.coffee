class App extends Uniform
  el: $('#unickr')

  elements:
    url    : '#url'
    gallery: '#gallery'

  events:
    form:
      submit: (el, e) ->
        e.preventDefault()
        @nickUrl(@url.val()).el.appendTo(@gallery)

  nickUrl: (url) ->
    unless @hasNicked?
      @gallery.html('')
      @hasNicked = true
    new Asset(url: url)

class Asset extends Uniform
  template: ->
    """
      <div class="asset">
        <img src="#{@url}" />
      </div>
    """

jQuery -> new App

        