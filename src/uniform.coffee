# Uniform
#
# Describes a DOM element and it's children along with their
# behaviour in a web page.
#
# Written by Luke Morton, MIT licensed.
# https://github.com/DrPheltRight/uniform
class Uniform
  
  @unique_counter = 0

  @create_class = (methods) ->
    klass = class extends @
      constructor: ->
        if methods.constructor isnt Object
          methods.constructor.apply(@, arguments)
        else
          super
    
    for method_name, method of methods when method_name isnt 'constructor'
      klass::[method_name] = method

    return klass

  # The constructor takes one argument – an object – which can
  # override certain properties before initialising
  # We also build the template if necessary and select a JS
  constructor: (settings) ->
    @[key] = val for key, val of settings when key in ['el', '$', 'ns', 'uid']
 
    # DOM element, that this object represents
    @el or= null
    
    # JS library, default is jQuery as set in constructor
    @$ or= Uniform.$

    # A namespace to create events under
    @ns or= 'Uniform'

    # Unique ID for this Uniform
    @uid or= ++Uniform.unique_counter

    # Store delegated events
    @delegated_events = []

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
  
  # Delegate an event
  delegate_event = (event_type, selector, callback) ->
    if typeof selector is 'string'
      el = @el
    else
      el = @$(selector)
      selector = ''

    args = [ns_event.call(@, event_type)]
    args.push(selector) unless selector is ''

    scope = @
    callback = @[callback] if typeof callback is 'string'

    # Add element which the event triggered on to the
    # beginning of the args array applied to the callback
    # Also ensures the scope of the callback is the Uniform
    # object instead of the element (as per normal jQuery).
    args.push ->
      callback_args = Array.prototype.slice.call(arguments)
      callback_args.unshift(@)
      callback.apply(scope, callback_args)

    el.on.apply(el, args)
    @delegated_events.push([el].concat(args))

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

    return @

  # Undelegate all events
  undelegate_events: ->
    while delegated_event = @delegated_events.pop()
      [el, event_type] = delegated_event
      el.off(event_type)
    return @

  # Undelegate and remove @el from the DOM!
  destroy: ->
    @undelegate_events()
    @el.remove()
    @el = null
    return @
