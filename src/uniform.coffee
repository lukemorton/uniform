# Uniform
#
# Describes a DOM element and it's children along with their
# behaviour in a web page.
#
# Written by Luke Morton, MIT licensed.
# https://github.com/DrPheltRight/uniform
class Uniform
  
  # Unique counter
  @unique_counter = 0

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
  has_delegated: false

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
    # Merge all but events
    @[key] = val for key, val of settings when key isnt 'events'

    @uid or= ++Uniform.unique_counter
    @$ or= require('jquery')
    @el = @buildTemplate() unless @el and @el.length?
    @cacheElements()

    # Normalise events object first
    @events = normalise_event_object({}, @events)

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
    @template = @template() if typeof @template is 'function'
    @$(@template)
  build_template: (callback) ->

  # Find elements relative to @el
  find: (sel) -> @el.find(sel)

  # Build a namespace event_type
  ns_event = (event_type = '') -> "#{event_type}.#{@ns}#{@uid}"

  # Is array
  is_array = (arg) ->
    return Array.isArray(arg) if Array.isArray?
    return Object.prototype.toString.call(arg) == '[object Array]'

  # Normalise an event object, optionally merging it with an
  # already normalised object
  normalise_event_object = (norm_events, unnorm_events) ->
    for selector, events of unnorm_events
      for event_type, callback of events
        norm_events[selector] or= {}
        norm_events[selector][event_type] or= []

        if is_array(callback)
          norm_events[selector][event_type] =
            norm_events[selector][event_type].concat(callback)
        else
          norm_events[selector][event_type].push(callback)
    return norm_events

  @extend_events = (events) ->
    n = normalise_event_object
    @::events = n(n({}, @::events), events)

  # Delegate an event with an array of callbacks
  delegate_event = (event_type, selector, callbacks) ->
    el = @el
    scope = @
    event_type = ns_event.call(@, event_type)

    # Build the el, event_type and selector into this delegator
    delegate = do (el, event_type, selector) ->
      if selector is ''
        return (callback) -> el.on(event_type, callback)
      else
        return (callback) -> el.on(event_type, selector, callback)

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

  # Delegate events.
  delegate_events: ->
    @undelegate_events()

    for selector, events of @events
      for event_type, callbacks of events
        delegate_event.call(@, event_type, selector, callbacks)

    @has_delegated = true
    return @

  # Undelegate all events
  undelegate_events: ->
    @el.off(ns_event.call(@)) if @has_delegated
    @has_delegated = false
    return @
  
  # Cache elements relative to @elements
  cache_elements: ->
    @[name] = @find(sel) for name, sel of @elements
    return @

  # Undelegate and remove @el from the DOM!
  destroy: ->
    @undelegate_events()
    @el.remove()
    @el = null
    return @
