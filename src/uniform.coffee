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

  # JS library, default is jQuery as set in constructor
  $: null

  # A namespace to create events under
  ns: 'Uniform'

  # Have we previously delegated events?
  has_delegated: no

  # The constructor takes one argument – an object – which can
  # override certain properties before initialising
  # We also build the template if necessary and select a JS
  constructor: (settings) ->
    @[key] = val for key, val of settings when key in ['el', '$', 'ns', 'uid']

    @uid or= ++Uniform.unique_counter
    @$ or= Uniform.$

    @build_template(-> @init())

  # The template, blank by default
  template: (built) -> built ''

  # Build the template if @el isn't set or is empty
  build_template: (callback) ->
    if @el?.length?
      callback.call(@)

    else
      @template (view) =>
        @el = @$(view)
        callback.call(@)

    return @

  # Elements are cached and events delegated by default
  init: ->
    @cache_elements()
    @delegate_events()

  # The elements map
  elements: (add) -> {}

  # Find elements relative to @el
  find: (sel) -> @el.find(sel)

  # Cache elements relative to @elements
  cache_elements: ->
    add = (name, selector) =>
      @[name] = @find(selector)
      return {}

    add(name, sel) for name, sel of @elements(add)
    return @

  # The event map
  events: (add) -> {}

  # Build a namespace event_type
  ns_event = (event_type = '') -> "#{event_type}.#{@ns}#{@uid}"

  # Is array
  is_array = (arg) ->
    return Array.isArray(arg) if Array.isArray?
    return Object.prototype.toString.call(arg) == '[object Array]'
  
  # Delegate an event with an array of callbacks
  delegate_event = (event_type, selector, callback) ->
    if typeof selector is 'string'
      el = @el
    else
      el = @$(selector)
      selector = ''

    scope = @
    event_type = ns_event.call(@, event_type)

    # Build the el, event_type and selector into this delegator
    delegate = do (el, event_type, selector) ->
      if selector is ''
        return (callback) -> el.on(event_type, callback)
      else
        return (callback) -> el.on(event_type, selector, callback)

    # Now delegate every callback individually
    callback = @[callback] if typeof callback is 'string'

    do (callback) ->
      delegate ->
        # We convert args to a real array
        args = Array.prototype.slice.call(arguments)

        # Unshift el to the beginning of args
        args.unshift(@)

        # Call the callback
        callback.apply(scope, args)     

  # Delegate events
  delegate_events: ->
    @undelegate_events()

    add = (selector, event_type, callback) =>
      unless callback?
        [selector, event_type, callback] = ['', selector, event_type]

      delegate_event.call(@, event_type, selector, callback)
      return {}

    for selector, events of @events(add)
      for event_type, callback of events
        add(selector, event_type, callback)

    @has_delegated = yes
    return @

  # Undelegate all events
  undelegate_events: ->
    @el.off(ns_event.call(@)) if @has_delegated
    @has_delegated = no
    return @

  # Undelegate and remove @el from the DOM!
  destroy: ->
    @undelegate_events()
    @el.remove()
    @el = null
    return @
