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

  # The elements map
  elements: {}

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
    for key, val of settings
      # Merge all but events
      @[key] = val unless key is 'events'

    @uid or= ++Uniform.uniqueCounter
    @$ or= require 'jquery'
    @el = @buildTemplate() unless @el and @el.length?
    @cacheElements()

    # Normalise events object first
    @events = normaliseEventObject(@events)

    # We want to append events defined here to previously
    # defined ones, we don't want the foreach to overwrite
    # the originals
    if settings?.events?
      @delegateEvents(settings.events)
    else
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
  nsEvent = (eventType = '') -> "#{eventType}.#{@ns}#{@uid}"

  # Is array
  isArray = (arg) ->
    return Array.isArray(arg) if Array.isArray?
    return Object.prototype.toString.call(arg) == '[object Array]'

  # Normalise an event object, optionally merging it with an
  # already normalised object
  normaliseEventObject = (unEvents, nEvents = {}) ->
    for selector, events of unEvents
      for eventType, callback of events
        nEvents[selector] or= {}
        nEvents[selector][eventType] or= []

        if isArray(callback)
          nEvents[selector][eventType] =
            nEvents[selector][eventType].concat(callback)
        else
          nEvents[selector][eventType].push(callback)
    return nEvents

  # Delegate an event with an array of callbacks
  delegateEvent = (eventType, selector, callbacks) ->
    el = @el
    scope = @
    eventType = nsEvent.call(@, eventType)

    # Build the el, eventType and selector into this delegator
    delegate = do (el, eventType, selector) ->
      if selector is ''
        return (callback) -> el.on(eventType, callback)
      else
        return (callback) -> el.on(eventType, selector, callback)

    # Now delegate every callback individually
    for callback in callbacks
      callback = @[callback] if typeof callback is 'string'
      do (callback) ->
        delegate ->
          # We convert args to a real array
          args = Array.prototype.slice.call(arguments)

          # Unshift el to the beginning of args
          args.unshift(@)

          # Call the callback
          callback.apply(scope, args)     

  # Delegate events. Optionally takes a map of new events to
  # add to the object's previously defined events.
  delegateEvents: (eventsToDelegate = @events) ->

    unless eventsToDelegate is @events
      normaliseEventObject(eventsToDelegate, @events)
        
    @undelegateEvents()

    for selector, events of @events
      for eventType, callbacks of events
        delegateEvent.call(@, eventType, selector, callbacks)

    @hasDelegated = true
    return @

  # Undelegate all events
  undelegateEvents: ->
    @el.off(nsEvent.call(@)) if @hasDelegated
    @hasDelegated = false
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