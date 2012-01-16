# Uniform
#
# Describes a DOM element and it's children along with their
# behaviour in a web page.
#
# Written by Luke Morton, MIT licensed.
# https://github.com/DrPheltRight/uniform
class Uniform
  
  # Unique counter
  @uniqueCounter = 0

  # Unique ID for this Uniform
  uid: null
  
  # DOM element, that this object represents
  el: null

  # The template, blank by default
  template: ''

  # JS library, default is jQuery as set in constructor
  $: null

  # A namespace to create events under
  ns: 'Uniform'

  # The event map
  events: {}

  # Have we previously delegated events?
  hasDelegated: false

  # The constructor takes one argument, an object, which can
  # override and append properties before initialising.
  #
  # We then set up a number of properties:
  #  - @$ is set to jQuery unless an alternative is specified
  #  - @el is built unless already supplied
  #  - @elements are cached
  #  - @events are delegated
  #  - @init() is called
  constructor: (settings) ->
    @[key] = val for key, val of settings
    @$ = require 'jquery' unless @$?
    @uid or= ++Uniform.uniqueCounter
    @el = @buildTemplate() unless @el and @el.length?
    @cacheElements()
    @delegateEvents()
    @init()

  # By default @init() does nothing
  init: -> null

  # Private method for building the template. If the template
  # is a function it will be executed and its return value
  # will be used.
  buildTemplate: ->
    @template = @template() if typeof @template is 'function'
    @$(@template)

  # Find elements relative to @el
  find: (sel) -> @el.find(sel)

  # Build a namespace eventType
  nsEvent =  (eventType = '') -> "#{eventType}.#{@ns}#{@uid}"

  # Delegate events. Optionally takes a map of new events to
  # add to the object's previously defined events.
  delegateEvents: (eventsToDelegate = @events) ->
    unless eventsToDelegate is @events
      # Merge new events to @events
      @events[selector] = events for selector, events of eventsToDelegate
    
    @undelegateEvents()

    for selector, events of @events
      if selector is ''
        for eventType, callback of events
          callback = @[callback] if typeof callback is 'string'
          @el.on(nsEvent.call(@, eventType), => callback.apply(@, arguments)) 
      else
        for eventType, callback of events
          callback = @[callback] if typeof callback is 'string'
          @el.on(nsEvent.call(@, eventType), selector, => callback.apply(@, arguments))

    hasDelegated = true
    return @

  # Undelegate all events
  undelegateEvents: ->
    @el.off(nsEvent.call(@)) if hasDelegated
    hasDelegated = false
    return @
  
  # Cache elements relative to @elements
  cacheElements: ->
    @[name] = @find(sel) for name, sel of @elements
    return @

  # Undelegate and remove @el from the DOM!
  destroy: ->
    @undelegateEvents()
    @el.remove()
    @el = null
    return @
