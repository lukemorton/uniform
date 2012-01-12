# Uniform
#
# Describes a DOM element and it's children along with their
# behaviour in a web page.
class Uniform

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
    @el = @buildTemplate() unless @el and @el.length?
    @cacheElements()
    @delegateEvents()
    @init()
  
  # DOM element, that this object represents
  el: null

  # The template, blank by default
  template: ''

  # JS library, default is jQuery as set in constructor
  $: null

  # Find elements relative to @el
  find: (sel) -> @el.find(sel)

  # By default @init() does nothing
  init: (-> )

  # A namespace to create events under
  ns: 'Uniform'

  # The event map
  events: {}

  # Private method for building the template. If the template
  # is a function it will be executed and its return value
  # will be used.
  buildTemplate: ->
    @template = @template() if typeof @template is 'function'
    @$(@template)

  # Have we previously delegated events?
  previouslyMapped = false

  # Private method to delegate or undelegate events. Will not
  # undelegate if not previously delegated.
  eventMap = (fn, events) ->
    return if fn is 'off' and previouslyMapped is false
    
    for selector, events of events
      if selector is ''
        for eventType, callback of events
          callback = @[callback] if typeof callback is 'string'
          @el[fn]("#{eventType}.#{@ns}", => callback.apply(@, arguments)) 
      else
        for eventType, callback of events
          callback = @[callback] if typeof callback is 'string'
          @el[fn]("#{eventType}.#{@ns}", selector, => callback.apply(@, arguments))

    previousMapped = false if fn is 'off'
    return

  # Delegate events. Optionally takes a map of new events to
  # add to the object's previously defined events.
  delegateEvents: (eventsToDelegate = @events) ->
    unless eventsToDelegate is @events
      # Merge new events to @events
      @events[selector] = events for selector, events of eventsToDelegate
    
    @undelegateEvents()
    eventMap.call(@, 'on', @events)

  # Undelegate all events
  undelegateEvents: -> eventMap.call(@, 'off', @events)
  
  # Cache elements relative to @elements
  cacheElements: ->
    @[name] = @find(sel) for name, sel of @elements

  # Undelegate and remove @el from the DOM!
  destroy: ->
    @undelegateEvents()
    @el.remove()
    @el = null