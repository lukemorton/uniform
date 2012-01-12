class Uniform
  constructor: (settings) ->
    @[key] = val for key, val of settings
    @$ = require 'jquery' unless @$?
    @el = @buildTemplate() unless @el and @el.length?
    @cacheElements()
    @delegateEvents()
    @init()
  
  el: null

  template: ''

  $: null

  find: (sel) -> @el.find(sel)

  init: (-> )

  ns: 'Uniform'

  events: {}

  buildTemplate: ->
    @template = @template() if typeof @template is 'function'
    @$(@template)

  eventMap = (fn, events) ->
    for selector, events of events
      if selector is ''
        for eventType, callback of events
          @el[fn]("#{eventType}.#{@ns}", => callback.apply(@, arguments)) 
      else
        for eventType, callback of events
          @el[fn]("#{eventType}.#{@ns}", selector, => callback.apply(@, arguments))
    return

  delegateEvents: (eventsToDelegate = @events) ->
    unless eventsToDelegate is @events
      # Merge new events to @events
      @events[selector] = events for selector, events of eventsToDelegate
    
    @undelegateEvents()
    eventMap.call(@, 'on', @events)

  undelegateEvents: -> eventMap.call(@, 'off', @events)    
  cacheElements: ->
    @[name] = @find(sel) for name, sel of @elements

  destroy: ->
    @undelegateEvents()
    @el.remove()
    @el = null