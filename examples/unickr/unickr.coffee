class App extends Uniform
  el: $('#unickr')

  elements: ->
    url    : '#url'
    gallery: '#gallery'

  events: ->
    form:
      submit: (el, e) ->
        e.preventDefault()
        $gallery = @gallery
        @nickUrl @url.val(), ->
          @el.appendTo($gallery)

  nickUrl: (url, callback) ->
    unless @hasNicked?
      @gallery.html('')
      @hasNicked = true
    
    return new Asset(url, callback)

class Asset extends Uniform
  constructor: (@url, @template_built) -> super()

  template: (built) -> built """
    <div class="asset">
      <img src="#{@url}" />
    </div>
  """

  init: ->
    super
    @template_built() if @template_built?

jQuery -> new App
