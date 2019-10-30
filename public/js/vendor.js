(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["./public/js/vendor"],{

/***/ "./node_modules/backbone/backbone.js":
/*!*******************************************!*\
  !*** ./node_modules/backbone/backbone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Backbone.js 1.4.0

//     (c) 2010-2019 Jeremy Ashkenas and DocumentCloud
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global;

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js"), __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else { var _, $; }

})(function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to a common array method we'll want to use later.
  var slice = Array.prototype.slice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.4.0';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... this will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // a custom event channel. You may bind a callback to an event with `on` or
  // remove with `off`; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {};

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // A private global variable to share between listeners and listenees.
  var _listening;

  // Iterates over the standard `event, callback` (as well as the fancy multiple
  // space-separated events `"change blur", callback` and jQuery-style event
  // maps `{event: callback}`).
  var eventsApi = function(iteratee, events, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // Handle event maps.
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length ; i++) {
        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // Handle space-separated event names by delegating them individually.
      for (names = name.split(eventSplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // Finally, standard events.
      events = iteratee(events, name, callback, opts);
    }
    return events;
  };

  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  Events.on = function(name, callback, context) {
    this._events = eventsApi(onApi, this._events || {}, name, callback, {
      context: context,
      ctx: this,
      listening: _listening
    });

    if (_listening) {
      var listeners = this._listeners || (this._listeners = {});
      listeners[_listening.id] = _listening;
      // Allow the listening to use a counter, instead of tracking
      // callbacks for library interop
      _listening.interop = false;
    }

    return this;
  };

  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  Events.listenTo = function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = _listening = listeningTo[id];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
      this._listenId || (this._listenId = _.uniqueId('l'));
      listening = _listening = listeningTo[id] = new Listening(this, obj);
    }

    // Bind callbacks on obj.
    var error = tryCatchOn(obj, name, callback, this);
    _listening = void 0;

    if (error) throw error;
    // If the target obj is not Backbone.Events, track events manually.
    if (listening.interop) listening.on(name, callback);

    return this;
  };

  // The reducing API that adds a callback to the `events` object.
  var onApi = function(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context, ctx = options.ctx, listening = options.listening;
      if (listening) listening.count++;

      handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
    }
    return events;
  };

  // An try-catch guarded #on function, to prevent poisoning the global
  // `_listening` variable.
  var tryCatchOn = function(obj, name, callback, context) {
    try {
      obj.on(name, callback, context);
    } catch (e) {
      return e;
    }
  };

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  Events.off = function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
    });

    return this;
  };

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  Events.stopListening = function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);
    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
      if (listening.interop) listening.off(name, callback);
    }
    if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

    return this;
  };

  // The reducing API that removes a callback from the `events` object.
  var offApi = function(events, name, callback, options) {
    if (!events) return;

    var context = options.context, listeners = options.listeners;
    var i = 0, names;

    // Delete all event listeners and "drop" events.
    if (!name && !context && !callback) {
      for (names = _.keys(listeners); i < names.length; i++) {
        listeners[names[i]].cleanup();
      }
      return;
    }

    names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // Bail out if there are no events stored.
      if (!handlers) break;

      // Find any remaining events.
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (
          callback && callback !== handler.callback &&
            callback !== handler.callback._callback ||
              context && context !== handler.context
        ) {
          remaining.push(handler);
        } else {
          var listening = handler.listening;
          if (listening) listening.off(name, callback);
        }
      }

      // Replace events if there are any remaining.  Otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }

    return events;
  };

  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, its listener will be removed. If multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  Events.once = function(name, callback, context) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this));
    if (typeof name === 'string' && context == null) callback = void 0;
    return this.on(events, callback, context);
  };

  // Inversion-of-control versions of `once`.
  Events.listenToOnce = function(obj, name, callback) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
    return this.listenTo(obj, events);
  };

  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
  // `offer` unbinds the `onceWrapper` after it has been called.
  var onceMap = function(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function() {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.trigger = function(name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
  };

  // Handles triggering the appropriate event callbacks.
  var triggerApi = function(objEvents, name, callback, args) {
    if (objEvents) {
      var events = objEvents[name];
      var allEvents = objEvents.all;
      if (events && allEvents) allEvents = allEvents.slice();
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // A listening class that tracks and cleans up memory bindings
  // when all callbacks have been offed.
  var Listening = function(listener, obj) {
    this.id = listener._listenId;
    this.listener = listener;
    this.obj = obj;
    this.interop = true;
    this.count = 0;
    this._events = void 0;
  };

  Listening.prototype.on = Events.on;

  // Offs a callback (or several).
  // Uses an optimized counter if the listenee uses Backbone.Events.
  // Otherwise, falls back to manual tracking to support events
  // library interop.
  Listening.prototype.off = function(name, callback) {
    var cleanup;
    if (this.interop) {
      this._events = eventsApi(offApi, this._events, name, callback, {
        context: void 0,
        listeners: void 0
      });
      cleanup = !this._events;
    } else {
      this.count--;
      cleanup = this.count === 0;
    }
    if (cleanup) this.cleanup();
  };

  // Cleans up memory bindings between the listener and the listenee.
  Listening.prototype.cleanup = function() {
    delete this.listener._listeningTo[this.obj._listenId];
    if (!this.interop) delete this.obj._listeners[this.id];
  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    this.cid = _.uniqueId(this.cidPrefix);
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    var defaults = _.result(this, 'defaults');
    attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // The prefix is used to create the client id which is used to identify models locally.
    // You may want to override this if you're experiencing name clashes with model ids.
    cidPrefix: 'c',

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Model.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Special-cased proxy to underscore's `_.matches` method.
    matches: function(attrs) {
      return !!_.iteratee(attrs, this)(this.attributes);
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      var unset      = options.unset;
      var silent     = options.silent;
      var changes    = [];
      var changing   = this._changing;
      this._changing = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }

      var current = this.attributes;
      var changed = this.changed;
      var prev    = this._previousAttributes;

      // For each `set` attribute, update or delete the current value.
      for (var attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          changed[attr] = val;
        } else {
          delete changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Update the `id`.
      if (this.idAttribute in attrs) this.id = this.get(this.idAttribute);

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0; i < changes.length; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      var changed = {};
      var hasChanged;
      for (var attr in diff) {
        var val = diff[attr];
        if (_.isEqual(old[attr], val)) continue;
        changed[attr] = val;
        hasChanged = true;
      }
      return hasChanged ? changed : false;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server, merging the response with the model's
    // local attributes. Any changed attributes will trigger a "change" event.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (!model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true, parse: true}, options);
      var wait = options.wait;

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !wait) {
        if (!this.set(attrs, options)) return false;
      } else if (!this._validate(attrs, options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      var attributes = this.attributes;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
        if (serverAttrs && !model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      // Set temporary attributes if `{wait: true}` to properly find new ids.
      if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);

      var method = this.isNew() ? 'create' : options.patch ? 'patch' : 'update';
      if (method === 'patch' && !options.attrs) options.attrs = attrs;
      var xhr = this.sync(method, this, options);

      // Restore attributes.
      this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stopListening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isNew()) {
        _.defer(options.success);
      } else {
        wrapError(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.get(this.idAttribute);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend({}, options, {validate: true}));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analogous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Splices `insert` into `array` at index `at`.
  var splice = function(array, insert, at) {
    at = Math.min(Math.max(at, 0), array.length);
    var tail = Array(array.length - at);
    var length = insert.length;
    var i;
    for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
    for (i = 0; i < length; i++) array[i + at] = insert[i];
    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,


    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Collection.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model) { return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set. `models` may be Backbone
    // Models or raw JavaScript objects to be converted to Models, or any
    // combination of the two.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      options = _.extend({}, options);
      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();
      var removed = this._removeModels(models, options);
      if (!options.silent && removed.length) {
        options.changes = {added: [], merged: [], removed: removed};
        this.trigger('update', this, options);
      }
      return singular ? removed[0] : removed;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      if (models == null) return;

      options = _.extend({}, setOptions, options);
      if (options.parse && !this._isModel(models)) {
        models = this.parse(models, options) || [];
      }

      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();

      var at = options.at;
      if (at != null) at = +at;
      if (at > this.length) at = this.length;
      if (at < 0) at += this.length + 1;

      var set = [];
      var toAdd = [];
      var toMerge = [];
      var toRemove = [];
      var modelMap = {};

      var add = options.add;
      var merge = options.merge;
      var remove = options.remove;

      var sort = false;
      var sortable = this.comparator && at == null && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      var model, i;
      for (i = 0; i < models.length; i++) {
        model = models[i];

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        var existing = this.get(model);
        if (existing) {
          if (merge && model !== existing) {
            var attrs = this._isModel(model) ? model.attributes : model;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            toMerge.push(existing);
            if (sortable && !sort) sort = existing.hasChanged(sortAttr);
          }
          if (!modelMap[existing.cid]) {
            modelMap[existing.cid] = true;
            set.push(existing);
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(model, options);
          if (model) {
            toAdd.push(model);
            this._addReference(model, options);
            modelMap[model.cid] = true;
            set.push(model);
          }
        }
      }

      // Remove stale models.
      if (remove) {
        for (i = 0; i < this.length; i++) {
          model = this.models[i];
          if (!modelMap[model.cid]) toRemove.push(model);
        }
        if (toRemove.length) this._removeModels(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      var orderChanged = false;
      var replace = !sortable && add && remove;
      if (set.length && replace) {
        orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
          return m !== set[index];
        });
        this.models.length = 0;
        splice(this.models, set, 0);
        this.length = this.models.length;
      } else if (toAdd.length) {
        if (sortable) sort = true;
        splice(this.models, toAdd, at == null ? this.length : at);
        this.length = this.models.length;
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort/update events.
      if (!options.silent) {
        for (i = 0; i < toAdd.length; i++) {
          if (at != null) options.index = at + i;
          model = toAdd[i];
          model.trigger('add', model, this, options);
        }
        if (sort || orderChanged) this.trigger('sort', this, options);
        if (toAdd.length || toRemove.length || toMerge.length) {
          options.changes = {
            added: toAdd,
            removed: toRemove,
            merged: toMerge
          };
          this.trigger('update', this, options);
        }
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      return this.remove(model, options);
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      return this.remove(model, options);
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id, cid, model object with id or cid
    // properties, or an attributes object that is transformed through modelId.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] ||
        this._byId[this.modelId(this._isModel(obj) ? obj.attributes : obj)] ||
        obj.cid && this._byId[obj.cid];
    },

    // Returns `true` if the model is in the collection.
    has: function(obj) {
      return this.get(obj) != null;
    },

    // Get the model at the given index.
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      return this[first ? 'find' : 'filter'](attrs);
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      var comparator = this.comparator;
      if (!comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      var length = comparator.length;
      if (_.isFunction(comparator)) comparator = comparator.bind(this);

      // Run sort based on type of `comparator`.
      if (length === 1 || _.isString(comparator)) {
        this.models = this.sortBy(comparator);
      } else {
        this.models.sort(comparator);
      }
      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return this.map(attr + '');
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(m, resp, callbackOpts) {
        if (wait) collection.add(m, callbackOpts);
        if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models, {
        model: this.model,
        comparator: this.comparator
      });
    },

    // Define how to uniquely identify models in the collection.
    modelId: function(attrs) {
      return attrs[this.model.prototype.idAttribute || 'id'];
    },

    // Get an iterator of all models in this collection.
    values: function() {
      return new CollectionIterator(this, ITERATOR_VALUES);
    },

    // Get an iterator of all model IDs in this collection.
    keys: function() {
      return new CollectionIterator(this, ITERATOR_KEYS);
    },

    // Get an iterator of all [ID, model] tuples in this collection.
    entries: function() {
      return new CollectionIterator(this, ITERATOR_KEYSVALUES);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (this._isModel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method called by both remove and set.
    _removeModels: function(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;

        // Remove references before triggering 'remove' event to prevent an
        // infinite loop. #3693
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes);
        if (id != null) delete this._byId[id];

        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }

        removed.push(model);
        this._removeReference(model, options);
      }
      return removed;
    },

    // Method for checking whether an object should be considered a model for
    // the purposes of adding to the collection.
    _isModel: function(model) {
      return model instanceof Model;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      var id = this.modelId(model.attributes);
      if (id != null) this._byId[id] = model;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      delete this._byId[model.cid];
      var id = this.modelId(model.attributes);
      if (id != null) delete this._byId[id];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (event === 'change') {
          var prevId = this.modelId(model.previousAttributes());
          var id = this.modelId(model.attributes);
          if (prevId !== id) {
            if (prevId != null) delete this._byId[prevId];
            if (id != null) this._byId[id] = model;
          }
        }
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Defining an @@iterator method implements JavaScript's Iterable protocol.
  // In modern ES2015 browsers, this value is found at Symbol.iterator.
  /* global Symbol */
  var $$iterator = typeof Symbol === 'function' && Symbol.iterator;
  if ($$iterator) {
    Collection.prototype[$$iterator] = Collection.prototype.values;
  }

  // CollectionIterator
  // ------------------

  // A CollectionIterator implements JavaScript's Iterator protocol, allowing the
  // use of `for of` loops in modern browsers and interoperation between
  // Backbone.Collection and other JavaScript functions and third-party libraries
  // which can operate on Iterables.
  var CollectionIterator = function(collection, kind) {
    this._collection = collection;
    this._kind = kind;
    this._index = 0;
  };

  // This "enum" defines the three possible kinds of values which can be emitted
  // by a CollectionIterator that correspond to the values(), keys() and entries()
  // methods on Collection, respectively.
  var ITERATOR_VALUES = 1;
  var ITERATOR_KEYS = 2;
  var ITERATOR_KEYSVALUES = 3;

  // All Iterators should themselves be Iterable.
  if ($$iterator) {
    CollectionIterator.prototype[$$iterator] = function() {
      return this;
    };
  }

  CollectionIterator.prototype.next = function() {
    if (this._collection) {

      // Only continue iterating if the iterated collection is long enough.
      if (this._index < this._collection.length) {
        var model = this._collection.at(this._index);
        this._index++;

        // Construct a value depending on what kind of values should be iterated.
        var value;
        if (this._kind === ITERATOR_VALUES) {
          value = model;
        } else {
          var id = this._collection.modelId(model.attributes);
          if (this._kind === ITERATOR_KEYS) {
            value = id;
          } else { // ITERATOR_KEYSVALUES
            value = [id, model];
          }
        }
        return {value: value, done: false};
      }

      // Once exhausted, remove the reference to the collection so future
      // calls to the next method always return done.
      this._collection = void 0;
    }

    return {value: void 0, done: true};
  };

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this.preinitialize.apply(this, arguments);
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be set as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the View
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this._removeElement();
      this.stopListening();
      return this;
    },

    // Remove this view's element from the document and all event listeners
    // attached to it. Exposed for subclasses using an alternative DOM
    // manipulation API.
    _removeElement: function() {
      this.$el.remove();
    },

    // Change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setElement: function(element) {
      this.undelegateEvents();
      this._setElement(element);
      this.delegateEvents();
      return this;
    },

    // Creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
    // context or an element. Subclasses can override this to utilize an
    // alternative DOM manipulation API and are only required to set the
    // `this.el` property.
    _setElement: function(el) {
      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
      this.el = this.$el[0];
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function(events) {
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[method];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], method.bind(this));
      }
      return this;
    },

    // Add a single event listener to the view's element (or a child element
    // using `selector`). This only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Produces a DOM element to be assigned to your view. Exposed for
    // subclasses using an alternative DOM manipulation API.
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this.setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this.setElement(_.result(this, 'el'));
      }
    },

    // Set attributes from a hash on this view's element.  Exposed for
    // subclasses using an alternative DOM manipulation API.
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }

  });

  // Proxy Backbone class methods to Underscore functions, wrapping the model's
  // `attributes` object or collection's `models` array behind the scenes.
  //
  // collection.filter(function(model) { return model.get('age') > 10 });
  // collection.each(this.addView);
  //
  // `Function#apply` can be slow so we use the method's arg count, if we know it.
  var addMethod = function(base, length, method, attribute) {
    switch (length) {
      case 1: return function() {
        return base[method](this[attribute]);
      };
      case 2: return function(value) {
        return base[method](this[attribute], value);
      };
      case 3: return function(iteratee, context) {
        return base[method](this[attribute], cb(iteratee, this), context);
      };
      case 4: return function(iteratee, defaultVal, context) {
        return base[method](this[attribute], cb(iteratee, this), defaultVal, context);
      };
      default: return function() {
        var args = slice.call(arguments);
        args.unshift(this[attribute]);
        return base[method].apply(base, args);
      };
    }
  };

  var addUnderscoreMethods = function(Class, base, methods, attribute) {
    _.each(methods, function(length, method) {
      if (base[method]) Class.prototype[method] = addMethod(base, length, method, attribute);
    });
  };

  // Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
  var cb = function(iteratee, instance) {
    if (_.isFunction(iteratee)) return iteratee;
    if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
    if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
    return iteratee;
  };
  var modelMatcher = function(attrs) {
    var matcher = _.matches(attrs);
    return function(model) {
      return matcher(model.attributes);
    };
  };

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var collectionMethods = {forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
    foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
    select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
    contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
    head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
    without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
    isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
    sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3};


  // Underscore methods that we want to implement on the Model, mapped to the
  // number of arguments they take.
  var modelMethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
    omit: 0, chain: 1, isEmpty: 1};

  // Mix in each Underscore method as a proxy to `Collection#models`.

  _.each([
    [Collection, collectionMethods, 'models'],
    [Model, modelMethods, 'attributes']
  ], function(config) {
    var Base = config[0],
        methods = config[1],
        attribute = config[2];

    Base.mixin = function(obj) {
      var mappings = _.reduce(_.functions(obj), function(memo, name) {
        memo[name] = 0;
        return memo;
      }, {});
      addUnderscoreMethods(Base, obj, mappings, attribute);
    };

    addUnderscoreMethods(Base, _, methods, attribute);
  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // Pass along `textStatus` and `errorThrown` from jQuery.
    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown) {
      options.textStatus = textStatus;
      options.errorThrown = errorThrown;
      if (error) error.call(options.context, xhr, textStatus, errorThrown);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    create: 'POST',
    update: 'PUT',
    patch: 'PATCH',
    delete: 'DELETE',
    read: 'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Router.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function(match, optional) {
          return optional ? match : '([^/?]+)';
        })
        .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    this.checkUrl = this.checkUrl.bind(this);

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
      return path === this.root && !this.getSearch();
    },

    // Does the pathname match the root?
    matchRoot: function() {
      var path = this.decodeFragment(this.location.pathname);
      var rootPath = path.slice(0, this.root.length - 1) + '/';
      return rootPath === this.root;
    },

    // Unicode characters in `location.pathname` are percent encoded so they're
    // decoded for comparison. `%25` should not be decoded since it may be part
    // of an encoded parameter.
    decodeFragment: function(fragment) {
      return decodeURI(fragment.replace(/%25/g, '%2525'));
    },

    // In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the pathname and search params, without the root.
    getPath: function() {
      var path = this.decodeFragment(
        this.location.pathname + this.getSearch()
      ).slice(this.root.length - 1);
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function(fragment) {
      if (fragment == null) {
        if (this._usePushState || !this._wantsHashChange) {
          fragment = this.getPath();
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error('Backbone.history has already been started');
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.history && this.history.pushState);
      this._usePushState    = this._wantsPushState && this._hasPushState;
      this.fragment         = this.getFragment();

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          var rootPath = this.root.slice(0, -1) || '/';
          this.location.replace(rootPath + '#' + this.getPath());
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot()) {
          this.navigate(this.getHash(), {replace: true});
        }

      }

      // Proxy an iframe to handle location events if the browser doesn't
      // support the `hashchange` event, HTML5 history, or the user wants
      // `hashChange` but not `pushState`.
      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'javascript:0';
        this.iframe.style.display = 'none';
        this.iframe.tabIndex = -1;
        var body = document.body;
        // Using `appendChild` will throw on IE < 9 if the document is not ready.
        var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
        iWindow.document.open();
        iWindow.document.close();
        iWindow.location.hash = '#' + this.fragment;
      }

      // Add a cross-platform `addEventListener` shim for older browsers.
      var addEventListener = window.addEventListener || function(eventName, listener) {
        return attachEvent('on' + eventName, listener);
      };

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._usePushState) {
        addEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        addEventListener('hashchange', this.checkUrl, false);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      // Add a cross-platform `removeEventListener` shim for older browsers.
      var removeEventListener = window.removeEventListener || function(eventName, listener) {
        return detachEvent('on' + eventName, listener);
      };

      // Remove window listeners.
      if (this._usePushState) {
        removeEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        removeEventListener('hashchange', this.checkUrl, false);
      }

      // Clean up the iframe if necessary.
      if (this.iframe) {
        document.body.removeChild(this.iframe);
        this.iframe = null;
      }

      // Some environments will throw when clearing an undefined interval.
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();

      // If the user pressed the back button, the iframe's hash will have
      // changed and we should use that for comparison.
      if (current === this.fragment && this.iframe) {
        current = this.getHash(this.iframe.contentWindow);
      }

      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      // If the root doesn't match, no routes can match either.
      if (!this.matchRoot()) return false;
      fragment = this.fragment = this.getFragment(fragment);
      return _.some(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // Normalize the fragment.
      fragment = this.getFragment(fragment || '');

      // Don't include a trailing slash on the root.
      var rootPath = this.root;
      if (fragment === '' || fragment.charAt(0) === '?') {
        rootPath = rootPath.slice(0, -1) || '/';
      }
      var url = rootPath + fragment;

      // Strip the fragment of the query and hash for matching.
      fragment = fragment.replace(pathStripper, '');

      // Decode for matching.
      var decodedFragment = this.decodeFragment(fragment);

      if (this.fragment === decodedFragment) return;
      this.fragment = decodedFragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
          var iWindow = this.iframe.contentWindow;

          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if (!options.replace) {
            iWindow.document.open();
            iWindow.document.close();
          }

          this._updateHash(iWindow.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function and add the prototype properties.
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/jquery/dist/jquery.js":
/*!********************************************!*\
  !*** ./node_modules/jquery/dist/jquery.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.4.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2019-05-01T21:04Z
 */
( function( global, factory ) {

	"use strict";

	if (  true && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.4.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code, options ) {
		DOMEval( code, { nonce: options && options.nonce } );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.4
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2019-04-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) &&

				// Support: IE 8 only
				// Exclude object elements
				(nodeType !== 1 || context.nodeName.toLowerCase() !== "object") ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 && rdescend.test( selector ) ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = (elem.ownerDocument || elem).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( typeof elem.contentDocument !== "undefined" ) {
			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								} );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	// Support: IE 9-11 only
	// Also use offsetWidth/offsetHeight for when box sizing is unreliable
	// We use getClientRects() to check for hidden/disconnected.
	// In those cases, the computed value can be trusted to be border-box
	if ( ( !support.boxSizingReliable() && isBorderBox ||
		val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url, options ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),

/***/ "./node_modules/ractive/ractive.mjs":
/*!******************************************!*\
  !*** ./node_modules/ractive/ractive.mjs ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
	Ractive.js v1.3.8
	Build: 2584a0f8b90e1ff96a15df9d956d71e500f8eaa0
	Date: Mon Sep 16 2019 20:54:41 GMT+0000 (UTC)
	Website: https://ractive.js.org
	License: MIT
*/
/* istanbul ignore if */
if (!Object.assign) {
  Object.assign = function(target) {
    var sources = [], len = arguments.length - 1;
    while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

    if (target == null) { throw new TypeError('Cannot convert undefined or null to object'); }

    var to = Object(target);
    var sourcesLength = sources.length;

    for (var index = 0; index < sourcesLength; index++) {
      var nextSource = sources[index];
      for (var nextKey in nextSource) {
        if (!Object.prototype.hasOwnProperty.call(nextSource, nextKey)) { continue; }
        to[nextKey] = nextSource[nextKey];
      }
    }

    return to;
  };
}

function hasOwn(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function fillGaps(target) {
  var sources = [], len = arguments.length - 1;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

  for (var i = 0; i < sources.length; i++) {
    var source = sources[i];
    for (var key in source) {
      // Source can be a prototype-less object.
      if (key in target || !hasOwn(source, key)) { continue; }
      target[key] = source[key];
    }
  }

  return target;
}

function toPairs(obj) {
  if ( obj === void 0 ) obj = {};

  var pairs = [];
  for (var key in obj) {
    // Source can be a prototype-less object.
    if (!hasOwn(obj, key)) { continue; }
    pairs.push([key, obj[key]]);
  }
  return pairs;
}

var obj = Object;

var assign = obj.assign;

var create = obj.create;

var defineProperty = obj.defineProperty;

var defineProperties = obj.defineProperties;

var keys = obj.keys;

var toString = Object.prototype.toString;


var isArray = Array.isArray;

function isEqual(a, b) {
  if (a === null && b === null) {
    return true;
  }

  if (isObjectType(a) || isObjectType(b)) {
    return false;
  }

  return a === b;
}

// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
function isNumeric(thing) {
  return !isNaN(parseFloat(thing)) && isFinite(thing);
}

function isObject(thing) {
  return thing && toString.call(thing) === '[object Object]';
}

function isObjectLike(thing) {
  return !!(thing && (isObjectType(thing) || isFunction(thing)));
}

function isObjectType(thing) {
  return typeof thing === 'object';
}

function isFunction(thing) {
  return typeof thing === 'function';
}

function isString(thing) {
  return typeof thing === 'string';
}

function isNumber(thing) {
  return typeof thing === 'number';
}

function isUndefined(thing) {
  return thing === undefined;
}

/* istanbul ignore if */
if (!Array.prototype.find) {
  defineProperty(Array.prototype, 'find', {
    value: function value(callback, thisArg) {
      if (this === null || isUndefined(this))
        { throw new TypeError('Array.prototype.find called on null or undefined'); }

      if (!isFunction(callback)) { throw new TypeError((callback + " is not a function")); }

      var array = Object(this);
      var arrayLength = array.length >>> 0;

      for (var index = 0; index < arrayLength; index++) {
        if (!hasOwn(array, index)) { continue; }
        if (!callback.call(thisArg, array[index], index, array)) { continue; }
        return array[index];
      }

      return undefined;
    },
    configurable: true,
    writable: true
  });
}

// NOTE: Node doesn't exist in IE8. Nothing can be done.
/* istanbul ignore if */
if (
  typeof window !== 'undefined' &&
  window.Node &&
  window.Node.prototype &&
  !window.Node.prototype.contains
) {
  Node.prototype.contains = function(node) {
    var this$1 = this;

    if (!node) { throw new TypeError('node required'); }

    do {
      if (this$1 === node) { return true; }
    } while ((node = node && node.parentNode));

    return false;
  };
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.performance && !window.performance.now) {
  window.performance = window.performance || {};

  var nowOffset = Date.now();

  window.performance.now = function() {
    return Date.now() - nowOffset;
  };
}

/* eslint no-console:"off" */
var win = typeof window !== 'undefined' ? window : null;
var doc = win ? document : null;
var isClient = !!doc;
var base = typeof global !== 'undefined' ? global : win;
var hasConsole =
  typeof console !== 'undefined' && isFunction(console.warn) && isFunction(console.warn.apply);

var svg = doc
  ? doc.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1')
  : false;

var vendors = ['o', 'ms', 'moz', 'webkit'];

/* istanbul ignore if */
if (!base.Promise) {
  var PENDING = {};
  var FULFILLED = {};
  var REJECTED = {};

  var Promise$1 = (base.Promise = function(callback) {
    var fulfilledHandlers = [];
    var rejectedHandlers = [];
    var state = PENDING;
    var result;
    var dispatchHandlers;

    var makeResolver = function (newState) {
      return function(value) {
        if (state !== PENDING) { return; }
        result = value;
        state = newState;
        dispatchHandlers = makeDispatcher(
          state === FULFILLED ? fulfilledHandlers : rejectedHandlers,
          result
        );
        wait(dispatchHandlers);
      };
    };

    var fulfill = makeResolver(FULFILLED);
    var reject = makeResolver(REJECTED);

    try {
      callback(fulfill, reject);
    } catch (err) {
      reject(err);
    }

    return {
      // `then()` returns a Promise - 2.2.7
      then: function then(onFulfilled, onRejected) {
        var promise2 = new Promise$1(function (fulfill, reject) {
          var processResolutionHandler = function (handler, handlers, forward) {
            if (isFunction(handler)) {
              handlers.push(function (p1result) {
                try {
                  resolve$1(promise2, handler(p1result), fulfill, reject);
                } catch (err) {
                  reject(err);
                }
              });
            } else {
              handlers.push(forward);
            }
          };

          processResolutionHandler(onFulfilled, fulfilledHandlers, fulfill);
          processResolutionHandler(onRejected, rejectedHandlers, reject);

          if (state !== PENDING) {
            wait(dispatchHandlers);
          }
        });
        return promise2;
      },
      catch: function catch$1(onRejected) {
        return this.then(null, onRejected);
      },
      finally: function finally$1(callback) {
        return this.then(
          function (v) {
            callback();
            return v;
          },
          function (e) {
            callback();
            throw e;
          }
        );
      }
    };
  });

  Promise$1.all = function(promises) {
    return new Promise$1(function (fulfill, reject) {
      var result = [];
      var pending;
      var i;

      if (!promises.length) {
        fulfill(result);
        return;
      }

      var processPromise = function (promise, i) {
        if (promise && isFunction(promise.then)) {
          promise.then(function (value) {
            result[i] = value;
            --pending || fulfill(result);
          }, reject);
        } else {
          result[i] = promise;
          --pending || fulfill(result);
        }
      };

      pending = i = promises.length;

      while (i--) {
        processPromise(promises[i], i);
      }
    });
  };

  Promise$1.race = function(promises) {
    return new Promise$1(function (fulfill, reject) {
      var pending = true;
      function ok(v) {
        if (!pending) { return; }
        pending = false;
        fulfill(v);
      }
      function fail(e) {
        if (!pending) { return; }
        pending = false;
        reject(e);
      }
      for (var i = 0; i < promises.length; i++) {
        if (promises[i] && isFunction(promises[i].then)) {
          promises[i].then(ok, fail);
        }
      }
    });
  };

  Promise$1.resolve = function(value) {
    if (value && isFunction(value.then)) { return value; }
    return new Promise$1(function (fulfill) {
      fulfill(value);
    });
  };

  Promise$1.reject = function(reason) {
    if (reason && isFunction(reason.then)) { return reason; }
    return new Promise$1(function (fulfill, reject) {
      reject(reason);
    });
  };

  // TODO use MutationObservers or something to simulate setImmediate
  var wait = function(callback) {
    setTimeout(callback, 0);
  };

  var makeDispatcher = function(handlers, result) {
    return function() {
      for (var handler = (void 0); (handler = handlers.shift()); ) {
        handler(result);
      }
    };
  };

  var resolve$1 = function(promise, x, fulfil, reject) {
    var then;
    if (x === promise) {
      throw new TypeError("A promise's fulfillment handler cannot return the same promise");
    }
    if (x instanceof Promise$1) {
      x.then(fulfil, reject);
    } else if (x && (isObjectType(x) || isFunction(x))) {
      try {
        then = x.then;
      } catch (e) {
        reject(e);
        return;
      }
      if (isFunction(then)) {
        var called;

        var resolvePromise = function(y) {
          if (called) { return; }
          called = true;
          resolve$1(promise, y, fulfil, reject);
        };
        var rejectPromise = function(r) {
          if (called) { return; }
          called = true;
          reject(r);
        };

        try {
          then.call(x, resolvePromise, rejectPromise);
        } catch (e) {
          if (!called) {
            reject(e);
            called = true;
            return;
          }
        }
      } else {
        fulfil(x);
      }
    } else {
      fulfil(x);
    }
  };
}

/* istanbul ignore if */
if (
  typeof window !== 'undefined' &&
  !(window.requestAnimationFrame && window.cancelAnimationFrame)
) {
  var lastTime = 0;
  window.requestAnimationFrame = function(callback) {
    var currentTime = Date.now();
    var timeToNextCall = Math.max(0, 16 - (currentTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currentTime + timeToNextCall);
    }, timeToNextCall);
    lastTime = currentTime + timeToNextCall;
    return id;
  };
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

var defaults = {
  // render placement:
  el: void 0,
  append: false,
  delegate: true,
  enhance: false,

  // template:
  template: null,

  // parse:
  allowExpressions: true,
  delimiters: ['{{', '}}'],
  tripleDelimiters: ['{{{', '}}}'],
  staticDelimiters: ['[[', ']]'],
  staticTripleDelimiters: ['[[[', ']]]'],
  csp: true,
  interpolate: false,
  preserveWhitespace: false,
  sanitize: false,
  stripComments: true,
  contextLines: 0,

  // data & binding:
  data: create(null),
  helpers: create(null),
  computed: create(null),
  syncComputedChildren: false,
  resolveInstanceMembers: false,
  warnAboutAmbiguity: false,
  adapt: [],
  isolated: true,
  twoway: true,
  lazy: false,

  // transitions:
  noIntro: false,
  noOutro: false,
  transitionsEnabled: true,
  complete: void 0,
  nestedTransitions: true,

  // css:
  css: null,
  noCSSTransform: false
};

// These are a subset of the easing equations found at
// https://raw.github.com/danro/easing-js - license info
// follows:

// --------------------------------------------------
// easing.js v0.5.4
// Generic set of easing functions with AMD support
// https://github.com/danro/easing-js
// This code may be freely distributed under the MIT license
// http://danro.mit-license.org/
// --------------------------------------------------
// All functions adapted from Thomas Fuchs & Jeremy Kahn
// Easing Equations (c) 2003 Robert Penner, BSD license
// https://raw.github.com/danro/easing-js/master/LICENSE
// --------------------------------------------------

// In that library, the functions named easeIn, easeOut, and
// easeInOut below are named easeInCubic, easeOutCubic, and
// (you guessed it) easeInOutCubic.
//
// You can add additional easing functions to this list, and they
// will be globally available.

var easing = {
  linear: function linear(pos) {
    return pos;
  },
  easeIn: function easeIn(pos) {
    /* istanbul ignore next */
    return Math.pow(pos, 3);
  },
  easeOut: function easeOut(pos) {
    return Math.pow(pos - 1, 3) + 1;
  },
  easeInOut: function easeInOut(pos) {
    /* istanbul ignore next */
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 3);
    }
    /* istanbul ignore next */
    return 0.5 * (Math.pow(pos - 2, 3) + 2);
  }
};

function noop() {}

/* global console */
/* eslint no-console:"off" */

var alreadyWarned = {};
var log;
var printWarning;
var welcome;

if (hasConsole) {
  var welcomeIntro = [
    "%cRactive.js %c1.3.8 %cin debug mode, %cmore...",
    'color: rgb(114, 157, 52); font-weight: normal;',
    'color: rgb(85, 85, 85); font-weight: normal;',
    'color: rgb(85, 85, 85); font-weight: normal;',
    'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;'
  ];
  var welcomeMessage = "You're running Ractive 1.3.8 in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\nTo disable debug mode, add this line at the start of your app:\n  Ractive.DEBUG = false;\n\nTo disable debug mode when your app is minified, add this snippet:\n  Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});\n\nGet help and support:\n  http://ractive.js.org\n  http://stackoverflow.com/questions/tagged/ractivejs\n  http://groups.google.com/forum/#!forum/ractive-js\n  http://twitter.com/ractivejs\n\nFound a bug? Raise an issue:\n  https://github.com/ractivejs/ractive/issues\n\n";

  welcome = function () {
    if (Ractive.WELCOME_MESSAGE === false) {
      welcome = noop;
      return;
    }
    var message = 'WELCOME_MESSAGE' in Ractive ? Ractive.WELCOME_MESSAGE : welcomeMessage;
    var hasGroup = !!console.groupCollapsed;
    if (hasGroup) { console.groupCollapsed.apply(console, welcomeIntro); }
    console.log(message);
    if (hasGroup) {
      console.groupEnd(welcomeIntro);
    }

    welcome = noop;
  };

  printWarning = function (message, args) {
    welcome();

    // extract information about the instance this message pertains to, if applicable
    if (isObjectType(args[args.length - 1])) {
      var options = args.pop();
      var ractive = options ? options.ractive : null;

      if (ractive) {
        // if this is an instance of a component that we know the name of, add
        // it to the message
        var name;
        if (ractive.component && (name = ractive.component.name)) {
          message = "<" + name + "> " + message;
        }

        var node;
        if (
          (node =
            options.node || (ractive.fragment && ractive.fragment.rendered && ractive.find('*')))
        ) {
          args.push(node);
        }
      }
    }

    console.warn.apply(
      console,
      ['%cRactive.js: %c' + message, 'color: rgb(114, 157, 52);', 'color: rgb(85, 85, 85);'].concat(
        args
      )
    );
  };

  log = function() {
    console.log.apply(console, arguments);
  };
} else {
  printWarning = log = welcome = noop;
}

function format(message, args) {
  return message.replace(/%s/g, function () { return args.shift(); });
}

function fatal(message) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  message = format(message, args);
  throw new Error(message);
}

function logIfDebug() {
  if (Ractive.DEBUG) {
    log.apply(null, arguments);
  }
}

function warn(message) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  message = format(message, args);
  printWarning(message, args);
}

function warnOnce(message) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  message = format(message, args);

  if (alreadyWarned[message]) {
    return;
  }

  alreadyWarned[message] = true;
  printWarning(message, args);
}

function warnIfDebug() {
  if (Ractive.DEBUG) {
    warn.apply(null, arguments);
  }
}

function warnOnceIfDebug() {
  if (Ractive.DEBUG) {
    warnOnce.apply(null, arguments);
  }
}

// Error messages that are used (or could be) in multiple places
var badArguments = 'Bad arguments';
var noRegistryFunctionReturn =
  'A function was specified for "%s" %s, but no %s was returned';
var missingPlugin = function (name, type) { return ("Missing \"" + name + "\" " + type + " plugin. You may need to download a plugin via http://ractive.js.org/integrations/#" + type + "s"); };

function findInViewHierarchy(registryName, ractive, name) {
  var instance = findInstance(registryName, ractive, name);
  return instance ? instance[registryName][name] : null;
}

function findInstance(registryName, ractive, name) {
  while (ractive) {
    if (name in ractive[registryName]) {
      return ractive;
    }

    if (ractive.isolated) {
      return null;
    }

    ractive = ractive.parent;
  }
}

function interpolate(from, to, ractive, type) {
  if (from === to) { return null; }

  if (type) {
    var interpol = findInViewHierarchy('interpolators', ractive, type);
    if (interpol) { return interpol(from, to) || null; }

    fatal(missingPlugin(type, 'interpolator'));
  }

  return (
    interpolators.number(from, to) ||
    interpolators.array(from, to) ||
    interpolators.object(from, to) ||
    null
  );
}

var interpolators = {
  number: function number(from, to) {
    if (!isNumeric(from) || !isNumeric(to)) {
      return null;
    }

    from = +from;
    to = +to;

    var delta = to - from;

    if (!delta) {
      return function() {
        return from;
      };
    }

    return function(t) {
      return from + t * delta;
    };
  },

  array: function array(from, to) {
    var len, i;

    if (!isArray(from) || !isArray(to)) {
      return null;
    }

    var intermediate = [];
    var interpolators = [];

    i = len = Math.min(from.length, to.length);
    while (i--) {
      interpolators[i] = interpolate(from[i], to[i]);
    }

    // surplus values - don't interpolate, but don't exclude them either
    for (i = len; i < from.length; i += 1) {
      intermediate[i] = from[i];
    }

    for (i = len; i < to.length; i += 1) {
      intermediate[i] = to[i];
    }

    return function(t) {
      var i = len;

      while (i--) {
        intermediate[i] = interpolators[i](t);
      }

      return intermediate;
    };
  },

  object: function object(from, to) {
    if (!isObject(from) || !isObject(to)) {
      return null;
    }

    var properties = [];
    var intermediate = {};
    var interpolators = {};

    var loop = function ( prop ) {
      if (hasOwn(from, prop)) {
        if (hasOwn(to, prop)) {
          properties.push(prop);
          interpolators[prop] = interpolate(from[prop], to[prop]) || (function () { return to[prop]; });
        } else {
          intermediate[prop] = from[prop];
        }
      }
    };

    for (var prop in from) loop( prop );

    for (var prop$1 in to) {
      if (hasOwn(to, prop$1) && !hasOwn(from, prop$1)) {
        intermediate[prop$1] = to[prop$1];
      }
    }

    var len = properties.length;

    return function(t) {
      var i = len;

      while (i--) {
        var prop = properties[i];

        intermediate[prop] = interpolators[prop](t);
      }

      return intermediate;
    };
  }
};

var refPattern = /\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g;
var splitPattern = /([^\\](?:\\\\)*)\./;
var escapeKeyPattern = /\\|\./g;
var unescapeKeyPattern = /((?:\\)+)\1|\\(\.)/g;

function escapeKey(key) {
  if (isString(key)) {
    return key.replace(escapeKeyPattern, '\\$&');
  }

  return key;
}

function normalise(ref) {
  return ref ? ref.replace(refPattern, '.$1') : '';
}

function splitKeypath(keypath) {
  var result = [];
  var match;

  keypath = normalise(keypath);

  while ((match = splitPattern.exec(keypath))) {
    var index = match.index + match[1].length;
    result.push(keypath.substr(0, index));
    keypath = keypath.substr(index + 1);
  }

  result.push(keypath);

  return result;
}

function unescapeKey(key) {
  if (isString(key)) {
    return key.replace(unescapeKeyPattern, '$1$2');
  }

  return key;
}

function addToArray(array, value) {
  var index = array.indexOf(value);

  if (index === -1) {
    array.push(value);
  }
}

function arrayContains(array, value) {
  for (var i = 0, c = array.length; i < c; i++) {
    if (array[i] == value) {
      return true;
    }
  }

  return false;
}

function arrayContentsMatch(a, b) {
  var i;

  if (!isArray(a) || !isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  i = a.length;
  while (i--) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function ensureArray(x) {
  if (isString(x)) {
    return [x];
  }

  if (isUndefined(x)) {
    return [];
  }

  return x;
}

function lastItem(array) {
  return array[array.length - 1];
}

function removeFromArray(array, member) {
  if (!array) {
    return;
  }

  var index = array.indexOf(member);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

function combine() {
  var arrays = [], len = arguments.length;
  while ( len-- ) arrays[ len ] = arguments[ len ];

  var res = arrays.concat.apply([], arrays);
  var i = res.length;
  while (i--) {
    var idx = res.indexOf(res[i]);
    if (~idx && idx < i) { res.splice(i, 1); }
  }

  return res;
}

function toArray(arrayLike) {
  var array = [];
  var i = arrayLike.length;
  while (i--) {
    array[i] = arrayLike[i];
  }

  return array;
}

function findMap(array, fn) {
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var result = fn(array[i]);
    if (result) { return result; }
  }
}

function buildNewIndices(one, two, comparator) {
  var oldArray = one;
  var newArray = two;
  if (comparator) {
    oldArray = oldArray.map(comparator);
    newArray = newArray.map(comparator);
  }

  var oldLength = oldArray.length;

  var usedIndices = {};
  var firstUnusedIndex = 0;

  var result = oldArray.map(function (item) {
    var index;
    var start = firstUnusedIndex;

    do {
      index = newArray.indexOf(item, start);

      if (index === -1) {
        return -1;
      }

      start = index + 1;
    } while (usedIndices[index] === true && start < oldLength);

    // keep track of the first unused index, so we don't search
    // the whole of newArray for each item in oldArray unnecessarily
    if (index === firstUnusedIndex) {
      firstUnusedIndex += 1;
    }
    // allow next instance of next "equal" to be found item
    usedIndices[index] = true;
    return index;
  });

  var len = (result.oldLen = oldArray.length);
  result.newLen = newArray.length;

  if (len === result.newLen) {
    var i = 0;
    for (i; i < len; i++) {
      if (result[i] !== i) { break; }
    }

    if (i === len) { result.same = true; }
  }

  return result;
}

var fnBind = Function.prototype.bind;

function bind(fn, context) {
  if (!/this/.test(fn.toString())) { return fn; }

  var bound = fnBind.call(fn, context);
  for (var prop in fn) { bound[prop] = fn[prop]; }

  return bound;
}

var shuffleTasks = { early: [], mark: [] };
var registerQueue = { early: [], mark: [] };
var noVirtual = { virtual: false };

var ModelBase = function ModelBase(parent) {
  this.deps = [];

  this.children = [];
  this.childByKey = {};
  this.links = [];

  this.bindings = [];

  if (parent) {
    this.parent = parent;
    this.root = parent.root;
  }
};
var ModelBase__proto__ = ModelBase.prototype;

ModelBase__proto__.addShuffleTask = function addShuffleTask (task, stage) {
    if ( stage === void 0 ) stage = 'early';

  shuffleTasks[stage].push(task);
};
ModelBase__proto__.addShuffleRegister = function addShuffleRegister (item, stage) {
    if ( stage === void 0 ) stage = 'early';

  registerQueue[stage].push({ model: this, item: item });
};

ModelBase__proto__.downstreamChanged = function downstreamChanged () {};

ModelBase__proto__.findMatches = function findMatches (keys$$1) {
  var len = keys$$1.length;

  var existingMatches = [this];
  var matches;
  var i;

  var loop = function (  ) {
    var key = keys$$1[i];

    if (key === '*') {
      matches = [];
      existingMatches.forEach(function (model) {
        matches.push.apply(matches, model.getValueChildren(model.get()));
      });
    } else {
      matches = existingMatches.map(function (model) { return model.joinKey(key); });
    }

    existingMatches = matches;
  };

    for (i = 0; i < len; i += 1) loop(  );

  return matches;
};

ModelBase__proto__.getKeypath = function getKeypath (ractive) {
  if (ractive !== this.ractive && this._link) { return this._link.target.getKeypath(ractive); }

  if (!this.keypath) {
    var parent = this.parent && this.parent.getKeypath(ractive);
    this.keypath = parent
      ? ((this.parent.getKeypath(ractive)) + "." + (escapeKey(this.key)))
      : escapeKey(this.key);
  }

  return this.keypath;
};

ModelBase__proto__.getValueChildren = function getValueChildren (value) {
    var this$1 = this;

  var children;
  if (isArray(value)) {
    children = [];
    if ('length' in this && this.length !== value.length) {
      children.push(this.joinKey('length'));
    }
    value.forEach(function (m, i) {
      children.push(this$1.joinKey(i));
    });
  } else if (isObject(value) || isFunction(value)) {
    children = keys(value).map(function (key) { return this$1.joinKey(key); });
  } else if (value != null) {
    children = [];
  }

  var computed = this.computed;
  if (computed) {
    children.push.apply(children, keys(computed).map(function (k) { return this$1.joinKey(k); }));
  }

  return children;
};

ModelBase__proto__.getVirtual = function getVirtual (shouldCapture) {
    var this$1 = this;

  var value = this.get(shouldCapture, { virtual: false });
  if (isObject(value)) {
    var result = isArray(value) ? [] : create(null);

    var keys$$1 = keys(value);
    var i = keys$$1.length;
    while (i--) {
      var child = this$1.childByKey[keys$$1[i]];
      if (!child) { result[keys$$1[i]] = value[keys$$1[i]]; }
      else if (child._link) { result[keys$$1[i]] = child._link.getVirtual(); }
      else { result[keys$$1[i]] = child.getVirtual(); }
    }

    i = this.children.length;
    while (i--) {
      var child$1 = this$1.children[i];
      if (!(child$1.key in result) && child$1._link) {
        result[child$1.key] = child$1._link.getVirtual();
      }
    }

    if (this.computed) {
      keys$$1 = keys(this.computed);
      i = keys$$1.length;
      while (i--) {
        result[keys$$1[i]] = this$1.computed[keys$$1[i]].get();
      }
    }

    return result;
  } else { return value; }
};

ModelBase__proto__.has = function has (key) {
    var this$1 = this;

  if (this._link) { return this._link.has(key); }

  var value = this.get(false, noVirtual);
  if (!value) { return false; }

  key = unescapeKey(key);
  if ((isFunction(value) || isObject(value)) && key in value) { return true; }

  var computed = this.computed;
  if (computed && key in this.computed) { return true; }

  computed = this.root.ractive && this.root.ractive.computed;
  if (computed) {
    keys(computed).forEach(function (k) {
      if (computed[k].pattern && computed[k].pattern.test(this$1.getKeypath())) { return true; }
    });
  }

  return false;
};

ModelBase__proto__.joinAll = function joinAll (keys$$1, opts) {
  var model = this;
  for (var i = 0; i < keys$$1.length; i += 1) {
    if (
      opts &&
      opts.lastLink === false &&
      i + 1 === keys$$1.length &&
      model.childByKey[keys$$1[i]] &&
      model.childByKey[keys$$1[i]]._link
    )
      { return model.childByKey[keys$$1[i]]; }
    model = model.joinKey(keys$$1[i], opts);
  }

  return model;
};

ModelBase__proto__.notifyUpstream = function notifyUpstream (startPath) {
    var this$1 = this;

  var parent = this.parent;
  var path = startPath || [this.key];
  while (parent) {
    if (parent.patterns) { parent.patterns.forEach(function (o) { return o.notify(path.slice()); }); }
    path.unshift(parent.key);
    parent.links.forEach(function (l) { return l.notifiedUpstream(path, this$1.root); });
    parent.deps.forEach(function (d) { return d.handleChange(path); });
    parent.downstreamChanged(startPath);
    parent = parent.parent;
  }
};

ModelBase__proto__.rebind = function rebind (next, previous, safe) {
    var this$1 = this;

  if (this._link) {
    this._link.rebind(next, previous, false);
  }

  // tell the deps to move to the new target
  var i = this.deps.length;
  while (i--) {
    if (this$1.deps[i].rebind) { this$1.deps[i].rebind(next, previous, safe); }
  }

  i = this.links.length;
  while (i--) {
    var link = this$1.links[i];
    // only relink the root of the link tree
    if (link.owner && link.owner._link) { link.relinking(next, safe); }
  }

  i = this.children.length;
  while (i--) {
    var child = this$1.children[i];
    child.rebind(next ? next.joinKey(child.key) : undefined, child._link || child, safe);
    if (this$1.dataModel) {
      this$1.addShuffleTask(function () { return checkDataLink(this$1, this$1.retrieve()); }, 'early');
    }
  }

  i = this.bindings.length;
  while (i--) {
    this$1.bindings[i].rebind(next, previous, safe);
  }
};

ModelBase__proto__.reference = function reference () {
  'refs' in this ? this.refs++ : (this.refs = 1);
};

ModelBase__proto__.register = function register (dep) {
  this.deps.push(dep);
};

ModelBase__proto__.registerLink = function registerLink (link) {
  addToArray(this.links, link);
};

ModelBase__proto__.registerPatternObserver = function registerPatternObserver (observer) {
  (this.patterns || (this.patterns = [])).push(observer);
  this.register(observer);
};

ModelBase__proto__.registerTwowayBinding = function registerTwowayBinding (binding) {
  this.bindings.push(binding);
};

ModelBase__proto__.unreference = function unreference () {
  if ('refs' in this) { this.refs--; }
};

ModelBase__proto__.unregister = function unregister (dep) {
  removeFromArray(this.deps, dep);
};

ModelBase__proto__.unregisterLink = function unregisterLink (link) {
  removeFromArray(this.links, link);
};

ModelBase__proto__.unregisterPatternObserver = function unregisterPatternObserver (observer) {
  removeFromArray(this.patterns, observer);
  this.unregister(observer);
};

ModelBase__proto__.unregisterTwowayBinding = function unregisterTwowayBinding (binding) {
  removeFromArray(this.bindings, binding);
};

ModelBase__proto__.updateFromBindings = function updateFromBindings$1 (cascade) {
    var this$1 = this;

  var i = this.bindings.length;
  while (i--) {
    var value = this$1.bindings[i].getValue();
    if (value !== this$1.value) { this$1.set(value); }
  }

  // check for one-way bindings if there are no two-ways
  if (!this.bindings.length) {
    var oneway = findBoundValue(this.deps);
    if (oneway && oneway.value !== this.value) { this.set(oneway.value); }
  }

  if (cascade) {
    this.children.forEach(updateFromBindings);
    this.links.forEach(updateFromBindings);
    if (this._link) { this._link.updateFromBindings(cascade); }
  }
};

// TODO: this may be better handled by overriding `get` on models with a parent that isRoot
function maybeBind(model, value, shouldBind) {
  if (shouldBind && isFunction(value) && model.parent && model.parent.isRoot) {
    if (!model.boundValue) {
      model.boundValue = bind(value._r_unbound || value, model.parent.ractive);
    }

    return model.boundValue;
  }

  return value;
}

function updateFromBindings(model) {
  model.updateFromBindings(true);
}

function findBoundValue(list) {
  var i = list.length;
  while (i--) {
    if (list[i].bound) {
      var owner = list[i].owner;
      if (owner) {
        var value = owner.name === 'checked' ? owner.node.checked : owner.node.value;
        return { value: value };
      }
    }
  }
}

function fireShuffleTasks(stage) {
  if (!stage) {
    fireShuffleTasks('early');
    fireShuffleTasks('mark');
  } else {
    var tasks = shuffleTasks[stage];
    shuffleTasks[stage] = [];
    var i = tasks.length;
    while (i--) { tasks[i](); }

    var register = registerQueue[stage];
    registerQueue[stage] = [];
    i = register.length;
    while (i--) { register[i].model.register(register[i].item); }
  }
}

function shuffle(model, newIndices, link, unsafe) {
  model.shuffling = true;

  var i = newIndices.length;
  while (i--) {
    var idx = newIndices[i];
    // nothing is actually changing, so move in the index and roll on
    if (i === idx) {
      continue;
    }

    // rebind the children on i to idx
    if (i in model.childByKey)
      { model.childByKey[i].rebind(
        !~idx ? undefined : model.joinKey(idx),
        model.childByKey[i],
        !unsafe
      ); }
  }

  var upstream = model.source().length !== model.source().value.length;

  model.links.forEach(function (l) { return l.shuffle(newIndices); });
  if (!link) { fireShuffleTasks('early'); }

  i = model.deps.length;
  while (i--) {
    if (model.deps[i].shuffle) { model.deps[i].shuffle(newIndices); }
  }

  model[link ? 'marked' : 'mark']();
  if (!link) { fireShuffleTasks('mark'); }

  if (upstream) { model.notifyUpstream(); }

  model.shuffling = false;
}

function checkDataLink(model, value) {
  if (value !== model.dataModel) {
    if (value && value.viewmodel && value.viewmodel.isRoot && model.childByKey.data) {
      model.childByKey.data.link(value.viewmodel, 'data');
      model.dataModel = value;
    } else if (model.dataModel) {
      model.childByKey.data.unlink();
      model.dataModel = true;
    }
  }
}

var stack = [];
var captureGroup;

function startCapturing() {
  stack.push((captureGroup = []));
}

function stopCapturing() {
  var dependencies = stack.pop();
  captureGroup = stack[stack.length - 1];
  return dependencies;
}

function capture(model) {
  if (captureGroup) {
    captureGroup.push(model);
  }
}

function bind$1(x) {
  x.bind();
}
function cancel(x) {
  x.cancel();
}
function destroyed(x) {
  x.destroyed();
}
function handleChange(x) {
  x.handleChange();
}
function mark(x) {
  x.mark();
}
function markForce(x) {
  x.mark(true);
}
function marked(x) {
  x.marked();
}
function markedAll(x) {
  x.markedAll();
}
function render(x) {
  x.render();
}
function shuffled(x) {
  x.shuffled();
}
function teardown(x) {
  x.teardown();
}
function unbind(x) {
  x.unbind();
}
function unrender(x) {
  x.unrender();
}

function update(x) {
  x.update();
}
function toString$1(x) {
  return x.toString();
}
function toEscapedString(x) {
  return x.toString(true);
}

// this is the dry method of checking to see if a rebind applies to
// a particular keypath because in some cases, a dep may be bound
// directly to a particular keypath e.g. foo.bars.0.baz and need
// to avoid getting kicked to foo.bars.1.baz if foo.bars is unshifted
function rebindMatch(template, next, previous, fragment) {
  var keypath = template.r || template;

  // no valid keypath, go with next
  if (!keypath || !isString(keypath)) { return next; }

  // completely contextual ref, go with next
  if (
    keypath === '.' ||
    keypath[0] === '@' ||
    (next || previous).isKey ||
    (next || previous).isKeypath
  )
    { return next; }

  var parts = keypath.split('/');
  var keys = splitKeypath(parts[parts.length - 1]);
  var last = keys[keys.length - 1];

  // check the keypath against the model keypath to see if it matches
  var model = next || previous;

  // check to see if this was an alias
  if (model && keys.length === 1 && last !== model.key && fragment) {
    keys = findAlias(last, fragment) || keys;
  }

  var i = keys.length;
  var match = true;
  var shuffling = false;

  while (model && i--) {
    if (model.shuffling) { shuffling = true; }
    // non-strict comparison to account for indices in keypaths
    if (keys[i] != model.key) { match = false; }
    model = model.parent;
  }

  // next is undefined, but keypath is shuffling and previous matches
  if (!next && match && shuffling) { return previous; }
  else if (next && !match && shuffling)
    // next is defined, but doesn't match the keypath
    { return previous; }
  else { return next; }
}

function findAlias(name, fragment) {
  while (fragment) {
    var z = fragment.aliases;
    if (z && z[name]) {
      var aliases = (fragment.owner.iterations ? fragment.owner : fragment).owner.template.z;
      for (var i = 0; i < aliases.length; i++) {
        if (aliases[i].n === name) {
          var alias = aliases[i].x;
          if (!alias.r) { return false; }
          var parts = alias.r.split('/');
          return splitKeypath(parts[parts.length - 1]);
        }
      }
      return;
    }

    fragment = fragment.componentParent || fragment.parent;
  }
}

// temporary placeholder target for detached implicit links
var Missing = {
  key: '@missing',
  animate: noop,
  applyValue: noop,
  get: noop,
  getKeypath: function getKeypath() {
    return this.key;
  },
  joinAll: function joinAll() {
    return this;
  },
  joinKey: function joinKey() {
    return this;
  },
  mark: noop,
  registerLink: noop,
  shufle: noop,
  set: noop,
  unregisterLink: noop
};
Missing.parent = Missing;

var LinkModel = (function (ModelBase) {
  function LinkModel(parent, owner, target, key) {
    ModelBase.call(this, parent);

    this.owner = owner;
    this.target = target;
    this.key = isUndefined(key) ? owner.key : key;
    if (owner && owner.isLink) { this.sourcePath = (owner.sourcePath) + "." + (this.key); }

    if (target) { target.registerLink(this); }

    if (parent) { this.isReadonly = parent.isReadonly; }

    this.isLink = true;
  }

  if ( ModelBase ) LinkModel.__proto__ = ModelBase;
  var LinkModel__proto__ = LinkModel.prototype = Object.create( ModelBase && ModelBase.prototype );
  LinkModel__proto__.constructor = LinkModel;

  LinkModel__proto__.animate = function animate (from, to, options, interpolator) {
    return this.target.animate(from, to, options, interpolator);
  };

  LinkModel__proto__.applyValue = function applyValue (value) {
    if (this.boundValue) { this.boundValue = null; }
    this.target.applyValue(value);
  };

  LinkModel__proto__.attach = function attach (fragment) {
    var model = resolveReference(fragment, this.key);
    if (model) {
      this.relinking(model, false);
    } else {
      // if there is no link available, move everything here to real models
      this.owner.unlink();
    }
  };

  LinkModel__proto__.detach = function detach () {
    this.relinking(Missing, false);
  };

  LinkModel__proto__.get = function get (shouldCapture, opts) {
    if ( opts === void 0 ) opts = {};

    if (shouldCapture) {
      capture(this);

      // may need to tell the target to unwrap
      opts.unwrap = 'unwrap' in opts ? opts.unwrap : true;
    }

    var bind = 'shouldBind' in opts ? opts.shouldBind : true;
    opts.shouldBind = this.mapping && this.target.parent && this.target.parent.isRoot;

    return maybeBind(this, this.target.get(false, opts), bind);
  };

  LinkModel__proto__.getKeypath = function getKeypath (ractive) {
    if (ractive && ractive !== this.root.ractive) { return this.target.getKeypath(ractive); }

    return ModelBase.prototype.getKeypath.call(this, ractive);
  };

  LinkModel__proto__.handleChange = function handleChange$1 () {
    this.deps.forEach(handleChange);
    this.links.forEach(handleChange);
    this.notifyUpstream();
  };

  LinkModel__proto__.isDetached = function isDetached () {
    return this.virtual && this.target === Missing;
  };

  LinkModel__proto__.joinKey = function joinKey (key) {
    // TODO: handle nested links
    if (isUndefined(key) || key === '') { return this; }

    if (!hasOwn(this.childByKey, key)) {
      var child = new LinkModel(this, this, this.target.joinKey(key), key);
      this.children.push(child);
      this.childByKey[key] = child;
    }

    return this.childByKey[key];
  };

  LinkModel__proto__.mark = function mark (force) {
    this.target.mark(force);
  };

  LinkModel__proto__.marked = function marked$1 () {
    if (this.boundValue) { this.boundValue = null; }

    this.links.forEach(marked);

    this.deps.forEach(handleChange);
  };

  LinkModel__proto__.markedAll = function markedAll$1 () {
    this.children.forEach(markedAll);
    this.marked();
  };

  LinkModel__proto__.notifiedUpstream = function notifiedUpstream (startPath, root) {
    var this$1 = this;

    this.links.forEach(function (l) { return l.notifiedUpstream(startPath, this$1.root); });
    this.deps.forEach(handleChange);
    if (startPath && this.rootLink && this.root !== root) {
      var path = startPath.slice(1);
      path.unshift(this.key);
      this.notifyUpstream(path);
    }
  };

  LinkModel__proto__.relinked = function relinked () {
    this.target.registerLink(this);
    this.children.forEach(function (c) { return c.relinked(); });
  };

  LinkModel__proto__.relinking = function relinking (target, safe) {
    var this$1 = this;

    if (this.rootLink && this.sourcePath)
      { target = rebindMatch(this.sourcePath, target, this.target); }
    if (!target || this.target === target) { return; }

    this.target && this.target.unregisterLink(this);

    this.target = target;
    this.children.forEach(function (c) {
      c.relinking(target.joinKey(c.key), safe);
    });

    if (this.rootLink)
      { this.addShuffleTask(function () {
        this$1.relinked();
        if (!safe) {
          this$1.markedAll();
          this$1.notifyUpstream();
        }
      }); }
  };

  LinkModel__proto__.set = function set (value) {
    if (this.boundValue) { this.boundValue = null; }
    this.target.set(value);
  };

  LinkModel__proto__.shuffle = function shuffle$1 (newIndices) {
    // watch for extra shuffles caused by a shuffle in a downstream link
    if (this.shuffling) { return; }

    // let the real model handle firing off shuffles
    if (!this.target.shuffling) {
      if (this.target.shuffle) {
        this.target.shuffle(newIndices);
      } else {
        // the target is a computation, which can't shuffle
        this.target.mark();
      }
    } else {
      shuffle(this, newIndices, true);
    }
  };

  LinkModel__proto__.source = function source () {
    if (this.target.source) { return this.target.source(); }
    else { return this.target; }
  };

  LinkModel__proto__.teardown = function teardown$3 () {
    if (this._link) { this._link.teardown(); }
    this.target.unregisterLink(this);
    this.children.forEach(teardown);
  };

  return LinkModel;
}(ModelBase));

ModelBase.prototype.link = function link(model, keypath, options) {
  var lnk = this._link || new LinkModel(this.parent, this, model, this.key);
  lnk.implicit = options && options.implicit;
  lnk.mapping = options && options.mapping;
  lnk.sourcePath = keypath;
  lnk.rootLink = true;
  if (this._link) { this._link.relinking(model, false); }
  this.rebind(lnk, this, false);
  fireShuffleTasks();

  this._link = lnk;
  lnk.markedAll();

  this.notifyUpstream();
  return lnk;
};

ModelBase.prototype.unlink = function unlink() {
  if (this._link) {
    var ln = this._link;
    this._link = undefined;
    ln.rebind(this, ln, false);
    fireShuffleTasks();
    ln.teardown();
    this.notifyUpstream();
  }
};

function fromExpression(body, length) {
  if ( length === void 0 ) length = 0;

  var args = new Array(length);

  while (length--) {
    args[length] = "_" + length;
  }

  // Functions created directly with new Function() look like this:
  //     function anonymous (_0 /**/) { return _0*2 }
  //
  // With this workaround, we get a little more compact:
  //     function (_0){return _0*2}
  return new Function([], ("return function (" + (args.join(',')) + "){return(" + body + ");};"))();
}

var functions = create(null);

function getFunction(str, i) {
  if (functions[str]) { return functions[str]; }
  return (functions[str] = createFunction(str, i));
}

function addFunctions(template) {
  if (!template) { return; }

  var exp = template.e;

  if (!exp) { return; }

  keys(exp).forEach(function (str) {
    if (functions[str]) { return; }
    functions[str] = exp[str];
  });
}

var TEMPLATE_VERSION = 4;

var leadingWhitespace = /^\s+/;

var ParseError = function(message) {
  this.name = 'ParseError';
  this.message = message;
  try {
    throw new Error(message);
  } catch (e) {
    this.stack = e.stack;
  }
};

ParseError.prototype = Error.prototype;

var Parser = function(str, options) {
  var item;
  var lineStart = 0;

  this.str = str;
  this.options = options || {};
  this.pos = 0;

  this.lines = this.str.split('\n');
  this.lineEnds = this.lines.map(function (line) {
    var lineEnd = lineStart + line.length + 1; // +1 for the newline

    lineStart = lineEnd;
    return lineEnd;
  }, 0);

  // Custom init logic
  if (this.init) { this.init(str, options); }

  var items = [];

  while (this.pos < this.str.length && (item = this.read())) {
    items.push(item);
  }

  this.leftover = this.remaining();
  this.result = this.postProcess ? this.postProcess(items, options) : items;
};

Parser.prototype = {
  read: function read(converters) {
    var this$1 = this;

    var i, item;

    if (!converters) { converters = this.converters; }

    var pos = this.pos;

    var len = converters.length;
    for (i = 0; i < len; i += 1) {
      this$1.pos = pos; // reset for each attempt

      if ((item = converters[i](this$1))) {
        return item;
      }
    }

    return null;
  },

  getContextMessage: function getContextMessage(pos, message) {
    var ref = this.getLinePos(pos);
    var lineNum = ref[0];
    var columnNum = ref[1];
    if (this.options.contextLines === -1) {
      return [lineNum, columnNum, (message + " at line " + lineNum + " character " + columnNum)];
    }

    var line = this.lines[lineNum - 1];

    var contextUp = '';
    var contextDown = '';
    if (this.options.contextLines) {
      var start =
        lineNum - 1 - this.options.contextLines < 0 ? 0 : lineNum - 1 - this.options.contextLines;
      contextUp = this.lines
        .slice(start, lineNum - 1 - start)
        .join('\n')
        .replace(/\t/g, '  ');
      contextDown = this.lines
        .slice(lineNum, lineNum + this.options.contextLines)
        .join('\n')
        .replace(/\t/g, '  ');
      if (contextUp) {
        contextUp += '\n';
      }
      if (contextDown) {
        contextDown = '\n' + contextDown;
      }
    }

    var numTabs = 0;
    var annotation =
      contextUp +
      line.replace(/\t/g, function (match, char) {
        if (char < columnNum) {
          numTabs += 1;
        }

        return '  ';
      }) +
      '\n' +
      new Array(columnNum + numTabs).join(' ') +
      '^----' +
      contextDown;

    return [
      lineNum,
      columnNum,
      (message + " at line " + lineNum + " character " + columnNum + ":\n" + annotation)
    ];
  },

  getLinePos: function getLinePos(char) {
    var this$1 = this;

    var lineNum = 0;
    var lineStart = 0;

    while (char >= this.lineEnds[lineNum]) {
      lineStart = this$1.lineEnds[lineNum];
      lineNum += 1;
    }

    var columnNum = char - lineStart;
    return [lineNum + 1, columnNum + 1, char]; // line/col should be one-based, not zero-based!
  },

  error: function error(message) {
    var ref = this.getContextMessage(this.pos, message);
    var lineNum = ref[0];
    var columnNum = ref[1];
    var msg = ref[2];

    var error = new ParseError(msg);

    error.line = lineNum;
    error.character = columnNum;
    error.shortMessage = message;

    throw error;
  },

  matchString: function matchString(string) {
    if (this.str.substr(this.pos, string.length) === string) {
      this.pos += string.length;
      return string;
    }
  },

  matchPattern: function matchPattern(pattern) {
    var match;

    if ((match = pattern.exec(this.remaining()))) {
      this.pos += match[0].length;
      return match[1] || match[0];
    }
  },

  sp: function sp() {
    this.matchPattern(leadingWhitespace);
  },

  remaining: function remaining() {
    return this.str.substring(this.pos);
  },

  nextChar: function nextChar() {
    return this.str.charAt(this.pos);
  },

  warn: function warn(message) {
    var msg = this.getContextMessage(this.pos, message)[2];

    warnIfDebug(msg);
  }
};

Parser.extend = function(proto) {
  var Parent = this;
  var Child = function(str, options) {
    Parser.call(this, str, options);
  };

  Child.prototype = create(Parent.prototype);

  for (var key in proto) {
    if (hasOwn(proto, key)) {
      Child.prototype[key] = proto[key];
    }
  }

  Child.extend = Parser.extend;
  return Child;
};

var TEXT = 1;
var INTERPOLATOR = 2;
var TRIPLE = 3;
var SECTION = 4;
var INVERTED = 5;
var CLOSING = 6;
var ELEMENT = 7;
var PARTIAL = 8;
var COMMENT = 9;
var DELIMCHANGE = 10;
var ANCHOR = 11;
var ATTRIBUTE = 13;
var CLOSING_TAG = 14;
var COMPONENT = 15;
var YIELDER = 16;
var INLINE_PARTIAL = 17;
var DOCTYPE = 18;
var ALIAS = 19;

var AWAIT = 55;

var NUMBER_LITERAL = 20;
var STRING_LITERAL = 21;
var ARRAY_LITERAL = 22;
var OBJECT_LITERAL = 23;
var BOOLEAN_LITERAL = 24;
var REGEXP_LITERAL = 25;

var GLOBAL = 26;
var KEY_VALUE_PAIR = 27;

var REFERENCE = 30;
var REFINEMENT = 31;
var MEMBER = 32;
var PREFIX_OPERATOR = 33;
var BRACKETED = 34;
var CONDITIONAL = 35;
var INFIX_OPERATOR = 36;

var INVOCATION = 40;

var SECTION_IF = 50;
var SECTION_UNLESS = 51;
var SECTION_EACH = 52;
var SECTION_WITH = 53;
var SECTION_IF_WITH = 54;

var ELSE = 60;
var ELSEIF = 61;
var THEN = 62;
var CATCH = 63;

var EVENT = 70;
var DECORATOR = 71;
var TRANSITION = 72;
var BINDING_FLAG = 73;
var DELEGATE_FLAG = 74;

var delimiterChangePattern = /^[^\s=]+/;
var whitespacePattern = /^\s+/;

function readDelimiterChange(parser) {
  if (!parser.matchString('=')) {
    return null;
  }

  var start = parser.pos;

  // allow whitespace before new opening delimiter
  parser.sp();

  var opening = parser.matchPattern(delimiterChangePattern);
  if (!opening) {
    parser.pos = start;
    return null;
  }

  // allow whitespace (in fact, it's necessary...)
  if (!parser.matchPattern(whitespacePattern)) {
    return null;
  }

  var closing = parser.matchPattern(delimiterChangePattern);
  if (!closing) {
    parser.pos = start;
    return null;
  }

  // allow whitespace before closing '='
  parser.sp();

  if (!parser.matchString('=')) {
    parser.pos = start;
    return null;
  }

  return [opening, closing];
}

var regexpPattern = /^(\/(?:[^\n\r\u2028\u2029/\\[]|\\.|\[(?:[^\n\r\u2028\u2029\]\\]|\\.)*])+\/(?:([gimuy])(?![a-z]*\2))*(?![a-zA-Z_$0-9]))/;

function readNumberLiteral(parser) {
  var result;

  if ((result = parser.matchPattern(regexpPattern))) {
    return {
      t: REGEXP_LITERAL,
      v: result
    };
  }

  return null;
}

var pattern = /[-/\\^$*+?.()|[\]{}]/g;

function escapeRegExp(str) {
  return str.replace(pattern, '\\$&');
}

var regExpCache = {};

function getLowestIndex(haystack, needles) {
  return haystack.search(
    regExpCache[needles.join()] ||
      (regExpCache[needles.join()] = new RegExp(needles.map(escapeRegExp).join('|')))
  );
}

// https://github.com/kangax/html-minifier/issues/63#issuecomment-37763316
//export const booleanAttributes = /^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible)$/i;
var booleanAttributes = {
  allowfullscreen: 1,
  async: 1,
  autofocus: 1,
  autoplay: 1,
  checked: 1,
  compact: 1,
  controls: 1,
  declare: 1,
  default: 1,
  defaultchecked: 1,
  defaultmuted: 1,
  defaultselected: 1,
  defer: 1,
  disabled: 1,
  enabled: 1,
  formnovalidate: 1,
  hidden: 1,
  indeterminate: 1,
  inert: 1,
  ismap: 1,
  itemscope: 1,
  loop: 1,
  multiple: 1,
  muted: 1,
  nohref: 1,
  noresize: 1,
  noshade: 1,
  novalidate: 1,
  nowrap: 1,
  open: 1,
  pauseonexit: 1,
  readonly: 1,
  required: 1,
  reversed: 1,
  scoped: 1,
  seamless: 1,
  selected: 1,
  sortable: 1,
  translate: 1,
  truespeed: 1,
  typemustmatch: 1,
  visible: 1
};
var voidElements = {
  area: 1,
  base: 1,
  br: 1,
  col: 1,
  command: 1,
  doctype: 1,
  embed: 1,
  hr: 1,
  img: 1,
  input: 1,
  keygen: 1,
  link: 1,
  meta: 1,
  param: 1,
  source: 1,
  track: 1,
  wbr: 1
};

var htmlEntities = {
  quot: 34,
  amp: 38,
  apos: 39,
  lt: 60,
  gt: 62,
  nbsp: 160,
  iexcl: 161,
  cent: 162,
  pound: 163,
  curren: 164,
  yen: 165,
  brvbar: 166,
  sect: 167,
  uml: 168,
  copy: 169,
  ordf: 170,
  laquo: 171,
  not: 172,
  shy: 173,
  reg: 174,
  macr: 175,
  deg: 176,
  plusmn: 177,
  sup2: 178,
  sup3: 179,
  acute: 180,
  micro: 181,
  para: 182,
  middot: 183,
  cedil: 184,
  sup1: 185,
  ordm: 186,
  raquo: 187,
  frac14: 188,
  frac12: 189,
  frac34: 190,
  iquest: 191,
  Agrave: 192,
  Aacute: 193,
  Acirc: 194,
  Atilde: 195,
  Auml: 196,
  Aring: 197,
  AElig: 198,
  Ccedil: 199,
  Egrave: 200,
  Eacute: 201,
  Ecirc: 202,
  Euml: 203,
  Igrave: 204,
  Iacute: 205,
  Icirc: 206,
  Iuml: 207,
  ETH: 208,
  Ntilde: 209,
  Ograve: 210,
  Oacute: 211,
  Ocirc: 212,
  Otilde: 213,
  Ouml: 214,
  times: 215,
  Oslash: 216,
  Ugrave: 217,
  Uacute: 218,
  Ucirc: 219,
  Uuml: 220,
  Yacute: 221,
  THORN: 222,
  szlig: 223,
  agrave: 224,
  aacute: 225,
  acirc: 226,
  atilde: 227,
  auml: 228,
  aring: 229,
  aelig: 230,
  ccedil: 231,
  egrave: 232,
  eacute: 233,
  ecirc: 234,
  euml: 235,
  igrave: 236,
  iacute: 237,
  icirc: 238,
  iuml: 239,
  eth: 240,
  ntilde: 241,
  ograve: 242,
  oacute: 243,
  ocirc: 244,
  otilde: 245,
  ouml: 246,
  divide: 247,
  oslash: 248,
  ugrave: 249,
  uacute: 250,
  ucirc: 251,
  uuml: 252,
  yacute: 253,
  thorn: 254,
  yuml: 255,
  OElig: 338,
  oelig: 339,
  Scaron: 352,
  scaron: 353,
  Yuml: 376,
  fnof: 402,
  circ: 710,
  tilde: 732,
  Alpha: 913,
  Beta: 914,
  Gamma: 915,
  Delta: 916,
  Epsilon: 917,
  Zeta: 918,
  Eta: 919,
  Theta: 920,
  Iota: 921,
  Kappa: 922,
  Lambda: 923,
  Mu: 924,
  Nu: 925,
  Xi: 926,
  Omicron: 927,
  Pi: 928,
  Rho: 929,
  Sigma: 931,
  Tau: 932,
  Upsilon: 933,
  Phi: 934,
  Chi: 935,
  Psi: 936,
  Omega: 937,
  alpha: 945,
  beta: 946,
  gamma: 947,
  delta: 948,
  epsilon: 949,
  zeta: 950,
  eta: 951,
  theta: 952,
  iota: 953,
  kappa: 954,
  lambda: 955,
  mu: 956,
  nu: 957,
  xi: 958,
  omicron: 959,
  pi: 960,
  rho: 961,
  sigmaf: 962,
  sigma: 963,
  tau: 964,
  upsilon: 965,
  phi: 966,
  chi: 967,
  psi: 968,
  omega: 969,
  thetasym: 977,
  upsih: 978,
  piv: 982,
  ensp: 8194,
  emsp: 8195,
  thinsp: 8201,
  zwnj: 8204,
  zwj: 8205,
  lrm: 8206,
  rlm: 8207,
  ndash: 8211,
  mdash: 8212,
  lsquo: 8216,
  rsquo: 8217,
  sbquo: 8218,
  ldquo: 8220,
  rdquo: 8221,
  bdquo: 8222,
  dagger: 8224,
  Dagger: 8225,
  bull: 8226,
  hellip: 8230,
  permil: 8240,
  prime: 8242,
  Prime: 8243,
  lsaquo: 8249,
  rsaquo: 8250,
  oline: 8254,
  frasl: 8260,
  euro: 8364,
  image: 8465,
  weierp: 8472,
  real: 8476,
  trade: 8482,
  alefsym: 8501,
  larr: 8592,
  uarr: 8593,
  rarr: 8594,
  darr: 8595,
  harr: 8596,
  crarr: 8629,
  lArr: 8656,
  uArr: 8657,
  rArr: 8658,
  dArr: 8659,
  hArr: 8660,
  forall: 8704,
  part: 8706,
  exist: 8707,
  empty: 8709,
  nabla: 8711,
  isin: 8712,
  notin: 8713,
  ni: 8715,
  prod: 8719,
  sum: 8721,
  minus: 8722,
  lowast: 8727,
  radic: 8730,
  prop: 8733,
  infin: 8734,
  ang: 8736,
  and: 8743,
  or: 8744,
  cap: 8745,
  cup: 8746,
  int: 8747,
  there4: 8756,
  sim: 8764,
  cong: 8773,
  asymp: 8776,
  ne: 8800,
  equiv: 8801,
  le: 8804,
  ge: 8805,
  sub: 8834,
  sup: 8835,
  nsub: 8836,
  sube: 8838,
  supe: 8839,
  oplus: 8853,
  otimes: 8855,
  perp: 8869,
  sdot: 8901,
  lceil: 8968,
  rceil: 8969,
  lfloor: 8970,
  rfloor: 8971,
  lang: 9001,
  rang: 9002,
  loz: 9674,
  spades: 9824,
  clubs: 9827,
  hearts: 9829,
  diams: 9830
};
var controlCharacters = [
  8364,
  129,
  8218,
  402,
  8222,
  8230,
  8224,
  8225,
  710,
  8240,
  352,
  8249,
  338,
  141,
  381,
  143,
  144,
  8216,
  8217,
  8220,
  8221,
  8226,
  8211,
  8212,
  732,
  8482,
  353,
  8250,
  339,
  157,
  382,
  376
];
var entityPattern = new RegExp(
  '&(#?(?:x[\\w\\d]+|\\d+|' + keys(htmlEntities).join('|') + '));?',
  'g'
);
var codePointSupport = isFunction(String.fromCodePoint);
var codeToChar = codePointSupport ? String.fromCodePoint : String.fromCharCode;

function decodeCharacterReferences(html) {
  return html.replace(entityPattern, function (match, entity) {
    var code;

    // Handle named entities
    if (entity[0] !== '#') {
      code = htmlEntities[entity];
    } else if (entity[1] === 'x') {
      code = parseInt(entity.substring(2), 16);
    } else {
      code = parseInt(entity.substring(1), 10);
    }

    if (!code) {
      return match;
    }

    return codeToChar(validateCode(code));
  });
}

var lessThan = /</g;
var greaterThan = />/g;
var amp = /&/g;
var invalid = 65533;

function escapeHtml(str) {
  return str
    .replace(amp, '&amp;')
    .replace(lessThan, '&lt;')
    .replace(greaterThan, '&gt;');
}

// some code points are verboten. If we were inserting HTML, the browser would replace the illegal
// code points with alternatives in some cases - since we're bypassing that mechanism, we need
// to replace them ourselves
//
// Source: http://en.wikipedia.org/wiki/Character_encodings_in_HTML#Illegal_characters
/* istanbul ignore next */
function validateCode(code) {
  if (!code) {
    return invalid;
  }

  // line feed becomes generic whitespace
  if (code === 10) {
    return 32;
  }

  // ASCII range. (Why someone would use HTML entities for ASCII characters I don't know, but...)
  if (code < 128) {
    return code;
  }

  // code points 128-159 are dealt with leniently by browsers, but they're incorrect. We need
  // to correct the mistake or we'll end up with missing € signs and so on
  if (code <= 159) {
    return controlCharacters[code - 128];
  }

  // basic multilingual plane
  if (code < 55296) {
    return code;
  }

  // UTF-16 surrogate halves
  if (code <= 57343) {
    return invalid;
  }

  // rest of the basic multilingual plane
  if (code <= 65535) {
    return code;
  } else if (!codePointSupport) {
    return invalid;
  }

  // supplementary multilingual plane 0x10000 - 0x1ffff
  if (code >= 65536 && code <= 131071) {
    return code;
  }

  // supplementary ideographic plane 0x20000 - 0x2ffff
  if (code >= 131072 && code <= 196607) {
    return code;
  }

  return invalid;
}

var expectedExpression = 'Expected a JavaScript expression';
var expectedParen = 'Expected closing paren';

// bulletproof number regex from https://gist.github.com/Rich-Harris/7544330
var numberPattern = /^(?:[+-]?)0*(?:(?:(?:[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;

function readNumberLiteral$1(parser) {
  var result;

  if ((result = parser.matchPattern(numberPattern))) {
    return {
      t: NUMBER_LITERAL,
      v: result
    };
  }

  return null;
}

function readBooleanLiteral(parser) {
  var remaining = parser.remaining();

  if (remaining.substr(0, 4) === 'true') {
    parser.pos += 4;
    return {
      t: BOOLEAN_LITERAL,
      v: 'true'
    };
  }

  if (remaining.substr(0, 5) === 'false') {
    parser.pos += 5;
    return {
      t: BOOLEAN_LITERAL,
      v: 'false'
    };
  }

  return null;
}

// Match one or more characters until: ", ', \, or EOL/EOF.
// EOL/EOF is written as (?!.) (meaning there's no non-newline char next).
var stringMiddlePattern = /^(?=.)[^"'\\]+?(?:(?!.)|(?=["'\\]))/;

// Match one escape sequence, including the backslash.
var escapeSequencePattern = /^\\(?:[`'"\\bfnrt]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/;

// Match one ES5 line continuation (backslash + line terminator).
var lineContinuationPattern = /^\\(?:\r\n|[\u000A\u000D\u2028\u2029])/;

// Helper for defining getDoubleQuotedString and getSingleQuotedString.
function makeQuotedStringMatcher(okQuote) {
  return function(parser) {
    var literal = '"';
    var done = false;
    var next;

    while (!done) {
      next =
        parser.matchPattern(stringMiddlePattern) ||
        parser.matchPattern(escapeSequencePattern) ||
        parser.matchString(okQuote);
      if (next) {
        if (next === "\"") {
          literal += "\\\"";
        } else if (next === "\\'") {
          literal += "'";
        } else {
          literal += next;
        }
      } else {
        next = parser.matchPattern(lineContinuationPattern);
        if (next) {
          // convert \(newline-like) into a \u escape, which is allowed in JSON
          literal += '\\u' + ('000' + next.charCodeAt(1).toString(16)).slice(-4);
        } else {
          done = true;
        }
      }
    }

    literal += '"';

    // use JSON.parse to interpret escapes
    return JSON.parse(literal);
  };
}

var singleMatcher = makeQuotedStringMatcher("\"");
var doubleMatcher = makeQuotedStringMatcher("'");

function readStringLiteral(parser) {
  var start = parser.pos;
  var quote = parser.matchString("'") || parser.matchString("\"");

  if (quote) {
    var string = (quote === "'" ? singleMatcher : doubleMatcher)(parser);

    if (!parser.matchString(quote)) {
      parser.pos = start;
      return null;
    }

    return {
      t: STRING_LITERAL,
      v: string
    };
  }

  return null;
}

// Match one or more characters until: ", ', or \
var stringMiddlePattern$1 = /^[^`"\\\$]+?(?:(?=[`"\\\$]))/;

var escapes = /[\r\n\t\b\f]/g;
function getString(literal) {
  return JSON.parse(("\"" + (literal.replace(escapes, escapeChar)) + "\""));
}

function escapeChar(c) {
  switch (c) {
    case '\n':
      return '\\n';
    case '\r':
      return '\\r';
    case '\t':
      return '\\t';
    case '\b':
      return '\\b';
    case '\f':
      return '\\f';
  }
}

function readTemplateStringLiteral(parser) {
  if (!parser.matchString('`')) { return null; }

  var literal = '';
  var done = false;
  var next;
  var parts = [];

  while (!done) {
    next =
      parser.matchPattern(stringMiddlePattern$1) ||
      parser.matchPattern(escapeSequencePattern) ||
      parser.matchString('$') ||
      parser.matchString('"');
    if (next) {
      if (next === "\"") {
        literal += "\\\"";
      } else if (next === '\\`') {
        literal += '`';
      } else if (next === '$') {
        if (parser.matchString('{')) {
          parts.push({ t: STRING_LITERAL, v: getString(literal) });
          literal = '';

          parser.sp();
          var expr = readExpression(parser);

          if (!expr) { parser.error('Expected valid expression'); }

          parts.push({ t: BRACKETED, x: expr });

          parser.sp();
          if (!parser.matchString('}'))
            { parser.error("Expected closing '}' after interpolated expression"); }
        } else {
          literal += '$';
        }
      } else {
        literal += next;
      }
    } else {
      next = parser.matchPattern(lineContinuationPattern);
      if (next) {
        // convert \(newline-like) into a \u escape, which is allowed in JSON
        literal += '\\u' + ('000' + next.charCodeAt(1).toString(16)).slice(-4);
      } else {
        done = true;
      }
    }
  }

  if (literal.length) { parts.push({ t: STRING_LITERAL, v: getString(literal) }); }

  if (!parser.matchString('`')) { parser.error("Expected closing '`'"); }

  if (parts.length === 1) {
    return parts[0];
  } else {
    var result = parts.pop();
    var part;

    while ((part = parts.pop())) {
      result = {
        t: INFIX_OPERATOR,
        s: '+',
        o: [part, result]
      };
    }

    return {
      t: BRACKETED,
      x: result
    };
  }
}

var name = /^[a-zA-Z_$][a-zA-Z_$0-9]*/;
var spreadPattern = /^\s*\.{3}/;
var legalReference = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:\.(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
var relaxedName = /^[a-zA-Z_$][-\/a-zA-Z_$0-9]*(?:\.(?:[a-zA-Z_$][-\/a-zA-Z_$0-9]*))*/;

var identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

// http://mathiasbynens.be/notes/javascript-properties
// can be any name, string literal, or number literal
function readKey(parser) {
  var token;

  if ((token = readStringLiteral(parser))) {
    return identifier.test(token.v) ? token.v : '"' + token.v.replace(/"/g, '\\"') + '"';
  }

  if ((token = readNumberLiteral$1(parser))) {
    return token.v;
  }

  if ((token = parser.matchPattern(name))) {
    return token;
  }

  return null;
}

function readKeyValuePair(parser) {
  var spread;
  var start = parser.pos;

  // allow whitespace between '{' and key
  parser.sp();

  var refKey = parser.nextChar() !== "'" && parser.nextChar() !== '"';
  if (refKey) { spread = parser.matchPattern(spreadPattern); }

  var key = spread ? readExpression(parser) : readKey(parser);
  if (key === null) {
    parser.pos = start;
    return null;
  }

  // allow whitespace between key and ':'
  parser.sp();

  // es2015 shorthand property
  if (refKey && (parser.nextChar() === ',' || parser.nextChar() === '}')) {
    if (!spread && !name.test(key)) {
      parser.error(("Expected a valid reference, but found '" + key + "' instead."));
    }

    var pair = {
      t: KEY_VALUE_PAIR,
      k: key,
      v: {
        t: REFERENCE,
        n: key
      }
    };

    if (spread) {
      pair.p = true;
    }

    return pair;
  }

  // next character must be ':'
  if (!parser.matchString(':')) {
    parser.pos = start;
    return null;
  }

  // allow whitespace between ':' and value
  parser.sp();

  // next expression must be a, well... expression
  var value = readExpression(parser);
  if (value === null) {
    parser.pos = start;
    return null;
  }

  return {
    t: KEY_VALUE_PAIR,
    k: key,
    v: value
  };
}

function readKeyValuePairs(parser) {
  var start = parser.pos;

  var pair = readKeyValuePair(parser);
  if (pair === null) {
    return null;
  }

  var pairs = [pair];

  if (parser.matchString(',')) {
    var keyValuePairs = readKeyValuePairs(parser);

    if (!keyValuePairs) {
      parser.pos = start;
      return null;
    }

    return pairs.concat(keyValuePairs);
  }

  return pairs;
}

function readObjectLiteral(parser) {
  var start = parser.pos;

  // allow whitespace
  parser.sp();

  if (!parser.matchString('{')) {
    parser.pos = start;
    return null;
  }

  var keyValuePairs = readKeyValuePairs(parser);

  // allow whitespace between final value and '}'
  parser.sp();

  if (!parser.matchString('}')) {
    parser.pos = start;
    return null;
  }

  return {
    t: OBJECT_LITERAL,
    m: keyValuePairs
  };
}

function readArrayLiteral(parser) {
  var start = parser.pos;

  // allow whitespace before '['
  parser.sp();

  if (!parser.matchString('[')) {
    parser.pos = start;
    return null;
  }

  var expressionList = readExpressionList(parser, true);

  if (!parser.matchString(']')) {
    parser.pos = start;
    return null;
  }

  return {
    t: ARRAY_LITERAL,
    m: expressionList
  };
}

function readLiteral(parser) {
  return (
    readNumberLiteral$1(parser) ||
    readBooleanLiteral(parser) ||
    readStringLiteral(parser) ||
    readTemplateStringLiteral(parser) ||
    readObjectLiteral(parser) ||
    readArrayLiteral(parser) ||
    readNumberLiteral(parser)
  );
}

// if a reference is a browser global, we don't deference it later, so it needs special treatment
var globals = /^(?:Array|console|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null|Object|Number|String|Boolean)\b/;

// keywords are not valid references, with the exception of `this`
var keywords = /^(?:break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with)$/;

var prefixPattern = /^(?:\@\.|\@|~\/|(?:\^\^\/(?:\^\^\/)*(?:\.\.\/)*)|(?:\.\.\/)+|\.\/(?:\.\.\/)*|\.)/;
var specials = /^(key|index|keypath|rootpath|this|global|shared|context|event|node|local|style|helpers|last|macro)/;

function readReference(parser) {
  var prefix, name$$1, global, reference, lastDotIndex;

  var startPos = parser.pos;

  prefix = parser.matchPattern(prefixPattern) || '';
  name$$1 =
    (!prefix && parser.relaxedNames && parser.matchPattern(relaxedName)) ||
    parser.matchPattern(legalReference);
  var actual = prefix.length + ((name$$1 && name$$1.length) || 0);

  if (prefix === '@.') {
    prefix = '@';
    if (name$$1) { name$$1 = 'this.' + name$$1; }
    else { name$$1 = 'this'; }
  }

  if (!name$$1 && prefix) {
    name$$1 = prefix;
    prefix = '';
  }

  if (!name$$1) {
    return null;
  }

  if (prefix === '@') {
    if (!specials.test(name$$1)) {
      parser.error(("Unrecognized special reference @" + name$$1));
    } else if ((!name$$1.indexOf('event') || !name$$1.indexOf('node')) && !parser.inEvent) {
      parser.error("@event and @node are only valid references within an event directive");
    } else if (~name$$1.indexOf('context')) {
      parser.pos = parser.pos - (name$$1.length - 7);
      return {
        t: BRACKETED,
        x: {
          t: REFERENCE,
          n: '@context'
        }
      };
    }
  }

  // bug out if it's a keyword (exception for ancestor/restricted refs - see https://github.com/ractivejs/ractive/issues/1497)
  if (!prefix && !parser.relaxedNames && keywords.test(name$$1)) {
    parser.pos = startPos;
    return null;
  }

  // if this is a browser global, stop here
  if (!prefix && globals.test(name$$1)) {
    global = globals.exec(name$$1)[0];
    parser.pos = startPos + global.length;

    return {
      t: GLOBAL,
      v: global
    };
  }

  reference = (prefix || '') + normalise(name$$1);

  if (parser.matchString('(')) {
    // if this is a method invocation (as opposed to a function) we need
    // to strip the method name from the reference combo, else the context
    // will be wrong
    // but only if the reference was actually a member and not a refinement
    lastDotIndex = reference.lastIndexOf('.');
    if (lastDotIndex !== -1 && name$$1[name$$1.length - 1] !== ']') {
      if (lastDotIndex === 0) {
        reference = '.';
        parser.pos = startPos;
      } else {
        var refLength = reference.length;
        reference = reference.substr(0, lastDotIndex);
        parser.pos = startPos + (actual - (refLength - lastDotIndex));
      }
    } else {
      parser.pos -= 1;
    }
  }

  return {
    t: REFERENCE,
    n: reference.replace(/^this\./, './').replace(/^this$/, '.')
  };
}

function readBracketedExpression(parser) {
  if (!parser.matchString('(')) { return null; }

  parser.sp();

  var expr = readExpression(parser);

  if (!expr) { parser.error(expectedExpression); }

  parser.sp();

  if (!parser.matchString(')')) { parser.error(expectedParen); }

  return {
    t: BRACKETED,
    x: expr
  };
}

function readPrimary(parser) {
  return readLiteral(parser) || readReference(parser) || readBracketedExpression(parser);
}

function readRefinement(parser) {
  // some things call for strict refinement (partial names), meaning no space between reference and refinement
  if (!parser.strictRefinement) {
    parser.sp();
  }

  // "." name
  if (parser.matchString('.')) {
    parser.sp();

    var name$$1 = parser.matchPattern(name);
    if (name$$1) {
      return {
        t: REFINEMENT,
        n: name$$1
      };
    }

    parser.error('Expected a property name');
  }

  // "[" expression "]"
  if (parser.matchString('[')) {
    parser.sp();

    var expr = readExpression(parser);
    if (!expr) { parser.error(expectedExpression); }

    parser.sp();

    if (!parser.matchString(']')) { parser.error("Expected ']'"); }

    return {
      t: REFINEMENT,
      x: expr
    };
  }

  return null;
}

function readMemberOrInvocation(parser) {
  var expression = readPrimary(parser);

  if (!expression) { return null; }

  while (expression) {
    var refinement = readRefinement(parser);
    if (refinement) {
      expression = {
        t: MEMBER,
        x: expression,
        r: refinement
      };
    } else if (parser.matchString('(')) {
      parser.sp();
      var expressionList = readExpressionList(parser, true);

      parser.sp();

      if (!parser.matchString(')')) {
        parser.error(expectedParen);
      }

      expression = {
        t: INVOCATION,
        x: expression
      };

      if (expressionList) { expression.o = expressionList; }
    } else {
      break;
    }
  }

  return expression;
}

var readTypeOf;

var makePrefixSequenceMatcher = function(symbol, fallthrough) {
  return function(parser) {
    var expression;

    if ((expression = fallthrough(parser))) {
      return expression;
    }

    if (!parser.matchString(symbol)) {
      return null;
    }

    parser.sp();

    expression = readExpression(parser);
    if (!expression) {
      parser.error(expectedExpression);
    }

    return {
      s: symbol,
      o: expression,
      t: PREFIX_OPERATOR
    };
  };
};

// create all prefix sequence matchers, return readTypeOf
(function() {
  var i, len, matcher, fallthrough;

  var prefixOperators = '! ~ + - typeof'.split(' ');

  fallthrough = readMemberOrInvocation;
  for (i = 0, len = prefixOperators.length; i < len; i += 1) {
    matcher = makePrefixSequenceMatcher(prefixOperators[i], fallthrough);
    fallthrough = matcher;
  }

  // typeof operator is higher precedence than multiplication, so provides the
  // fallthrough for the multiplication sequence matcher we're about to create
  // (we're skipping void and delete)
  readTypeOf = fallthrough;
})();

var readTypeof = readTypeOf;

var readLogicalOr;

var makeInfixSequenceMatcher = function(symbol, fallthrough) {
  return function(parser) {
    // > and / have to be quoted
    if (parser.inUnquotedAttribute && (symbol === '>' || symbol === '/'))
      { return fallthrough(parser); }

    var start, left, right;

    left = fallthrough(parser);
    if (!left) {
      return null;
    }

    // Loop to handle left-recursion in a case like `a * b * c` and produce
    // left association, i.e. `(a * b) * c`.  The matcher can't call itself
    // to parse `left` because that would be infinite regress.
    while (true) {
      start = parser.pos;

      parser.sp();

      if (!parser.matchString(symbol)) {
        parser.pos = start;
        return left;
      }

      // special case - in operator must not be followed by [a-zA-Z_$0-9]
      if (symbol === 'in' && /[a-zA-Z_$0-9]/.test(parser.remaining().charAt(0))) {
        parser.pos = start;
        return left;
      }

      parser.sp();

      // right operand must also consist of only higher-precedence operators
      right = fallthrough(parser);
      if (!right) {
        parser.pos = start;
        return left;
      }

      left = {
        t: INFIX_OPERATOR,
        s: symbol,
        o: [left, right]
      };

      // Loop back around.  If we don't see another occurrence of the symbol,
      // we'll return left.
    }
  };
};

// create all infix sequence matchers, and return readLogicalOr
(function() {
  var i, len, matcher, fallthrough;

  // All the infix operators on order of precedence (source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Operator_Precedence)
  // Each sequence matcher will initially fall through to its higher precedence
  // neighbour, and only attempt to match if one of the higher precedence operators
  // (or, ultimately, a literal, reference, or bracketed expression) already matched
  var infixOperators = '* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||'.split(
    ' '
  );

  // A typeof operator is higher precedence than multiplication
  fallthrough = readTypeof;
  for (i = 0, len = infixOperators.length; i < len; i += 1) {
    matcher = makeInfixSequenceMatcher(infixOperators[i], fallthrough);
    fallthrough = matcher;
  }

  // Logical OR is the fallthrough for the conditional matcher
  readLogicalOr = fallthrough;
})();

var readLogicalOr$1 = readLogicalOr;

// The conditional operator is the lowest precedence operator, so we start here
function getConditional(parser) {
  var expression = readLogicalOr$1(parser);
  if (!expression) {
    return null;
  }

  var start = parser.pos;

  parser.sp();

  if (!parser.matchString('?')) {
    parser.pos = start;
    return expression;
  }

  parser.sp();

  var ifTrue = readExpression(parser);
  if (!ifTrue) {
    parser.error(expectedExpression);
  }

  parser.sp();

  if (!parser.matchString(':')) {
    parser.error('Expected ":"');
  }

  parser.sp();

  var ifFalse = readExpression(parser);
  if (!ifFalse) {
    parser.error(expectedExpression);
  }

  return {
    t: CONDITIONAL,
    o: [expression, ifTrue, ifFalse]
  };
}

function readExpression(parser) {
  // if eval is false, no expressions
  if (parser.allowExpressions === false) {
    var ref = readReference(parser);
    parser.sp();
    return ref;
  }

  // The conditional operator is the lowest precedence operator (except yield,
  // assignment operators, and commas, none of which are supported), so we
  // start there. If it doesn't match, it 'falls through' to progressively
  // higher precedence operators, until it eventually matches (or fails to
  // match) a 'primary' - a literal or a reference. This way, the abstract syntax
  // tree has everything in its proper place, i.e. 2 + 3 * 4 === 14, not 20.
  return getConditional(parser);
}

function readExpressionList(parser, spread) {
  var isSpread;
  var expressions = [];

  var pos = parser.pos;

  do {
    parser.sp();

    if (spread) {
      isSpread = parser.matchPattern(spreadPattern);
    }

    var expr = readExpression(parser);

    if (expr === null && expressions.length) {
      parser.error(expectedExpression);
    } else if (expr === null) {
      parser.pos = pos;
      return null;
    }

    if (isSpread) {
      expr.p = true;
    }

    expressions.push(expr);

    parser.sp();
  } while (parser.matchString(','));

  return expressions;
}

function readExpressionOrReference(parser, expectedFollowers) {
  var start = parser.pos;
  var expression = readExpression(parser);

  if (!expression) {
    // valid reference but invalid expression e.g. `{{new}}`?
    var ref = parser.matchPattern(/^(\w+)/);
    if (ref) {
      return {
        t: REFERENCE,
        n: ref
      };
    }

    return null;
  }

  for (var i = 0; i < expectedFollowers.length; i += 1) {
    if (parser.remaining().substr(0, expectedFollowers[i].length) === expectedFollowers[i]) {
      return expression;
    }
  }

  parser.pos = start;
  return readReference(parser);
}

function flattenExpression(expression) {
  var refs;
  var count = 0;

  extractRefs(expression, (refs = []));
  var stringified = stringify(expression);

  return {
    r: refs,
    s: getVars(stringified)
  };

  function getVars(expr) {
    var vars = [];
    for (var i = count - 1; i >= 0; i--) {
      vars.push(("x$" + i));
    }
    return vars.length ? ("(function(){var " + (vars.join(',')) + ";return(" + expr + ");})()") : expr;
  }

  function stringify(node) {
    if (isString(node)) {
      return node;
    }

    switch (node.t) {
      case BOOLEAN_LITERAL:
      case GLOBAL:
      case NUMBER_LITERAL:
      case REGEXP_LITERAL:
        return node.v;

      case STRING_LITERAL:
        return JSON.stringify(String(node.v));

      case ARRAY_LITERAL:
        if (node.m && hasSpread(node.m)) {
          return ("[].concat(" + (makeSpread(node.m, '[', ']', stringify)) + ")");
        } else {
          return '[' + (node.m ? node.m.map(stringify).join(',') : '') + ']';
        }

      case OBJECT_LITERAL:
        if (node.m && hasSpread(node.m)) {
          return ("Object.assign({}," + (makeSpread(node.m, '{', '}', stringifyPair)) + ")");
        } else {
          return '{' + (node.m ? node.m.map(function (n) { return ((n.k) + ":" + (stringify(n.v))); }).join(',') : '') + '}';
        }

      case PREFIX_OPERATOR:
        return (node.s === 'typeof' ? 'typeof ' : node.s) + stringify(node.o);

      case INFIX_OPERATOR:
        return (
          stringify(node.o[0]) +
          (node.s.substr(0, 2) === 'in' ? ' ' + node.s + ' ' : node.s) +
          stringify(node.o[1])
        );

      case INVOCATION:
        if (node.o && hasSpread(node.o)) {
          var id = count++;
          return ("(x$" + id + "=" + (stringify(node.x)) + ").apply(x$" + id + "," + (stringify({
            t: ARRAY_LITERAL,
            m: node.o
          })) + ")");
        } else {
          return stringify(node.x) + '(' + (node.o ? node.o.map(stringify).join(',') : '') + ')';
        }

      case BRACKETED:
        return '(' + stringify(node.x) + ')';

      case MEMBER:
        return stringify(node.x) + stringify(node.r);

      case REFINEMENT:
        return node.n ? '.' + node.n : '[' + stringify(node.x) + ']';

      case CONDITIONAL:
        return stringify(node.o[0]) + '?' + stringify(node.o[1]) + ':' + stringify(node.o[2]);

      case REFERENCE:
        return '_' + refs.indexOf(node.n);

      default:
        throw new Error('Expected legal JavaScript');
    }
  }

  function stringifyPair(node) {
    return node.p ? stringify(node.k) : ((node.k) + ":" + (stringify(node.v)));
  }

  function makeSpread(list, open, close, fn) {
    var out = list.reduce(
      function (a, c) {
        if (c.p) {
          a.str += "" + (a.open ? close + ',' : a.str.length ? ',' : '') + (fn(c));
        } else {
          a.str += "" + (!a.str.length ? open : !a.open ? ',' + open : ',') + (fn(c));
        }
        a.open = !c.p;
        return a;
      },
      { open: false, str: '' }
    );
    if (out.open) { out.str += close; }
    return out.str;
  }
}

function hasSpread(list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].p) { return true; }
  }

  return false;
}

// TODO maybe refactor this?
function extractRefs(node, refs) {
  if (node.t === REFERENCE && isString(node.n)) {
    if (!~refs.indexOf(node.n)) {
      refs.unshift(node.n);
    }
  }

  var list = node.o || node.m;
  if (list) {
    if (isObject(list)) {
      extractRefs(list, refs);
    } else {
      var i = list.length;
      while (i--) {
        extractRefs(list[i], refs);
      }
    }
  }

  if (node.k && node.t === KEY_VALUE_PAIR && !isString(node.k)) {
    extractRefs(node.k, refs);
  }

  if (node.x) {
    extractRefs(node.x, refs);
  }

  if (node.r) {
    extractRefs(node.r, refs);
  }

  if (node.v) {
    extractRefs(node.v, refs);
  }
}

function refineExpression(expression, mustache) {
  var referenceExpression;

  if (expression) {
    while (expression.t === BRACKETED && expression.x) {
      expression = expression.x;
    }

    if (expression.t === REFERENCE) {
      var n = expression.n;
      if (!~n.indexOf('@context')) {
        mustache.r = expression.n;
      } else {
        mustache.x = flattenExpression(expression);
      }
    } else {
      if ((referenceExpression = getReferenceExpression(expression))) {
        mustache.rx = referenceExpression;
      } else {
        mustache.x = flattenExpression(expression);
      }
    }

    return mustache;
  }
}

// TODO refactor this! it's bewildering
function getReferenceExpression(expression) {
  var members = [];
  var refinement;

  while (expression.t === MEMBER && expression.r.t === REFINEMENT) {
    refinement = expression.r;

    if (refinement.x) {
      if (refinement.x.t === REFERENCE) {
        members.unshift(refinement.x);
      } else {
        members.unshift(flattenExpression(refinement.x));
      }
    } else {
      members.unshift(refinement.n);
    }

    expression = expression.x;
  }

  if (expression.t !== REFERENCE) {
    return null;
  }

  return {
    r: expression.n,
    m: members
  };
}

var attributeNamePattern = /^[^\s"'>\/=(]+/;
var onPattern = /^on/;
var eventPattern = /^on-([a-zA-Z\*\.$_]((?:[a-zA-Z\*\.$_0-9\-]|\\-)+))$/;
var reservedEventNames = /^(?:change|reset|teardown|update|construct|config|init|render|complete|unrender|detach|insert|destruct|attachchild|detachchild)$/;
var decoratorPattern = /^as-([a-z-A-Z][-a-zA-Z_0-9]*)$/;
var transitionPattern = /^([a-zA-Z](?:(?!-in-out)[-a-zA-Z_0-9])*)-(in|out|in-out)$/;
var boundPattern = /^((bind|class)-(([-a-zA-Z0-9_])+))$/;
var directives = {
  lazy: { t: BINDING_FLAG, v: 'l' },
  twoway: { t: BINDING_FLAG, v: 't' },
  'no-delegation': { t: DELEGATE_FLAG }
};
var unquotedAttributeValueTextPattern = /^[^\s"'=<>\/`]+/;
var proxyEvent = /^[^\s"'=<>@\[\]()]*/;
var whitespace = /^\s+/;

var slashes = /\\/g;
function splitEvent(str) {
  var result = [];
  var s = 0;

  for (var i = 0; i < str.length; i++) {
    if (str[i] === '-' && str[i - 1] !== '\\') {
      result.push(str.substring(s, i).replace(slashes, ''));
      s = i + 1;
    }
  }

  result.push(str.substring(s).replace(slashes, ''));

  return result;
}

function readAttribute(parser) {
  var name, i, nearest, idx;

  parser.sp();

  name = parser.matchPattern(attributeNamePattern);
  if (!name) {
    return null;
  }

  // check for accidental delimiter consumption e.g. <tag bool{{>attrs}} />
  nearest = name.length;
  for (i = 0; i < parser.tags.length; i++) {
    if (~(idx = name.indexOf(parser.tags[i].open))) {
      if (idx < nearest) { nearest = idx; }
    }
  }
  if (nearest < name.length) {
    parser.pos -= name.length - nearest;
    name = name.substr(0, nearest);
    if (!name) { return null; }
  }

  return { n: name };
}

function readAttributeValue(parser) {
  var start = parser.pos;

  // next character must be `=`, `/`, `>` or whitespace
  if (!/[=\/>\s]/.test(parser.nextChar())) {
    parser.error('Expected `=`, `/`, `>` or whitespace');
  }

  parser.sp();

  if (!parser.matchString('=')) {
    parser.pos = start;
    return null;
  }

  parser.sp();

  var valueStart = parser.pos;
  var startDepth = parser.sectionDepth;

  var value =
    readQuotedAttributeValue(parser, "'") ||
    readQuotedAttributeValue(parser, "\"") ||
    readUnquotedAttributeValue(parser);

  if (value === null) {
    parser.error('Expected valid attribute value');
  }

  if (parser.sectionDepth !== startDepth) {
    parser.pos = valueStart;
    parser.error(
      'An attribute value must contain as many opening section tags as closing section tags'
    );
  }

  if (!value.length) {
    return '';
  }

  if (value.length === 1 && isString(value[0])) {
    return decodeCharacterReferences(value[0]);
  }

  return value;
}

function readUnquotedAttributeValueToken(parser) {
  var text, index;

  var start = parser.pos;

  text = parser.matchPattern(unquotedAttributeValueTextPattern);

  if (!text) {
    return null;
  }

  var haystack = text;
  var needles = parser.tags.map(function (t) { return t.open; }); // TODO refactor... we do this in readText.js as well

  if ((index = getLowestIndex(haystack, needles)) !== -1) {
    text = text.substr(0, index);
    parser.pos = start + text.length;
  }

  return text;
}

function readUnquotedAttributeValue(parser) {
  parser.inAttribute = true;

  var tokens = [];

  var token = readMustache(parser) || readUnquotedAttributeValueToken(parser);
  while (token) {
    tokens.push(token);
    token = readMustache(parser) || readUnquotedAttributeValueToken(parser);
  }

  if (!tokens.length) {
    return null;
  }

  parser.inAttribute = false;
  return tokens;
}

function readQuotedAttributeValue(parser, quoteMark) {
  var start = parser.pos;

  if (!parser.matchString(quoteMark)) {
    return null;
  }

  parser.inAttribute = quoteMark;

  var tokens = [];

  var token = readMustache(parser) || readQuotedStringToken(parser, quoteMark);
  while (token !== null) {
    tokens.push(token);
    token = readMustache(parser) || readQuotedStringToken(parser, quoteMark);
  }

  if (!parser.matchString(quoteMark)) {
    parser.pos = start;
    return null;
  }

  parser.inAttribute = false;

  return tokens;
}

function readQuotedStringToken(parser, quoteMark) {
  var haystack = parser.remaining();

  var needles = parser.tags.map(function (t) { return t.open; }); // TODO refactor... we do this in readText.js as well
  needles.push(quoteMark);

  var index = getLowestIndex(haystack, needles);

  if (index === -1) {
    parser.error('Quoted attribute value must have a closing quote');
  }

  if (!index) {
    return null;
  }

  parser.pos += index;
  return haystack.substr(0, index);
}

function readAttributeOrDirective(parser) {
  var match, directive;

  var attribute = readAttribute(parser, false);

  if (!attribute) { return null; }

  // lazy, twoway
  if ((directive = directives[attribute.n])) {
    attribute.t = directive.t;
    if (directive.v) { attribute.v = directive.v; }
    delete attribute.n; // no name necessary
    parser.sp();
    if (parser.nextChar() === '=') { attribute.f = readAttributeValue(parser); }
  } else if ((match = decoratorPattern.exec(attribute.n))) {
    // decorators
    attribute.n = match[1];
    attribute.t = DECORATOR;
    readArguments(parser, attribute);
  } else if ((match = transitionPattern.exec(attribute.n))) {
    // transitions
    attribute.n = match[1];
    attribute.t = TRANSITION;
    readArguments(parser, attribute);
    attribute.v = match[2] === 'in-out' ? 't0' : match[2] === 'in' ? 't1' : 't2';
  } else if ((match = eventPattern.exec(attribute.n))) {
    // on-click etc
    attribute.n = splitEvent(match[1]);
    attribute.t = EVENT;

    if (parser.matchString('(')) {
      attribute.a = flattenExpression({
        t: ARRAY_LITERAL,
        m: readExpressionList(parser)
      });
      if (!parser.matchString(')')) { parser.error("Expected closing ')'"); }
    }

    parser.inEvent = true;

    // check for a proxy event
    if (!readProxyEvent(parser, attribute)) {
      // otherwise, it's an expression
      readArguments(parser, attribute, true);
    } else if (reservedEventNames.test(attribute.f)) {
      parser.pos -= attribute.f.length;
      parser.error(
        'Cannot use reserved event names (change, reset, teardown, update, construct, config, init, render, unrender, complete, detach, insert, destruct, attachchild, detachchild)'
      );
    }

    parser.inEvent = false;
  } else if ((match = boundPattern.exec(attribute.n))) {
    // bound directives
    var bind = match[2] === 'bind';
    attribute.n = bind ? match[3] : match[1];
    attribute.t = ATTRIBUTE;
    readArguments(parser, attribute, false, true);

    if (!attribute.f && bind) {
      attribute.f = [{ t: INTERPOLATOR, r: match[3] }];
    }
  } else {
    parser.sp();
    var value = parser.nextChar() === '=' ? readAttributeValue(parser) : null;
    attribute.f = value != null ? value : attribute.f;

    if (parser.sanitizeEventAttributes && onPattern.test(attribute.n)) {
      return { exclude: true };
    } else {
      attribute.f = attribute.f || (attribute.f === '' ? '' : 0);
      attribute.t = ATTRIBUTE;
    }
  }

  return attribute;
}

function readProxyEvent(parser, attribute) {
  var start = parser.pos;
  if (!parser.matchString('=')) { parser.error("Missing required directive arguments"); }

  var quote = parser.matchString("'") || parser.matchString("\"");
  parser.sp();
  var proxy = parser.matchPattern(proxyEvent);

  if (proxy !== undefined) {
    if (quote) {
      parser.sp();
      if (!parser.matchString(quote)) { parser.pos = start; }
      else { return (attribute.f = proxy) || true; }
    } else if (!parser.matchPattern(whitespace)) {
      parser.pos = start;
    } else {
      return (attribute.f = proxy) || true;
    }
  } else {
    parser.pos = start;
  }
}

function readArguments(parser, attribute, required, single) {
  if ( required === void 0 ) required = false;
  if ( single === void 0 ) single = false;

  parser.sp();
  if (!parser.matchString('=')) {
    if (required) { parser.error("Missing required directive arguments"); }
    return;
  }
  parser.sp();

  var quote = parser.matchString('"') || parser.matchString("'");
  var spread = parser.spreadArgs;
  parser.spreadArgs = true;
  parser.inUnquotedAttribute = !quote;
  var expr = single
    ? readExpressionOrReference(parser, [quote || ' ', '/', '>'])
    : { m: readExpressionList(parser), t: ARRAY_LITERAL };
  parser.inUnquotedAttribute = false;
  parser.spreadArgs = spread;

  if (quote) {
    parser.sp();
    if (parser.matchString(quote) !== quote) { parser.error(("Expected matching quote '" + quote + "'")); }
  }

  if (single) {
    var interpolator = { t: INTERPOLATOR };
    refineExpression(expr, interpolator);
    attribute.f = [interpolator];
  } else {
    attribute.f = flattenExpression(expr);
  }
}

var delimiterChangeToken = { t: DELIMCHANGE, exclude: true };

function readMustache(parser) {
  var mustache, i;

  // If we're inside a <script> or <style> tag, and we're not
  // interpolating, bug out
  if (parser.interpolate[parser.inside] === false) {
    return null;
  }

  for (i = 0; i < parser.tags.length; i += 1) {
    if ((mustache = readMustacheOfType(parser, parser.tags[i]))) {
      return mustache;
    }
  }

  if (parser.inTag && !parser.inAttribute) {
    mustache = readAttributeOrDirective(parser);
    if (mustache) {
      parser.sp();
      return mustache;
    }
  }
}

function readMustacheOfType(parser, tag) {
  var mustache, reader, i;

  var start = parser.pos;

  if (parser.matchString('\\' + tag.open)) {
    if (start === 0 || parser.str[start - 1] !== '\\') {
      return tag.open;
    }
  } else if (!parser.matchString(tag.open)) {
    return null;
  }

  // delimiter change?
  if ((mustache = readDelimiterChange(parser))) {
    // find closing delimiter or abort...
    if (!parser.matchString(tag.close)) {
      return null;
    }

    // ...then make the switch
    tag.open = mustache[0];
    tag.close = mustache[1];
    parser.sortMustacheTags();

    return delimiterChangeToken;
  }

  parser.sp();

  // illegal section closer
  if (parser.matchString('/')) {
    parser.pos -= 1;
    var rewind = parser.pos;
    if (!readNumberLiteral(parser)) {
      parser.pos = rewind - tag.close.length;
      if (parser.inAttribute) {
        parser.pos = start;
        return null;
      } else {
        parser.error("Attempted to close a section that wasn't open");
      }
    } else {
      parser.pos = rewind;
    }
  }

  for (i = 0; i < tag.readers.length; i += 1) {
    reader = tag.readers[i];

    if ((mustache = reader(parser, tag))) {
      if (tag.isStatic) {
        mustache.s = 1;
      }

      if (parser.includeLinePositions) {
        mustache.q = parser.getLinePos(start);
      }

      return mustache;
    }
  }

  parser.pos = start;
  return null;
}

function readTriple(parser, tag) {
  var expression = readExpression(parser);

  if (!expression) {
    return null;
  }

  if (!parser.matchString(tag.close)) {
    parser.error(("Expected closing delimiter '" + (tag.close) + "'"));
  }

  var triple = { t: TRIPLE };
  refineExpression(expression, triple); // TODO handle this differently - it's mysterious

  return triple;
}

function readUnescaped(parser, tag) {
  if (!parser.matchString('&')) {
    return null;
  }

  parser.sp();

  var expression = readExpression(parser);

  if (!expression) {
    return null;
  }

  if (!parser.matchString(tag.close)) {
    parser.error(("Expected closing delimiter '" + (tag.close) + "'"));
  }

  var triple = { t: TRIPLE };
  refineExpression(expression, triple); // TODO handle this differently - it's mysterious

  return triple;
}

var legalAlias = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
var asRE = /^as/i;

function readAliases(parser) {
  var aliases = [];
  var alias;
  var start = parser.pos;

  parser.sp();

  alias = readAlias(parser);

  if (alias) {
    alias.x = refineExpression(alias.x, {});
    aliases.push(alias);

    parser.sp();

    while (parser.matchString(',')) {
      alias = readAlias(parser);

      if (!alias) {
        parser.error('Expected another alias.');
      }

      alias.x = refineExpression(alias.x, {});
      aliases.push(alias);

      parser.sp();
    }

    return aliases;
  }

  parser.pos = start;
  return null;
}

function readAlias(parser) {
  var start = parser.pos;

  parser.sp();

  var expr = readExpression(parser, []);

  if (!expr) {
    parser.pos = start;
    return null;
  }

  parser.sp();
  parser.matchPattern(asRE);
  parser.sp();

  var alias = parser.matchPattern(legalAlias);

  if (!alias) {
    parser.pos = start;
    return null;
  }

  return { n: alias, x: expr };
}

function readPartial(parser, tag) {
  var type = parser.matchString('>') || parser.matchString('yield');
  var partial = { t: type === '>' ? PARTIAL : YIELDER };
  var aliases;

  if (!type) { return null; }

  parser.sp();

  if (type === '>' || !(aliases = parser.matchString('with'))) {
    // Partial names can include hyphens, so we can't use readExpression
    // blindly. Instead, we use the `relaxedNames` flag to indicate that
    // `foo-bar` should be read as a single name, rather than 'subtract
    // bar from foo'
    parser.relaxedNames = parser.strictRefinement = true;
    var expression = readExpression(parser);
    parser.relaxedNames = parser.strictRefinement = false;

    if (!expression && type === '>') { return null; }

    if (expression) {
      refineExpression(expression, partial); // TODO...
      parser.sp();
      if (type !== '>') { aliases = parser.matchString('with'); }
    }
  }

  parser.sp();

  // check for alias context e.g. `{{>foo bar as bat, bip as bop}}`
  if (aliases || type === '>') {
    aliases = readAliases(parser);
    if (aliases && aliases.length) {
      partial.z = aliases;
    } else {
      // otherwise check for literal context e.g. `{{>foo bar}}` then
      // turn it into `{{#with bar}}{{>foo}}{{/with}}`
      var context = readExpression(parser);
      if (context) {
        partial.c = {};
        refineExpression(context, partial.c);
      }

      // allow aliases after context
      if (parser.matchString(',')) {
        aliases = readAliases(parser);
        if (aliases && aliases.length) {
          partial.z = aliases;
        }
      }
    }

    if (type !== '>' && (!partial.c && !partial.z)) {
      // {{yield with}} requires some aliases
      parser.error("Expected a context or one or more aliases");
    }
  }

  parser.sp();

  if (!parser.matchString(tag.close)) {
    parser.error(("Expected closing delimiter '" + (tag.close) + "'"));
  }

  return partial;
}

function readComment(parser, tag) {
  if (!parser.matchString('!')) {
    return null;
  }

  var index = parser.remaining().indexOf(tag.close);

  if (index !== -1) {
    parser.pos += index + tag.close.length;
    return { t: COMMENT };
  }
}

function readInterpolator(parser, tag) {
  var expression, err;

  var start = parser.pos;

  // TODO would be good for perf if we could do away with the try-catch
  try {
    expression = readExpressionOrReference(parser, [tag.close]);
  } catch (e) {
    err = e;
  }

  if (!expression) {
    if (parser.str.charAt(start) === '!') {
      // special case - comment
      parser.pos = start;
      return null;
    }

    if (err) {
      throw err;
    }
  }

  if (!parser.matchString(tag.close)) {
    parser.error(("Expected closing delimiter '" + (tag.close) + "' after reference"));

    if (!expression) {
      // special case - comment
      if (parser.nextChar() === '!') {
        return null;
      }

      parser.error("Expected expression or legal reference");
    }
  }

  var interpolator = { t: INTERPOLATOR };
  refineExpression(expression, interpolator); // TODO handle this differently - it's mysterious

  return interpolator;
}

function readClosing(parser, tag) {
  var start = parser.pos;

  if (!parser.matchString(tag.open)) {
    return null;
  }

  parser.sp();

  if (!parser.matchString('/')) {
    parser.pos = start;
    return null;
  }

  parser.sp();

  var remaining = parser.remaining();
  var index = remaining.indexOf(tag.close);

  if (index !== -1) {
    var closing = {
      t: CLOSING,
      r: remaining.substr(0, index).split(' ')[0]
    };

    parser.pos += index;

    if (!parser.matchString(tag.close)) {
      parser.error(("Expected closing delimiter '" + (tag.close) + "'"));
    }

    return closing;
  }

  parser.pos = start;
  return null;
}

var patterns = {
  else: /^\s*else\s*/,
  elseif: /^\s*elseif\s+/,
  then: /^\s*then\s*/,
  catch: /^\s*catch\s*/
};

var types = {
  else: ELSE,
  elseif: ELSEIF,
  then: THEN,
  catch: CATCH
};

function readInlineBlock(parser, tag, type) {
  var start = parser.pos;

  if (!parser.matchString(tag.open)) {
    return null;
  }

  if (!parser.matchPattern(patterns[type])) {
    parser.pos = start;
    return null;
  }

  var res = { t: types[type] };

  if (type === 'elseif') {
    res.x = readExpression(parser);
  } else if (type === 'catch' || type === 'then') {
    var nm = parser.matchPattern(name);
    if (nm) { res.n = nm; }
  }

  if (!parser.matchString(tag.close)) {
    parser.error(("Expected closing delimiter '" + (tag.close) + "'"));
  }

  return res;
}

var handlebarsBlockCodes = {
  each: SECTION_EACH,
  if: SECTION_IF,
  with: SECTION_IF_WITH,
  unless: SECTION_UNLESS
};

var indexRefPattern = /^\s*:\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
var keyIndexRefPattern = /^\s*,\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
var handlebarsBlockPattern = new RegExp('^(' + keys(handlebarsBlockCodes).join('|') + ')\\b');

function readSection(parser, tag) {
  var expression,
    section,
    child,
    children,
    hasElse,
    block,
    unlessBlock,
    closed,
    i,
    expectedClose,
    hasThen,
    hasCatch,
    inlineThen;
  var aliasOnly = false;

  var start = parser.pos;

  if (parser.matchString('^')) {
    // watch out for parent context refs - {{^^/^^/foo}}
    if (parser.matchString('^/')) {
      parser.pos = start;
      return null;
    }
    section = { t: SECTION, f: [], n: SECTION_UNLESS };
  } else if (parser.matchString('#')) {
    section = { t: SECTION, f: [] };

    if (parser.matchString('partial')) {
      parser.pos = start - parser.standardDelimiters[0].length;
      parser.error(
        'Partial definitions can only be at the top level of the template, or immediately inside components'
      );
    }

    if ((block = parser.matchString('await'))) {
      expectedClose = block;
      section.t = AWAIT;
    } else if ((block = parser.matchPattern(handlebarsBlockPattern))) {
      expectedClose = block;
      section.n = handlebarsBlockCodes[block];
    }
  } else {
    return null;
  }

  parser.sp();

  if (block === 'with') {
    var aliases = readAliases(parser);
    if (aliases) {
      aliasOnly = true;
      section.z = aliases;
      section.t = ALIAS;
    }
  } else if (block === 'each') {
    var alias = readAlias(parser);
    if (alias) {
      section.z = [{ n: alias.n, x: { r: '.' } }];
      expression = alias.x;
    }
  }

  if (!aliasOnly) {
    if (!expression) { expression = readExpression(parser); }

    if (!expression) {
      parser.error('Expected expression');
    }

    // extra each aliases
    if (block === 'each' && parser.matchString(',')) {
      var aliases$1 = readAliases(parser);
      if (aliases$1) {
        if (section.z) { aliases$1.unshift(section.z[0]); }
        section.z = aliases$1;
      }
    }

    // optional index and key references
    if ((block === 'each' || !block) && (i = parser.matchPattern(indexRefPattern))) {
      var extra;

      if ((extra = parser.matchPattern(keyIndexRefPattern))) {
        section.i = i + ',' + extra;
      } else {
        section.i = i;
      }
    } else if (block === 'await' && parser.matchString('then')) {
      parser.sp();
      hasThen = true;
      inlineThen = parser.matchPattern(name);
      if (!inlineThen) { inlineThen = true; }
    }

    if (!block && expression.n) {
      expectedClose = expression.n;
    }
  }

  parser.sp();

  if (!parser.matchString(tag.close)) {
    parser.error(("Expected closing delimiter '" + (tag.close) + "'"));
  }

  parser.sectionDepth += 1;
  children = section.f;

  var pos;
  do {
    pos = parser.pos;
    if ((child = readClosing(parser, tag))) {
      if (expectedClose && child.r !== expectedClose) {
        if (!block) {
          if (child.r)
            { parser.warn(
              ("Expected " + (tag.open) + "/" + expectedClose + (tag.close) + " but found " + (tag.open) + "/" + (child.r) + (tag.close))
            ); }
        } else {
          parser.pos = pos;
          parser.error(("Expected " + (tag.open) + "/" + expectedClose + (tag.close)));
        }
      }

      parser.sectionDepth -= 1;
      closed = true;
    } else if (
      !aliasOnly &&
      ((child = readInlineBlock(parser, tag, 'elseif')) ||
        (child = readInlineBlock(parser, tag, 'else')) ||
        (block === 'await' &&
          ((child = readInlineBlock(parser, tag, 'then')) ||
            (child = readInlineBlock(parser, tag, 'catch')))))
    ) {
      if (section.n === SECTION_UNLESS) {
        parser.error('{{else}} not allowed in {{#unless}}');
      }

      if (hasElse) {
        if (child.t === ELSE) {
          parser.error('there can only be one {{else}} block, at the end of a section');
        } else if (child.t === ELSEIF) {
          parser.error('illegal {{elseif...}} after {{else}}');
        }
      }

      if (!unlessBlock && (inlineThen || !hasThen) && !hasCatch) {
        if (block === 'await') {
          var s = { f: children };
          section.f = [s];
          if (inlineThen) {
            s.t = THEN;
            inlineThen !== true && (s.n = inlineThen);
          } else {
            s.t = SECTION;
          }
        } else {
          unlessBlock = [];
        }
      }

      var mustache = {
        t: SECTION,
        f: (children = [])
      };

      if (child.t === ELSE) {
        if (block === 'await') {
          section.f.push(mustache);
          mustache.t = ELSE;
        } else {
          mustache.n = SECTION_UNLESS;
          unlessBlock.push(mustache);
        }
        hasElse = true;
      } else if (child.t === ELSEIF) {
        mustache.n = SECTION_IF;
        refineExpression(child.x, mustache);
        unlessBlock.push(mustache);
      } else if (child.t === THEN) {
        if (hasElse) { parser.error('{{then}} block must appear before any {{else}} block'); }
        if (hasCatch) { parser.error('{{then}} block must appear before any {{catch}} block'); }
        if (hasThen) { parser.error('there can only be one {{then}} block per {{#await}}'); }
        mustache.t = THEN;
        hasThen = true;
        child.n && (mustache.n = child.n);
        section.f.push(mustache);
      } else if (child.t === CATCH) {
        if (hasElse) { parser.error('{{catch}} block must appear before any {{else}} block'); }
        if (hasCatch) { parser.error('there can only be one {{catch}} block per {{#await}}'); }
        mustache.t = CATCH;
        hasCatch = true;
        mustache.n = child.n;
        section.f.push(mustache);
      }
    } else {
      child = parser.read(READERS);

      if (!child) {
        break;
      }

      children.push(child);
    }
  } while (!closed);

  if (unlessBlock) {
    section.l = unlessBlock;
  }

  if (!aliasOnly) {
    refineExpression(expression, section);
  }

  if (block === 'await' && (inlineThen || !hasThen) && !hasCatch && !hasElse) {
    var s$1 = { f: section.f };
    section.f = [s$1];
    if (inlineThen) {
      s$1.t = THEN;
      inlineThen !== true && (s$1.n = inlineThen);
    } else {
      s$1.t = SECTION;
    }
  }

  // TODO if a section is empty it should be discarded. Don't do
  // that here though - we need to clean everything up first, as
  // it may contain removeable whitespace. As a temporary measure,
  // to pass the existing tests, remove empty `f` arrays
  if (!section.f.length) {
    delete section.f;
  }

  return section;
}

var OPEN_COMMENT = '<!--';
var CLOSE_COMMENT = '-->';

function readHtmlComment(parser) {
  var start = parser.pos;

  if (parser.textOnlyMode || !parser.matchString(OPEN_COMMENT)) {
    return null;
  }

  var remaining = parser.remaining();
  var endIndex = remaining.indexOf(CLOSE_COMMENT);

  if (endIndex === -1) {
    parser.error("Illegal HTML - expected closing comment sequence ('-->')");
  }

  var content = remaining.substr(0, endIndex);
  parser.pos += endIndex + 3;

  var comment = {
    t: COMMENT,
    c: content
  };

  if (parser.includeLinePositions) {
    comment.q = parser.getLinePos(start);
  }

  return comment;
}

var leadingLinebreak = /^[ \t\f\r\n]*\r?\n/;
var trailingLinebreak = /\r?\n[ \t\f\r\n]*$/;

function stripStandalones(items) {
  var i, current, backOne, backTwo, lastSectionItem;

  for (i = 1; i < items.length; i += 1) {
    current = items[i];
    backOne = items[i - 1];
    backTwo = items[i - 2];

    // if we're at the end of a [text][comment][text] sequence...
    if (isString(current) && isComment(backOne) && isString(backTwo)) {
      // ... and the comment is a standalone (i.e. line breaks either side)...
      if (trailingLinebreak.test(backTwo) && leadingLinebreak.test(current)) {
        // ... then we want to remove the whitespace after the first line break
        items[i - 2] = backTwo.replace(trailingLinebreak, '\n');

        // and the leading line break of the second text token
        items[i] = current.replace(leadingLinebreak, '');
      }
    }

    // if the current item is a section, and it is preceded by a linebreak, and
    // its first item is a linebreak...
    if (isSection(current) && isString(backOne)) {
      if (
        trailingLinebreak.test(backOne) &&
        isString(current.f[0]) &&
        leadingLinebreak.test(current.f[0])
      ) {
        items[i - 1] = backOne.replace(trailingLinebreak, '\n');
        current.f[0] = current.f[0].replace(leadingLinebreak, '');
      }
    }

    // if the last item was a section, and it is followed by a linebreak, and
    // its last item is a linebreak...
    if (isString(current) && isSection(backOne)) {
      lastSectionItem = lastItem(backOne.f);

      if (
        isString(lastSectionItem) &&
        trailingLinebreak.test(lastSectionItem) &&
        leadingLinebreak.test(current)
      ) {
        backOne.f[backOne.f.length - 1] = lastSectionItem.replace(trailingLinebreak, '\n');
        items[i] = current.replace(leadingLinebreak, '');
      }
    }
  }

  return items;
}

function isComment(item) {
  return item.t === COMMENT || item.t === DELIMCHANGE;
}

function isSection(item) {
  return (item.t === SECTION || item.t === INVERTED) && item.f;
}

function trimWhitespace(items, leadingPattern, trailingPattern) {
  var item;

  if (leadingPattern) {
    item = items[0];
    if (isString(item)) {
      item = item.replace(leadingPattern, '');

      if (!item) {
        items.shift();
      } else {
        items[0] = item;
      }
    }
  }

  if (trailingPattern) {
    item = lastItem(items);
    if (isString(item)) {
      item = item.replace(trailingPattern, '');

      if (!item) {
        items.pop();
      } else {
        items[items.length - 1] = item;
      }
    }
  }
}

var contiguousWhitespace = /[ \t\f\r\n]+/g;
var leadingWhitespace$1 = /^[ \t\f\r\n]+/;
var trailingWhitespace = /[ \t\f\r\n]+$/;
var leadingNewLine = /^(?:\r\n|\r|\n)/;
var trailingNewLine = /(?:\r\n|\r|\n)$/;

function cleanup(
  items,
  stripComments,
  preserveWhitespace,
  removeLeadingWhitespace,
  removeTrailingWhitespace,
  whiteSpaceElements
) {
  if (isString(items)) { return; }

  var i,
    item,
    previousItem,
    nextItem,
    preserveWhitespaceInsideFragment,
    removeLeadingWhitespaceInsideFragment,
    removeTrailingWhitespaceInsideFragment;

  // First pass - remove standalones and comments etc
  stripStandalones(items);

  i = items.length;
  while (i--) {
    item = items[i];

    // Remove delimiter changes, unsafe elements etc
    if (item.exclude) {
      items.splice(i, 1);
    } else if (stripComments && item.t === COMMENT) {
      // Remove comments, unless we want to keep them
      items.splice(i, 1);
    }
  }

  // If necessary, remove leading and trailing whitespace
  trimWhitespace(
    items,
    removeLeadingWhitespace ? leadingWhitespace$1 : null,
    removeTrailingWhitespace ? trailingWhitespace : null
  );

  i = items.length;
  while (i--) {
    item = items[i];
    removeLeadingWhitespaceInsideFragment = removeTrailingWhitespaceInsideFragment = false;

    // Recurse
    if (item.f) {
      var isPreserveWhitespaceElement =
        item.t === ELEMENT &&
        (whiteSpaceElements[item.e.toLowerCase()] || whiteSpaceElements[item.e]);
      preserveWhitespaceInsideFragment = preserveWhitespace || isPreserveWhitespaceElement;

      if (!preserveWhitespace && isPreserveWhitespaceElement) {
        trimWhitespace(item.f, leadingNewLine, trailingNewLine);
      }

      if (!preserveWhitespaceInsideFragment) {
        previousItem = items[i - 1];
        nextItem = items[i + 1];

        // if the previous item was a text item with trailing whitespace,
        // remove leading whitespace inside the fragment
        if (!previousItem || (isString(previousItem) && trailingWhitespace.test(previousItem))) {
          removeLeadingWhitespaceInsideFragment = true;
        }

        // and vice versa
        if (!nextItem || (isString(nextItem) && leadingWhitespace$1.test(nextItem))) {
          removeTrailingWhitespaceInsideFragment = true;
        }
      }

      cleanup(
        item.f,
        stripComments,
        preserveWhitespaceInsideFragment,
        removeLeadingWhitespaceInsideFragment,
        removeTrailingWhitespaceInsideFragment,
        whiteSpaceElements
      );
    }

    // Split if-else blocks into two (an if, and an unless)
    if (item.l) {
      cleanup(
        item.l,
        stripComments,
        preserveWhitespace,
        removeLeadingWhitespaceInsideFragment,
        removeTrailingWhitespaceInsideFragment,
        whiteSpaceElements
      );

      item.l.forEach(function (s) { return (s.l = 1); });
      item.l.unshift(i + 1, 0);
      items.splice.apply(items, item.l);
      delete item.l; // TODO would be nice if there was a way around this
    }

    // Clean up conditional attributes
    if (item.m) {
      cleanup(
        item.m,
        stripComments,
        preserveWhitespace,
        removeLeadingWhitespaceInsideFragment,
        removeTrailingWhitespaceInsideFragment,
        whiteSpaceElements
      );
      if (item.m.length < 1) { delete item.m; }
    }
  }

  // final pass - fuse text nodes together
  i = items.length;
  while (i--) {
    if (isString(items[i])) {
      if (isString(items[i + 1])) {
        items[i] = items[i] + items[i + 1];
        items.splice(i + 1, 1);
      }

      if (!preserveWhitespace) {
        items[i] = items[i].replace(contiguousWhitespace, ' ');
      }

      if (items[i] === '') {
        items.splice(i, 1);
      }
    }
  }
}

var closingTagPattern = /^([a-zA-Z]{1,}:?[a-zA-Z0-9\-]*)\s*\>/;

function readClosingTag(parser) {
  var tag;

  var start = parser.pos;

  // are we looking at a closing tag?
  if (!parser.matchString('</')) {
    return null;
  }

  if ((tag = parser.matchPattern(closingTagPattern))) {
    if (parser.inside && tag !== parser.inside) {
      parser.pos = start;
      return null;
    }

    return {
      t: CLOSING_TAG,
      e: tag
    };
  }

  // We have an illegal closing tag, report it
  parser.pos -= 2;
  parser.error('Illegal closing tag');
}

function hyphenateCamel(camelCaseStr) {
  return camelCaseStr.replace(/([A-Z])/g, function (match, $1) {
    return '-' + $1.toLowerCase();
  });
}

var tagNamePattern = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;
var anchorPattern = /^[a-zA-Z_$][-a-zA-Z0-9_$]*/;
var validTagNameFollower = /^[\s\n\/>]/;
var semiEnd = /;\s*$/;
var exclude = { exclude: true };

// based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
var disallowedContents = {
  li: ['li'],
  dt: ['dt', 'dd'],
  dd: ['dt', 'dd'],
  p: 'address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split(
    ' '
  ),
  rt: ['rt', 'rp'],
  rp: ['rt', 'rp'],
  optgroup: ['optgroup'],
  option: ['option', 'optgroup'],
  thead: ['tbody', 'tfoot'],
  tbody: ['tbody', 'tfoot'],
  tfoot: ['tbody'],
  tr: ['tr', 'tbody'],
  td: ['td', 'th', 'tr'],
  th: ['td', 'th', 'tr']
};

function readElement$1(parser) {
  var attribute,
    selfClosing,
    children,
    partials,
    hasPartials,
    child,
    closed,
    pos,
    remaining,
    closingTag,
    anchor;

  var start = parser.pos;

  if (parser.inside || parser.inAttribute || parser.textOnlyMode) {
    return null;
  }

  if (!parser.matchString('<')) {
    return null;
  }

  // if this is a closing tag, abort straight away
  if (parser.nextChar() === '/') {
    return null;
  }

  var element = {};
  if (parser.includeLinePositions) {
    element.q = parser.getLinePos(start);
  }

  // check for doctype decl
  if (parser.matchString('!')) {
    element.t = DOCTYPE;
    if (!parser.matchPattern(/^doctype/i)) {
      parser.error('Expected DOCTYPE declaration');
    }

    element.a = parser.matchPattern(/^(.+?)>/);
    return element;
  } else if ((anchor = parser.matchString('#'))) {
    // check for anchor
    parser.sp();
    element.t = ANCHOR;
    element.n = parser.matchPattern(anchorPattern);
  } else {
    // otherwise, it's an element/component
    element.t = ELEMENT;

    // element name
    element.e = parser.matchPattern(tagNamePattern);
    if (!element.e) {
      return null;
    }
  }

  // next character must be whitespace, closing solidus or '>'
  if (!validTagNameFollower.test(parser.nextChar())) {
    parser.error('Illegal tag name');
  }

  parser.sp();

  parser.inTag = true;

  // directives and attributes
  while ((attribute = readMustache(parser))) {
    if (attribute !== false) {
      if (!element.m) { element.m = []; }
      element.m.push(attribute);
    }

    parser.sp();
  }

  parser.inTag = false;

  // allow whitespace before closing solidus
  parser.sp();

  // self-closing solidus?
  if (parser.matchString('/')) {
    selfClosing = true;
  }

  // closing angle bracket
  if (!parser.matchString('>')) {
    return null;
  }

  var lowerCaseName = (element.e || element.n).toLowerCase();
  var preserveWhitespace = parser.preserveWhitespace;

  if (!selfClosing && (anchor || !voidElements[element.e.toLowerCase()])) {
    if (!anchor) {
      parser.elementStack.push(lowerCaseName);

      // Special case - if we open a script element, further tags should
      // be ignored unless they're a closing script element
      if (lowerCaseName in parser.interpolate) {
        parser.inside = lowerCaseName;
      }
    }

    children = [];
    partials = create(null);

    do {
      pos = parser.pos;
      remaining = parser.remaining();

      if (!remaining) {
        // if this happens to be a script tag and there's no content left, it's because
        // a closing script tag can't appear in a script
        if (parser.inside === 'script') {
          closed = true;
          break;
        }

        parser.error(
          ("Missing end " + (parser.elementStack.length > 1 ? 'tags' : 'tag') + " (" + (parser.elementStack
            .reverse()
            .map(function (x) { return ("</" + x + ">"); })
            .join('')) + ")")
        );
      }

      // if for example we're in an <li> element, and we see another
      // <li> tag, close the first so they become siblings
      if (!anchor && !canContain(lowerCaseName, remaining)) {
        closed = true;
      } else if (!anchor && (closingTag = readClosingTag(parser))) {
        // closing tag
        closed = true;

        var closingTagName = closingTag.e.toLowerCase();

        // if this *isn't* the closing tag for the current element...
        if (closingTagName !== lowerCaseName) {
          // rewind parser
          parser.pos = pos;

          // if it doesn't close a parent tag, error
          if (!~parser.elementStack.indexOf(closingTagName)) {
            var errorMessage = 'Unexpected closing tag';

            // add additional help for void elements, since component names
            // might clash with them
            if (voidElements[closingTagName.toLowerCase()]) {
              errorMessage += " (<" + closingTagName + "> is a void element - it cannot contain children)";
            }

            parser.error(errorMessage);
          }
        }
      } else if (anchor && readAnchorClose(parser, element.n)) {
        closed = true;
      } else {
        // implicit close by closing section tag. TODO clean this up
        var tag = {
          open: parser.standardDelimiters[0],
          close: parser.standardDelimiters[1]
        };
        if (readClosing(parser, tag) || readInline(parser, tag)) {
          closed = true;
          parser.pos = pos;
        } else if ((child = parser.read(PARTIAL_READERS))) {
          if (partials[child.n]) {
            parser.pos = pos;
            parser.error('Duplicate partial definition');
          }

          cleanup(
            child.f,
            parser.stripComments,
            preserveWhitespace,
            !preserveWhitespace,
            !preserveWhitespace,
            parser.whiteSpaceElements
          );

          partials[child.n] = child.f;
          hasPartials = true;
        } else {
          if ((child = parser.read(READERS))) {
            children.push(child);
          } else {
            closed = true;
          }
        }
      }
    } while (!closed);

    if (children.length) {
      element.f = children;
    }

    if (hasPartials) {
      element.p = partials;
    }

    parser.elementStack.pop();
  }

  parser.inside = null;

  if (parser.sanitizeElements && parser.sanitizeElements.indexOf(lowerCaseName) !== -1) {
    return exclude;
  }

  if (
    element.m &&
    lowerCaseName !== 'input' &&
    lowerCaseName !== 'select' &&
    lowerCaseName !== 'textarea' &&
    lowerCaseName !== 'option'
  ) {
    var attrs = element.m;
    var classes, styles, cls, style;
    var i = 0;
    var a;
    while (i < attrs.length) {
      a = attrs[i];

      if (a.t !== ATTRIBUTE) {
        i++;
        continue;
      }

      if (a.n.indexOf('class-') === 0 && !a.f) {
        // static class directives
        (classes || (classes = [])).push(a.n.slice(6));
        attrs.splice(i, 1);
      } else if (a.n.indexOf('style-') === 0 && isString(a.f)) {
        // static style directives
        (styles || (styles = [])).push(((hyphenateCamel(a.n.slice(6))) + ": " + (a.f) + ";"));
        attrs.splice(i, 1);
      } else if (a.n === 'class' && isString(a.f)) {
        // static class attrs
        (classes || (classes = [])).push(a.f);
        attrs.splice(i, 1);
      } else if (a.n === 'style' && isString(a.f)) {
        // static style attrs
        (styles || (styles = [])).push(a.f + (semiEnd.test(a.f) ? '' : ';'));
        attrs.splice(i, 1);
      } else if (a.n === 'class') {
        cls = a;
        i++;
      } else if (a.n === 'style') {
        style = a;
        i++;
      } else if (
        !~a.n.indexOf(':') &&
        a.n !== 'value' &&
        a.n !== 'contenteditable' &&
        isString(a.f)
      ) {
        a.g = 1;
        i++;
      } else {
        i++;
      }
    }

    if (classes) {
      if (!cls || !isString(cls.f))
        { attrs.unshift({ t: ATTRIBUTE, n: 'class', f: classes.join(' '), g: 1 }); }
      else { cls.f += ' ' + classes.join(' '); }
    } else if (cls && isString(cls.f)) { cls.g = 1; }

    if (styles) {
      if (!style || !isString(style.f))
        { attrs.unshift({ t: ATTRIBUTE, n: 'style', f: styles.join(' '), g: 1 }); }
      else { style.f += '; ' + styles.join(' '); }
    } else if (style && isString(style.f)) { style.g = 1; }
  }

  return element;
}

function canContain(name, remaining) {
  var match = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec(remaining);
  var disallowed = disallowedContents[name];

  if (!match || !disallowed) {
    return true;
  }

  return !~disallowed.indexOf(match[1].toLowerCase());
}

function readAnchorClose(parser, name) {
  var pos = parser.pos;
  if (!parser.matchString('</')) {
    return null;
  }

  parser.matchString('#');
  parser.sp();

  if (!parser.matchString(name)) {
    parser.pos = pos;
    return null;
  }

  parser.sp();

  if (!parser.matchString('>')) {
    parser.pos = pos;
    return null;
  }

  return true;
}

var inlines = /^\s*(elseif|else|then|catch)\s*/;
function readInline(parser, tag) {
  var pos = parser.pos;
  if (!parser.matchString(tag.open)) { return; }
  if (parser.matchPattern(inlines)) {
    return true;
  } else {
    parser.pos = pos;
  }
}

function readText(parser) {
  var index, disallowed, barrier;

  var remaining = parser.remaining();

  if (parser.textOnlyMode) {
    disallowed = parser.tags.map(function (t) { return t.open; });
    disallowed = disallowed.concat(parser.tags.map(function (t) { return '\\' + t.open; }));

    index = getLowestIndex(remaining, disallowed);
  } else {
    barrier = parser.inside ? '</' + parser.inside : '<';

    if (parser.inside && !parser.interpolate[parser.inside]) {
      index = remaining.indexOf(barrier);
    } else {
      disallowed = parser.tags.map(function (t) { return t.open; });
      disallowed = disallowed.concat(parser.tags.map(function (t) { return '\\' + t.open; }));

      // http://developers.whatwg.org/syntax.html#syntax-attributes
      if (parser.inAttribute === true) {
        // we're inside an unquoted attribute value
        disallowed.push("\"", "'", "=", "<", ">", '`');
      } else if (parser.inAttribute) {
        // quoted attribute value
        disallowed.push(parser.inAttribute);
      } else {
        disallowed.push(barrier);
      }

      index = getLowestIndex(remaining, disallowed);
    }
  }

  if (!index) {
    return null;
  }

  if (index === -1) {
    index = remaining.length;
  }

  parser.pos += index;

  if ((parser.inside && parser.inside !== 'textarea') || parser.textOnlyMode) {
    return remaining.substr(0, index);
  } else {
    return decodeCharacterReferences(remaining.substr(0, index));
  }
}

var partialDefinitionSectionPattern = /^\s*#\s*partial\s+/;

function readPartialDefinitionSection(parser) {
  var child, closed;

  var start = parser.pos;

  var delimiters = parser.standardDelimiters;

  if (!parser.matchString(delimiters[0])) {
    return null;
  }

  if (!parser.matchPattern(partialDefinitionSectionPattern)) {
    parser.pos = start;
    return null;
  }

  var name = parser.matchPattern(/^[a-zA-Z_$][a-zA-Z_$0-9\-\/]*/);

  if (!name) {
    parser.error('expected legal partial name');
  }

  parser.sp();
  if (!parser.matchString(delimiters[1])) {
    parser.error(("Expected closing delimiter '" + (delimiters[1]) + "'"));
  }

  var content = [];

  var open = delimiters[0];
  var close = delimiters[1];

  do {
    if ((child = readClosing(parser, { open: open, close: close }))) {
      if (child.r !== 'partial') {
        parser.error(("Expected " + open + "/partial" + close));
      }

      closed = true;
    } else {
      child = parser.read(READERS);

      if (!child) {
        parser.error(("Expected " + open + "/partial" + close));
      }

      content.push(child);
    }
  } while (!closed);

  return {
    t: INLINE_PARTIAL,
    n: name,
    f: content
  };
}

function readTemplate(parser) {
  var fragment = [];
  var partials = create(null);
  var hasPartials = false;

  var preserveWhitespace = parser.preserveWhitespace;

  while (parser.pos < parser.str.length) {
    var pos = parser.pos;
    var item = (void 0), partial = (void 0);

    if ((partial = parser.read(PARTIAL_READERS))) {
      if (partials[partial.n]) {
        parser.pos = pos;
        parser.error('Duplicated partial definition');
      }

      cleanup(
        partial.f,
        parser.stripComments,
        preserveWhitespace,
        !preserveWhitespace,
        !preserveWhitespace,
        parser.whiteSpaceElements
      );

      partials[partial.n] = partial.f;
      hasPartials = true;
    } else if ((item = parser.read(READERS))) {
      fragment.push(item);
    } else {
      parser.error('Unexpected template content');
    }
  }

  var result = {
    v: TEMPLATE_VERSION,
    t: fragment
  };

  if (hasPartials) {
    result.p = partials;
  }

  return result;
}

function insertExpressions(obj, expr) {
  keys(obj).forEach(function (key) {
    if (isExpression(key, obj)) { return addTo(obj, expr); }

    var ref = obj[key];
    if (hasChildren(ref)) { insertExpressions(ref, expr); }
  });
}

function isExpression(key, obj) {
  return key === 's' && isArray(obj.r);
}

function addTo(obj, expr) {
  var s = obj.s;
  var r = obj.r;
  if (!expr[s]) { expr[s] = fromExpression(s, r.length); }
}

function hasChildren(ref) {
  return isArray(ref) || isObject(ref);
}

var shared = {};

// See https://github.com/ractivejs/template-spec for information
// about the Ractive template specification

var STANDARD_READERS = [
  readPartial,
  readUnescaped,
  readSection,
  readInterpolator,
  readComment
];
var TRIPLE_READERS = [readTriple];

var READERS = [readMustache, readHtmlComment, readElement$1, readText];
var PARTIAL_READERS = [readPartialDefinitionSection];

var preserveWhitespaceElements = { pre: 1, script: 1, style: 1, textarea: 1 };

var defaultInterpolate = { textarea: true, script: true, style: true, template: true };

var StandardParser = Parser.extend({
  init: function init(str, options) {
    var tripleDelimiters = options.tripleDelimiters || shared.defaults.tripleDelimiters;
    var staticDelimiters = options.staticDelimiters || shared.defaults.staticDelimiters;
    var staticTripleDelimiters =
      options.staticTripleDelimiters || shared.defaults.staticTripleDelimiters;

    this.standardDelimiters = options.delimiters || shared.defaults.delimiters;

    this.tags = [
      {
        isStatic: false,
        isTriple: false,
        open: this.standardDelimiters[0],
        close: this.standardDelimiters[1],
        readers: STANDARD_READERS
      },
      {
        isStatic: false,
        isTriple: true,
        open: tripleDelimiters[0],
        close: tripleDelimiters[1],
        readers: TRIPLE_READERS
      },
      {
        isStatic: true,
        isTriple: false,
        open: staticDelimiters[0],
        close: staticDelimiters[1],
        readers: STANDARD_READERS
      },
      {
        isStatic: true,
        isTriple: true,
        open: staticTripleDelimiters[0],
        close: staticTripleDelimiters[1],
        readers: TRIPLE_READERS
      }
    ];

    this.contextLines = options.contextLines || shared.defaults.contextLines;

    this.sortMustacheTags();

    this.sectionDepth = 0;
    this.elementStack = [];

    this.interpolate = assign(
      {},
      defaultInterpolate,
      shared.defaults.interpolate,
      options.interpolate
    );

    if (options.sanitize === true) {
      options.sanitize = {
        // blacklist from https://code.google.com/p/google-caja/source/browse/trunk/src/com/google/caja/lang/html/html4-elements-whitelist.json
        elements: 'applet base basefont body frame frameset head html isindex link meta noframes noscript object param script style title'.split(
          ' '
        ),
        eventAttributes: true
      };
    }

    this.stripComments = options.stripComments !== false;
    this.preserveWhitespace = isObjectType(options.preserveWhitespace)
      ? false
      : options.preserveWhitespace;
    this.sanitizeElements = options.sanitize && options.sanitize.elements;
    this.sanitizeEventAttributes = options.sanitize && options.sanitize.eventAttributes;
    this.includeLinePositions = options.includeLinePositions;
    this.textOnlyMode = options.textOnlyMode;
    this.csp = options.csp;
    this.allowExpressions = options.allowExpressions;

    if (options.expression) { this.converters = [readExpression]; }

    if (options.attributes) { this.inTag = true; }

    // special whitespace handling requested for certain elements
    this.whiteSpaceElements = assign({}, options.preserveWhitespace, preserveWhitespaceElements);
  },

  postProcess: function postProcess(result, options) {
    var parserResult = result[0];

    if (options.expression) {
      var expr = flattenExpression(parserResult);
      expr.e = fromExpression(expr.s, expr.r.length);
      return expr;
    } else {
      // special case - empty string
      if (!result.length) {
        return { t: [], v: TEMPLATE_VERSION };
      }

      if (this.sectionDepth > 0) {
        this.error('A section was left open');
      }

      cleanup(
        parserResult.t,
        this.stripComments,
        this.preserveWhitespace,
        !this.preserveWhitespace,
        !this.preserveWhitespace,
        this.whiteSpaceElements
      );

      if (this.csp !== false) {
        var expr$1 = {};

        insertExpressions(parserResult.t, expr$1);
        insertExpressions(parserResult.p || {}, expr$1);

        if (keys(expr$1).length) { parserResult.e = expr$1; }
      }

      return parserResult;
    }
  },

  converters: [readTemplate],

  sortMustacheTags: function sortMustacheTags() {
    // Sort in order of descending opening delimiter length (longer first),
    // to protect against opening delimiters being substrings of each other
    this.tags.sort(function (a, b) {
      return b.open.length - a.open.length;
    });
  }
});

function parse(template, options) {
  return new StandardParser(template, options || {}).result;
}

var parseOptions = [
  'delimiters',
  'tripleDelimiters',
  'staticDelimiters',
  'staticTripleDelimiters',
  'csp',
  'interpolate',
  'preserveWhitespace',
  'sanitize',
  'stripComments',
  'contextLines',
  'allowExpressions',
  'attributes'
];

var TEMPLATE_INSTRUCTIONS = "Either preparse or use a ractive runtime source that includes the parser. ";

var COMPUTATION_INSTRUCTIONS = "Either include a version of Ractive that can parse or convert your computation strings to functions.";

function throwNoParse(method, error, instructions) {
  if (!method) {
    fatal(("Missing Ractive.parse - cannot parse " + error + ". " + instructions));
  }
}

function createFunction(body, length) {
  throwNoParse(fromExpression, 'new expression function', TEMPLATE_INSTRUCTIONS);
  return fromExpression(body, length);
}

function createFunctionFromString(str, bindTo) {
  throwNoParse(parse, 'compution string "${str}"', COMPUTATION_INSTRUCTIONS);
  var tpl = parse(str, { expression: true });
  return function() {
    return tpl.e.apply(bindTo, tpl.r.map(function (r) { return bindTo.get(r); }));
  };
}

var parser = {
  fromId: function fromId(id, options) {
    if (!doc) {
      if (options && options.noThrow) {
        return;
      }
      throw new Error(("Cannot retrieve template #" + id + " as Ractive is not running in a browser."));
    }

    if (id) { id = id.replace(/^#/, ''); }

    var template;

    if (!(template = doc.getElementById(id))) {
      if (options && options.noThrow) {
        return;
      }
      throw new Error(("Could not find template element with id #" + id));
    }

    if (template.tagName.toUpperCase() !== 'SCRIPT') {
      if (options && options.noThrow) {
        return;
      }
      throw new Error(("Template element with id #" + id + ", must be a <script> element"));
    }

    return 'textContent' in template ? template.textContent : template.innerHTML;
  },

  isParsed: function isParsed(template) {
    return !isString(template);
  },

  getParseOptions: function getParseOptions(ractive) {
    // Could be Ractive or a Component
    if (ractive.defaults) {
      ractive = ractive.defaults;
    }

    return parseOptions.reduce(function (val, key) {
      val[key] = ractive[key];
      return val;
    }, {});
  },

  parse: function parse$1(template, options) {
    throwNoParse(parse, 'template', TEMPLATE_INSTRUCTIONS);
    var parsed = parse(template, options);
    addFunctions(parsed);
    return parsed;
  },

  parseFor: function parseFor(template, ractive) {
    return this.parse(template, this.getParseOptions(ractive));
  }
};

function getComputationSignature(ractive, key, signature) {
  var getter;
  var setter;

  // useful for debugging
  var getterString;
  var getterUseStack;
  var setterString;

  if (isFunction(signature)) {
    getter = bind(signature, ractive);
    getterString = signature.toString();
    getterUseStack = true;
  }

  if (isString(signature)) {
    getter = createFunctionFromString(signature, ractive);
    getterString = signature;
  }

  if (isObjectType(signature)) {
    if (isString(signature.get)) {
      getter = createFunctionFromString(signature.get, ractive);
      getterString = signature.get;
    } else if (isFunction(signature.get)) {
      getter = bind(signature.get, ractive);
      getterString = signature.get.toString();
      getterUseStack = true;
    } else {
      fatal('`%s` computation must have a `get()` method', key);
    }

    if (isFunction(signature.set)) {
      setter = bind(signature.set, ractive);
      setterString = signature.set.toString();
    }
  }

  return {
    getter: getter,
    setter: setter,
    getterString: getterString,
    setterString: setterString,
    getterUseStack: getterUseStack
  };
}

var id = 0;

var TransitionManager = function TransitionManager(callback, parent) {
  this.callback = callback;
  this.parent = parent;

  this.intros = [];
  this.outros = [];

  this.children = [];
  this.totalChildren = this.outroChildren = 0;

  this.detachQueue = [];
  this.outrosComplete = false;

  this.id = id++;

  if (parent) {
    parent.addChild(this);
  }
};
var TransitionManager__proto__ = TransitionManager.prototype;

TransitionManager__proto__.add = function add (transition) {
  var list = transition.isIntro ? this.intros : this.outros;
  transition.starting = true;
  list.push(transition);
};

TransitionManager__proto__.addChild = function addChild (child) {
  this.children.push(child);

  this.totalChildren += 1;
  this.outroChildren += 1;
};

TransitionManager__proto__.checkStart = function checkStart () {
  if (this.parent && this.parent.started) { this.start(); }
};

TransitionManager__proto__.decrementOutros = function decrementOutros () {
  this.outroChildren -= 1;
  check(this);
};

TransitionManager__proto__.decrementTotal = function decrementTotal () {
  this.totalChildren -= 1;
  check(this);
};

TransitionManager__proto__.detachNodes = function detachNodes () {
    var this$1 = this;

  var len = this.detachQueue.length;
  for (var i = 0; i < len; i++) { this$1.detachQueue[i].detach(); }
  len = this.children.length;
  for (var i$1 = 0; i$1 < len; i$1++) { this$1.children[i$1].detachNodes(); }
  this.detachQueue = [];
};

TransitionManager__proto__.ready = function ready () {
  if (this.detachQueue.length) { detachImmediate(this); }
};

TransitionManager__proto__.remove = function remove (transition) {
  var list = transition.isIntro ? this.intros : this.outros;
  removeFromArray(list, transition);
  check(this);
};

TransitionManager__proto__.start = function start () {
  this.started = true;
  this.children.forEach(function (c) { return c.start(); });
  this.intros.concat(this.outros).forEach(function (t) { return t.start(); });
  check(this);
};

function check(tm) {
  if (!tm.started || tm.outros.length || tm.outroChildren) { return; }

  // If all outros are complete, and we haven't already done this,
  // we notify the parent if there is one, otherwise
  // start detaching nodes
  if (!tm.outrosComplete) {
    tm.outrosComplete = true;

    if (tm.parent) { tm.parent.decrementOutros(tm); }

    if (!tm.parent || tm.parent.outrosComplete) {
      tm.detachNodes();
    }
  }

  // Once everything is done, we can notify parent transition
  // manager and call the callback
  if (!tm.intros.length && !tm.totalChildren) {
    if (isFunction(tm.callback)) {
      tm.callback();
    }

    if (tm.parent && !tm.notifiedTotal) {
      tm.notifiedTotal = true;
      tm.parent.decrementTotal();
    }
  }
}

// check through the detach queue to see if a node is up or downstream from a
// transition and if not, go ahead and detach it
function detachImmediate(manager) {
  var queue = manager.detachQueue;
  var outros = collectAllOutros(manager);

  if (!outros.length) {
    manager.detachNodes();
  } else {
    var i = queue.length;
    var j = 0;
    var node, trans;
    var nqueue = (manager.detachQueue = []);

    start: while (i--) {
      node = queue[i].node;
      j = outros.length;
      while (j--) {
        trans = outros[j].element.node;
        // check to see if the node is, contains, or is contained by the transitioning node
        if (trans === node || trans.contains(node) || node.contains(trans)) {
          nqueue.push(queue[i]);
          continue start;
        }
      }

      // no match, we can drop it
      queue[i].detach();
    }
  }
}

function collectAllOutros(manager, _list) {
  var list = _list;

  // if there's no list, we're starting at the root to build one
  if (!list) {
    list = [];
    var parent = manager;
    while (parent.parent) { parent = parent.parent; }
    return collectAllOutros(parent, list);
  } else {
    // grab all outros from child managers
    var i = manager.children.length;
    while (i--) {
      list = collectAllOutros(manager.children[i], list);
    }

    // grab any from this manager if there are any
    if (manager.outros.length) { list = list.concat(manager.outros); }

    return list;
  }
}

var batch;

var runloop = {
  active: function active() {
    return !!batch;
  },

  start: function start() {
    var fulfilPromise;
    var promise = new Promise(function (f) { return (fulfilPromise = f); });

    batch = {
      previousBatch: batch,
      transitionManager: new TransitionManager(fulfilPromise, batch && batch.transitionManager),
      fragments: [],
      tasks: [],
      immediateObservers: [],
      deferredObservers: [],
      promise: promise
    };

    return promise;
  },

  end: function end() {
    flushChanges();

    if (!batch.previousBatch) { batch.transitionManager.start(); }
    else { batch.transitionManager.checkStart(); }

    batch = batch.previousBatch;
  },

  addFragment: function addFragment(fragment) {
    addToArray(batch.fragments, fragment);
  },

  // TODO: come up with a better way to handle fragments that trigger their own update
  addFragmentToRoot: function addFragmentToRoot(fragment) {
    if (!batch) { return; }

    var b = batch;
    while (b.previousBatch) {
      b = b.previousBatch;
    }

    addToArray(b.fragments, fragment);
  },

  addObserver: function addObserver(observer, defer) {
    if (!batch) {
      observer.dispatch();
    } else {
      addToArray(defer ? batch.deferredObservers : batch.immediateObservers, observer);
    }
  },

  registerTransition: function registerTransition(transition) {
    transition._manager = batch.transitionManager;
    batch.transitionManager.add(transition);
  },

  // synchronise node detachments with transition ends
  detachWhenReady: function detachWhenReady(thing) {
    batch.transitionManager.detachQueue.push(thing);
  },

  scheduleTask: function scheduleTask(task, postRender) {
    var _batch;

    if (!batch) {
      task();
    } else {
      _batch = batch;
      while (postRender && _batch.previousBatch) {
        // this can't happen until the DOM has been fully updated
        // otherwise in some situations (with components inside elements)
        // transitions and decorators will initialise prematurely
        _batch = _batch.previousBatch;
      }

      _batch.tasks.push(task);
    }
  },

  promise: function promise() {
    if (!batch) { return Promise.resolve(); }

    var target = batch;
    while (target.previousBatch) {
      target = target.previousBatch;
    }

    return target.promise || Promise.resolve();
  }
};

function dispatch(observer) {
  observer.dispatch();
}

function flushChanges() {
  var which = batch.immediateObservers;
  batch.immediateObservers = [];
  which.forEach(dispatch);

  // Now that changes have been fully propagated, we can update the DOM
  // and complete other tasks
  var i = batch.fragments.length;
  var fragment;

  which = batch.fragments;
  batch.fragments = [];

  while (i--) {
    fragment = which[i];
    fragment.update();
  }

  batch.transitionManager.ready();

  which = batch.deferredObservers;
  batch.deferredObservers = [];
  which.forEach(dispatch);

  var tasks = batch.tasks;
  batch.tasks = [];

  for (i = 0; i < tasks.length; i += 1) {
    tasks[i]();
  }

  // If updating the view caused some model blowback - e.g. a triple
  // containing <option> elements caused the binding on the <select>
  // to update - then we start over
  if (
    batch.fragments.length ||
    batch.immediateObservers.length ||
    batch.deferredObservers.length ||
    batch.tasks.length
  )
    { return flushChanges(); }
}

// TODO what happens if a transition is aborted?

var tickers = [];
var running = false;

function tick() {
  runloop.start();

  var now = performance.now();

  var i;
  var ticker;

  for (i = 0; i < tickers.length; i += 1) {
    ticker = tickers[i];

    if (!ticker.tick(now)) {
      // ticker is complete, remove it from the stack, and decrement i so we don't miss one
      tickers.splice(i--, 1);
    }
  }

  runloop.end();

  if (tickers.length) {
    requestAnimationFrame(tick);
  } else {
    running = false;
  }
}

var Ticker = function Ticker(options) {
  this.duration = options.duration;
  this.step = options.step;
  this.complete = options.complete;
  this.easing = options.easing;

  this.start = performance.now();
  this.end = this.start + this.duration;

  this.running = true;

  tickers.push(this);
  if (!running) { requestAnimationFrame(tick); }
};
var Ticker__proto__ = Ticker.prototype;

Ticker__proto__.tick = function tick (now) {
  if (!this.running) { return false; }

  if (now > this.end) {
    if (this.step) { this.step(1); }
    if (this.complete) { this.complete(1); }

    return false;
  }

  var elapsed = now - this.start;
  var eased = this.easing(elapsed / this.duration);

  if (this.step) { this.step(eased); }

  return true;
};

Ticker__proto__.stop = function stop () {
  if (this.abort) { this.abort(); }
  this.running = false;
};

var prefixers = {};

// TODO this is legacy. sooner we can replace the old adaptor API the better
/* istanbul ignore next */
function prefixKeypath(obj, prefix) {
  var prefixed = {};

  if (!prefix) {
    return obj;
  }

  prefix += '.';

  for (var key in obj) {
    if (hasOwn(obj, key)) {
      prefixed[prefix + key] = obj[key];
    }
  }

  return prefixed;
}

function getPrefixer(rootKeypath) {
  var rootDot;

  if (!prefixers[rootKeypath]) {
    rootDot = rootKeypath ? rootKeypath + '.' : '';

    /* istanbul ignore next */
    prefixers[rootKeypath] = function(relativeKeypath, value) {
      var obj;

      if (isString(relativeKeypath)) {
        obj = {};
        obj[rootDot + relativeKeypath] = value;
        return obj;
      }

      if (isObjectType(relativeKeypath)) {
        // 'relativeKeypath' is in fact a hash, not a keypath
        return rootDot ? prefixKeypath(relativeKeypath, rootKeypath) : relativeKeypath;
      }
    };
  }

  return prefixers[rootKeypath];
}

var shared$1 = {};

var Model = (function (ModelBase) {
  function Model(parent, key) {
    ModelBase.call(this, parent);

    this.ticker = null;

    if (parent) {
      this.key = unescapeKey(key);
      this.isReadonly = parent.isReadonly;

      if (parent.value) {
        this.value = parent.value[this.key];
        if (isArray(this.value)) { this.length = this.value.length; }
        this.adapt();
      }
    }
  }

  if ( ModelBase ) Model.__proto__ = ModelBase;
  var Model__proto__ = Model.prototype = Object.create( ModelBase && ModelBase.prototype );
  Model__proto__.constructor = Model;

  Model__proto__.adapt = function adapt () {
    var this$1 = this;

    var adaptors = this.root.adaptors;
    var len = adaptors.length;

    this.rewrap = false;

    // Exit early if no adaptors
    if (len === 0) { return; }

    var value = this.wrapper
      ? 'newWrapperValue' in this
        ? this.newWrapperValue
        : this.wrapperValue
      : this.value;

    // TODO remove this legacy nonsense
    var ractive = this.root.ractive;
    var keypath = this.getKeypath();

    // tear previous adaptor down if present
    if (this.wrapper) {
      var shouldTeardown =
        this.wrapperValue === value
          ? false
          : !this.wrapper.reset || this.wrapper.reset(value) === false;

      if (shouldTeardown) {
        this.wrapper.teardown();
        delete this.wrapper;
        delete this.wrapperValue;
        delete this.newWrapperValue;

        // don't branch for undefined values
        if (this.value !== undefined) {
          var parentValue = this.parent.value || this.parent.createBranch(this.key);
          if (parentValue[this.key] !== value) { parentValue[this.key] = value; }
          this.value = value;
        }
      } else {
        delete this.newWrapperValue;
        this.value = this.wrapper.get();
        return;
      }
    }

    var i;

    for (i = 0; i < len; i += 1) {
      var adaptor = adaptors[i];
      if (adaptor.filter(value, keypath, ractive)) {
        this$1.wrapper = adaptor.wrap(ractive, value, keypath, getPrefixer(keypath));
        this$1.wrapperValue = value;
        this$1.wrapper.__model = this$1; // massive temporary hack to enable array adaptor

        this$1.value = this$1.wrapper.get();

        break;
      }
    }
  };

  Model__proto__.animate = function animate (from, to, options, interpolator) {
    var this$1 = this;

    if (this.ticker) { this.ticker.stop(); }

    var fulfilPromise;
    var promise = new Promise(function (fulfil) { return (fulfilPromise = fulfil); });

    this.ticker = new Ticker({
      duration: options.duration,
      easing: options.easing,
      step: function (t) {
        var value = interpolator(t);
        this$1.applyValue(value);
        if (options.step) { options.step(t, value); }
      },
      complete: function () {
        this$1.applyValue(to);
        if (options.complete) { options.complete(to); }

        this$1.ticker = null;
        fulfilPromise(to);
      }
    });

    promise.stop = this.ticker.stop;
    return promise;
  };

  Model__proto__.applyValue = function applyValue (value, notify) {
    if ( notify === void 0 ) notify = true;

    if (isEqual(value, this.value)) { return; }
    if (this.boundValue) { this.boundValue = null; }

    if (this.parent.wrapper && this.parent.wrapper.set) {
      this.parent.wrapper.set(this.key, value);
      this.parent.value = this.parent.wrapper.get();

      this.value = this.parent.value[this.key];
      if (this.wrapper) { this.newWrapperValue = this.value; }
      this.adapt();
    } else if (this.wrapper) {
      this.newWrapperValue = value;
      this.adapt();
    } else {
      var parentValue = this.parent.value || this.parent.createBranch(this.key);
      if (isObjectLike(parentValue)) {
        parentValue[this.key] = value;
      } else {
        warnIfDebug(("Attempted to set a property of a non-object '" + (this.getKeypath()) + "'"));
        return;
      }

      this.value = value;
      this.adapt();
    }

    if (this.dataModel || (value && value.viewmodel && value.viewmodel.isRoot)) {
      checkDataLink(this, value);
    }

    // keep track of array stuff
    if (isArray(value)) {
      this.length = value.length;
      this.isArray = true;
    } else {
      this.isArray = false;
    }

    // notify dependants
    this.links.forEach(handleChange);
    this.children.forEach(mark);
    this.deps.forEach(handleChange);

    if (notify) { this.notifyUpstream(); }

    if (this.parent.isArray) {
      if (this.key === 'length') { this.parent.length = value; }
      else { this.parent.joinKey('length').mark(); }
    }
  };

  Model__proto__.compute = function compute (key, computed) {
    var registry = this.computed || (this.computed = {});

    if (registry[key]) {
      registry[key].signature = getComputationSignature(this.root.ractive, key, computed);
      registry[key].mark();
    } else {
      registry[key] = new shared$1.Computation(
        this,
        getComputationSignature(this.root.ractive, key, computed),
        key
      );
    }

    return registry[key];
  };

  Model__proto__.createBranch = function createBranch (key) {
    var branch = isNumeric(key) ? [] : {};
    this.applyValue(branch, false);

    return branch;
  };

  Model__proto__.get = function get (shouldCapture, opts) {
    if (this._link) { return this._link.get(shouldCapture, opts); }
    if (shouldCapture) { capture(this); }
    // if capturing, this value needs to be unwrapped because it's for external use
    if (opts && opts.virtual) { return this.getVirtual(false); }
    return maybeBind(
      this,
      (opts && 'unwrap' in opts ? opts.unwrap !== false : shouldCapture) && this.wrapper
        ? this.wrapperValue
        : this.value,
      !opts || opts.shouldBind !== false
    );
  };

  Model__proto__.joinKey = function joinKey (key, opts) {
    var this$1 = this;

    if (this._link) {
      if (opts && opts.lastLink !== false && (isUndefined(key) || key === '')) { return this; }
      return this._link.joinKey(key);
    }

    if (isUndefined(key) || key === '') { return this; }

    var child;
    if (hasOwn(this.childByKey, key)) { child = this.childByKey[key]; }
    else { child = this.computed && this.computed[key]; }

    if (!child) {
      var computed;
      if (this.isRoot && this.ractive && (computed = this.ractive.computed[key])) {
        child = this.compute(key, computed);
      } else if (!this.isRoot && this.root.ractive) {
        var registry = this.root.ractive.computed;
        for (var k in registry) {
          computed = registry[k];
          if (computed.pattern && computed.pattern.test(this$1.getKeypath() + '.' + key)) {
            child = this$1.compute(key, computed);
          }
        }
      }
    }

    if (!child) {
      child = new Model(this, key);
      this.children.push(child);
      this.childByKey[key] = child;

      if (key === 'data') {
        var val = this.retrieve();
        if (val && val.viewmodel && val.viewmodel.isRoot) {
          child.link(val.viewmodel, 'data');
          this.dataModel = val;
        }
      }
    }

    if (child._link && (!opts || opts.lastLink !== false)) { return child._link; }

    return child;
  };

  Model__proto__.mark = function mark$1 (force) {
    if (this._link) { return this._link.mark(force); }

    var old = this.value;
    var value = this.retrieve();

    if (this.dataModel || (value && value.viewmodel && value.viewmodel.isRoot)) {
      checkDataLink(this, value);
    }

    if (force || !isEqual(value, old)) {
      this.value = value;
      if (this.boundValue) { this.boundValue = null; }

      // make sure the wrapper stays in sync
      if (old !== value || this.rewrap) {
        if (this.wrapper) { this.newWrapperValue = value; }
        this.adapt();
      }

      // keep track of array stuff
      if (isArray(value)) {
        this.length = value.length;
        this.isArray = true;
      } else {
        this.isArray = false;
      }

      this.children.forEach(force ? markForce : mark);
      this.links.forEach(marked);

      this.deps.forEach(handleChange);
    }
  };

  Model__proto__.merge = function merge (array, comparator) {
    var newIndices = buildNewIndices(
      this.value === array ? recreateArray(this) : this.value,
      array,
      comparator
    );
    this.parent.value[this.key] = array;
    this.shuffle(newIndices, true);
  };

  Model__proto__.retrieve = function retrieve () {
    return this.parent.value ? this.parent.value[this.key] : undefined;
  };

  Model__proto__.set = function set (value) {
    if (this.ticker) { this.ticker.stop(); }
    this.applyValue(value);
  };

  Model__proto__.shuffle = function shuffle$2 (newIndices, unsafe) {
    shuffle(this, newIndices, false, unsafe);
  };

  Model__proto__.source = function source () {
    return this;
  };

  Model__proto__.teardown = function teardown$4 () {
    var this$1 = this;

    if (this._link) {
      this._link.teardown();
      this._link = null;
    }
    this.children.forEach(teardown);
    if (this.wrapper) { this.wrapper.teardown(); }
    if (this.computed) { keys(this.computed).forEach(function (k) { return this$1.computed[k].teardown(); }); }
  };

  return Model;
}(ModelBase));

function recreateArray(model) {
  var array = [];

  for (var i = 0; i < model.length; i++) {
    array[i] = (model.childByKey[i] || {}).value;
  }

  return array;
}

/* global global */
var data = {};

var SharedModel = (function (Model) {
  function SharedModel(value, name, ractive) {
    Model.call(this, null, ("@" + name));
    this.key = "@" + name;
    this.value = value;
    this.isRoot = true;
    this.root = this;
    this.adaptors = [];
    this.ractive = ractive;
  }

  if ( Model ) SharedModel.__proto__ = Model;
  var SharedModel__proto__ = SharedModel.prototype = Object.create( Model && Model.prototype );
  SharedModel__proto__.constructor = SharedModel;

  SharedModel__proto__.getKeypath = function getKeypath () {
    return this.key;
  };

  SharedModel__proto__.retrieve = function retrieve () {
    return this.value;
  };

  return SharedModel;
}(Model));

var SharedModel$1 = new SharedModel(data, 'shared');

var GlobalModel = new SharedModel(base, 'global');

function findContext(fragment) {
  var frag = fragment;
  while (frag && !frag.context && !frag.aliases) { frag = frag.parent; }
  return frag;
}

function resolveReference(fragment, ref) {
  var initialFragment = fragment;
  // current context ref
  if (ref === '.') { return fragment.findContext(); }

  // ancestor references
  if (ref[0] === '~') { return fragment.ractive.viewmodel.joinAll(splitKeypath(ref.slice(2))); }

  // scoped references
  if (ref[0] === '.' || ref[0] === '^') {
    var frag = fragment;
    var parts = ref.split('/');
    var explicitContext = parts[0] === '^^';

    // find nearest context node
    while (frag && !frag.context) {
      frag = up(frag);
    }
    var context$1 = frag && frag.context;

    // walk up the context chain
    while (frag && parts[0] === '^^') {
      parts.shift();

      // the current fragment should always be a context,
      // and if it happens to be an iteration, jump above the each block
      if (frag.isIteration) {
        frag = frag.parent.parent;
      } else {
        // otherwise jump above the current fragment
        frag = up(frag);
      }

      // walk to the next contexted fragment
      while (frag && !frag.context) {
        frag = up(frag);
      }
      context$1 = frag && frag.context;
    }

    if (!context$1 && explicitContext) {
      throw new Error(
        ("Invalid context parent reference ('" + ref + "'). There is not context at that level.")
      );
    }

    // walk up the context path
    while (parts[0] === '.' || parts[0] === '..') {
      var part = parts.shift();

      if (part === '..') {
        context$1 = context$1.parent;
      }
    }

    ref = parts.join('/');

    // special case - `{{.foo}}` means the same as `{{./foo}}`
    if (ref[0] === '.') { ref = ref.slice(1); }
    return context$1.joinAll(splitKeypath(ref));
  }

  var keys$$1 = splitKeypath(ref);
  if (!keys$$1.length) { return; }
  var base = keys$$1.shift();

  // special refs
  if (base[0] === '@') {
    // shorthand from outside the template
    // @this referring to local ractive instance
    if (base === '@this' || base === '@') {
      return fragment.ractive.viewmodel.getRactiveModel().joinAll(keys$$1);
    } else if (base === '@index' || base === '@key') {
      // @index or @key referring to the nearest repeating index or key
      if (keys$$1.length) { badReference(base); }
      var repeater = findIter(fragment);
      return repeater && repeater[("get" + (base[1] === 'i' ? 'Index' : 'Key'))]();
    } else if (base === '@last') {
      var repeater$1 = findIter(fragment);
      return repeater$1 && repeater$1.parent.getLast();
    } else if (base === '@global') {
      // @global referring to window or global
      return GlobalModel.joinAll(keys$$1);
    } else if (base === '@shared') {
      // @global referring to window or global
      return SharedModel$1.joinAll(keys$$1);
    } else if (base === '@keypath' || base === '@rootpath') {
      // @keypath or @rootpath, the current keypath string
      var root = ref[1] === 'r' ? fragment.ractive.root : null;
      var f = fragment;

      while (
        f &&
        (!f.context || (f.isRoot && f.ractive.component && (root || !f.ractive.isolated)))
      ) {
        f = f.isRoot ? f.componentParent : f.parent;
      }

      return f.getKeypath(root);
    } else if (base === '@context') {
      return new SharedModel(fragment.getContext(), 'context').joinAll(keys$$1);
    } else if (base === '@local') {
      // @context-local data
      return fragment.getContext()._data.joinAll(keys$$1);
    } else if (base === '@style') {
      // @style shared model
      return fragment.ractive.constructor._cssModel.joinAll(keys$$1);
    } else if (base === '@helpers') {
      // @helpers instance model
      return fragment.ractive.viewmodel.getHelpers().joinAll(keys$$1);
    } else if (base === '@macro') {
      var handle = findMacro(fragment);
      if (handle) { return new SharedModel(handle, 'macro').joinAll(keys$$1); }
      else { return; }
    } else {
      // nope
      throw new Error(("Invalid special reference '" + base + "'"));
    }
  }

  // helpers
  if (base && !keys$$1.length) {
    var helpers = fragment.ractive.viewmodel.getHelpers();
    if (helpers.has(base)) { return helpers.joinKey(base); }
  }

  var context = findContext(fragment);

  // check immediate context for a match
  if (context) {
    if (context.context) {
      context = context.context;
    } else {
      // alias block, so get next full context for later
      context = fragment.findContext();
    }
  } else {
    context = fragment.findContext();
  }

  // walk up the fragment hierarchy looking for a matching ref, alias, or key in a context
  var createMapping = false;
  var shouldWarn = fragment.ractive.warnAboutAmbiguity;
  var crossed = 0;
  var model;

  while (fragment) {
    // repeated fragments
    if (fragment.isIteration) {
      if (base === fragment.parent.keyRef) {
        model = fragment.getKey();
      } else if (base === fragment.parent.indexRef) {
        model = fragment.getIndex();
      }

      if (model && keys$$1.length) { badReference(base); }
    }

    // alias node or iteration
    if (!model && fragment.aliases && hasOwn(fragment.aliases, base)) {
      model = fragment.aliases[base];
    }

    // check fragment context to see if it has the key we need
    if (!model && fragment.context && fragment.context.has(base)) {
      model = fragment.context.joinKey(base);

      // this is an implicit mapping
      if (createMapping) {
        if (shouldWarn)
          { warnIfDebug(
            ("'" + ref + "' resolved but is ambiguous and will create a mapping to a parent component.")
          ); }
      } else if (shouldWarn && crossed) { warnIfDebug(("'" + ref + "' resolved but is ambiguous.")); }
    }

    if (model) {
      if (createMapping) {
        model = initialFragment.ractive.viewmodel.createLink(base, model, base, { implicit: true });
      }

      if (keys$$1.length > 0 && isFunction(model.joinAll)) {
        model = model.joinAll(keys$$1);
      }

      return model;
    }

    // don't consider alias blocks when checking for ambiguity
    if (fragment.context && !fragment.aliases) { crossed = 1; }

    if (
      (fragment.componentParent || (!fragment.parent && fragment.ractive.component)) &&
      !fragment.ractive.isolated
    ) {
      // ascend through component boundary
      fragment = fragment.componentParent || fragment.ractive.component.up;
      createMapping = true;
    } else {
      fragment = fragment.parent;
    }
  }

  // if enabled, check the instance for a match
  var instance = initialFragment.ractive;
  if (instance.resolveInstanceMembers && base !== 'data' && base in instance) {
    return instance.viewmodel
      .getRactiveModel()
      .joinKey(base)
      .joinAll(keys$$1);
  }

  if (shouldWarn) {
    warnIfDebug(("'" + ref + "' is ambiguous and did not resolve."));
  }

  // didn't find anything, so go ahead and create the key on the local model
  return context.joinKey(base).joinAll(keys$$1);
}

function up(fragment) {
  return fragment && ((!fragment.ractive.isolated && fragment.componentParent) || fragment.parent);
}

function findIter(start) {
  var fragment = start;
  var next;
  while (!fragment.isIteration && (next = up(fragment))) {
    fragment = next;
  }

  return fragment.isIteration && fragment;
}

function findMacro(start) {
  var fragment = start;
  while (fragment) {
    if (fragment.owner.handle) { return fragment.owner.handle; }
    fragment = up(fragment);
  }
}

function badReference(key) {
  throw new Error(("An index or key reference (" + key + ") cannot have child properties"));
}

var extern = {};

function getRactiveContext(ractive) {
  var assigns = [], len = arguments.length - 1;
  while ( len-- > 0 ) assigns[ len ] = arguments[ len + 1 ];

  var fragment =
    ractive.fragment ||
    ractive._fakeFragment ||
    (ractive._fakeFragment = new FakeFragment(ractive));
  return fragment.getContext.apply(fragment, assigns);
}

function getContext() {
  var assigns = [], len = arguments.length;
  while ( len-- ) assigns[ len ] = arguments[ len ];

  if (!this.ctx) { this.ctx = new extern.Context(this); }
  assigns.unshift(create(this.ctx));
  return assign.apply(null, assigns);
}

var FakeFragment = function FakeFragment(ractive) {
  this.ractive = ractive;
};

FakeFragment.prototype.findContext = function findContext () {
  return this.ractive.viewmodel;
};
var proto = FakeFragment.prototype;
proto.getContext = getContext;
proto.find = proto.findComponent = proto.findAll = proto.findAllComponents = noop;

function findParentWithContext(fragment) {
  var frag = fragment;
  while (frag && !frag.context) { frag = frag.parent; }
  if (!frag) { return fragment && fragment.ractive.fragment; }
  else { return frag; }
}

var keep = false;

function set(pairs, options) {
  var k = keep;

  var deep = options && options.deep;
  var shuffle = options && options.shuffle;
  var promise = runloop.start();
  if (options && 'keep' in options) { keep = options.keep; }

  var i = pairs.length;
  while (i--) {
    var model = pairs[i][0];
    var value = pairs[i][1];
    var keypath = pairs[i][2];

    if (!model) {
      runloop.end();
      throw new Error(("Failed to set invalid keypath '" + keypath + "'"));
    }

    if (deep) { deepSet(model, value); }
    else if (shuffle) {
      var array = value;
      var target = model.get();
      // shuffle target array with itself
      if (!array) { array = target; }

      // if there's not an array there yet, go ahead and set
      if (isUndefined(target)) {
        model.set(array);
      } else {
        if (!isArray(target) || !isArray(array)) {
          runloop.end();
          throw new Error('You cannot merge an array with a non-array');
        }

        var comparator = getComparator(shuffle);
        model.merge(array, comparator);
      }
    } else { model.set(value); }
  }

  runloop.end();

  keep = k;

  return promise;
}

var star = /\*/;
function gather(ractive, keypath, base, isolated) {
  if (!base && (keypath[0] === '.' || keypath[1] === '^')) {
    warnIfDebug(
      "Attempted to set a relative keypath from a non-relative context. You can use a context object to set relative keypaths."
    );
    return [];
  }

  var keys$$1 = splitKeypath(keypath);
  var model = base || ractive.viewmodel;

  if (star.test(keypath)) {
    return model.findMatches(keys$$1);
  } else {
    if (model === ractive.viewmodel) {
      // allow implicit mappings
      if (
        ractive.component &&
        !ractive.isolated &&
        !model.has(keys$$1[0]) &&
        keypath[0] !== '@' &&
        keypath[0] &&
        !isolated
      ) {
        return [resolveReference(ractive.fragment || new FakeFragment(ractive), keypath)];
      } else {
        return [model.joinAll(keys$$1)];
      }
    } else {
      return [model.joinAll(keys$$1)];
    }
  }
}

function build(ractive, keypath, value, isolated) {
  var sets = [];

  // set multiple keypaths in one go
  if (isObject(keypath)) {
    var loop = function ( k ) {
      if (hasOwn(keypath, k)) {
        sets.push.apply(sets, gather(ractive, k, null, isolated).map(function (m) { return [m, keypath[k], k]; }));
      }
    };

    for (var k in keypath) loop( k );
  } else {
    // set a single keypath
    sets.push.apply(sets, gather(ractive, keypath, null, isolated).map(function (m) { return [m, value, keypath]; }));
  }

  return sets;
}

var deepOpts = { virtual: false };
function deepSet(model, value) {
  var dest = model.get(false, deepOpts);

  // if dest doesn't exist, just set it
  if (dest == null || !isObjectType(value)) { return model.set(value); }
  if (!isObjectType(dest)) { return model.set(value); }

  for (var k in value) {
    if (hasOwn(value, k)) {
      deepSet(model.joinKey(k), value[k]);
    }
  }
}

var comparators = {};
function getComparator(option) {
  if (option === true) { return null; } // use existing arrays
  if (isFunction(option)) { return option; }

  if (isString(option)) {
    return comparators[option] || (comparators[option] = function (thing) { return thing[option]; });
  }

  throw new Error('If supplied, options.compare must be a string, function, or true'); // TODO link to docs
}

var errorMessage = 'Cannot add to a non-numeric value';

function add(ractive, keypath, d, options) {
  if (!isString(keypath) || !isNumeric(d)) {
    throw new Error('Bad arguments');
  }

  var sets = build(ractive, keypath, d, options && options.isolated);

  return set(
    sets.map(function (pair) {
      var model = pair[0];
      var add = pair[1];
      var value = model.get();
      if (!isNumeric(add) || !isNumeric(value)) { throw new Error(errorMessage); }
      return [model, value + add];
    })
  );
}

function Ractive$add(keypath, d, options) {
  var num = isNumber(d) ? d : 1;
  var opts = isObjectType(d) ? d : options;
  return add(this, keypath, num, opts);
}

function immediate(value) {
  var result = Promise.resolve(value);
  defineProperty(result, 'stop', { value: noop });
  return result;
}

var linear = easing.linear;

function getOptions(options, instance) {
  options = options || {};

  var easing$$1;
  if (options.easing) {
    easing$$1 = isFunction(options.easing) ? options.easing : instance.easing[options.easing];
  }

  return {
    easing: easing$$1 || linear,
    duration: 'duration' in options ? options.duration : 400,
    complete: options.complete || noop,
    step: options.step || noop,
    interpolator: options.interpolator
  };
}

function animate(ractive, model, to, options) {
  options = getOptions(options, ractive);
  var from = model.get();

  // don't bother animating values that stay the same
  if (isEqual(from, to)) {
    options.complete(options.to);
    return immediate(to);
  }

  var interpolator = interpolate(from, to, ractive, options.interpolator);

  // if we can't interpolate the value, set it immediately
  if (!interpolator) {
    runloop.start();
    model.set(to);
    runloop.end();

    return immediate(to);
  }

  return model.animate(from, to, options, interpolator);
}

function Ractive$animate(keypath, to, options) {
  if (isObjectType(keypath)) {
    var keys$$1 = keys(keypath);

    throw new Error(("ractive.animate(...) no longer supports objects. Instead of ractive.animate({\n  " + (keys$$1.map(function (key) { return ("'" + key + "': " + (keypath[key])); }).join('\n  ')) + "\n}, {...}), do\n\n" + (keys$$1.map(function (key) { return ("ractive.animate('" + key + "', " + (keypath[key]) + ", {...});"); }).join('\n')) + "\n"));
  }

  return animate(this, this.viewmodel.joinAll(splitKeypath(keypath)), to, options);
}

function enqueue(ractive, event) {
  if (ractive.event) {
    ractive._eventQueue.push(ractive.event);
  }

  ractive.event = event;
}

function dequeue(ractive) {
  if (ractive._eventQueue.length) {
    ractive.event = ractive._eventQueue.pop();
  } else {
    ractive.event = null;
  }
}

var initStars = {};
var bubbleStars = {};

// cartesian product of name parts and stars
// adjusted appropriately for special cases
function variants(name, initial) {
  var map = initial ? initStars : bubbleStars;
  if (map[name]) { return map[name]; }

  var parts = name.split('.');
  var result = [];
  var base = false;

  // initial events the implicit namespace of 'this'
  if (initial) {
    parts.unshift('this');
    base = true;
  }

  // use max - 1 bits as a bitmap to pick a part or a *
  // need to skip the full star case if the namespace is synthetic
  var max = Math.pow(2, parts.length) - (initial ? 1 : 0);
  for (var i = 0; i < max; i++) {
    var join = [];
    for (var j = 0; j < parts.length; j++) {
      join.push(1 & (i >> j) ? '*' : parts[j]);
    }
    result.unshift(join.join('.'));
  }

  if (base) {
    // include non-this-namespaced versions
    if (parts.length > 2) {
      result.push.apply(result, variants(name, false));
    } else {
      result.push('*');
      result.push(name);
    }
  }

  map[name] = result;
  return result;
}

function fireEvent(ractive, eventName, context, args) {
  if ( args === void 0 ) args = [];

  if (!eventName) {
    return;
  }

  context.name = eventName;
  args.unshift(context);

  var eventNames = ractive._nsSubs ? variants(eventName, true) : ['*', eventName];

  return fireEventAs(ractive, eventNames, context, args, true);
}

function fireEventAs(ractive, eventNames, context, args, initialFire) {
  if ( initialFire === void 0 ) initialFire = false;

  var bubble = true;

  if (initialFire || ractive._nsSubs) {
    enqueue(ractive, context);

    var i = eventNames.length;
    while (i--) {
      if (eventNames[i] in ractive._subs) {
        bubble = notifySubscribers(ractive, ractive._subs[eventNames[i]], context, args) && bubble;
      }
    }

    dequeue(ractive);
  }

  if (ractive.parent && bubble) {
    if (initialFire && ractive.component) {
      var fullName = ractive.component.name + '.' + eventNames[eventNames.length - 1];
      eventNames = variants(fullName, false);

      if (context && !context.component) {
        context.component = ractive;
      }
    }

    bubble = fireEventAs(ractive.parent, eventNames, context, args);
  }

  return bubble;
}

function notifySubscribers(ractive, subscribers, context, args) {
  var originalEvent = null;
  var stopEvent = false;

  // subscribers can be modified inflight, e.g. "once" functionality
  // so we need to copy to make sure everyone gets called
  subscribers = subscribers.slice();

  for (var i = 0, len = subscribers.length; i < len; i += 1) {
    if (!subscribers[i].off && subscribers[i].handler.apply(ractive, args) === false) {
      stopEvent = true;
    }
  }

  if (context && stopEvent && (originalEvent = context.event)) {
    originalEvent.preventDefault && originalEvent.preventDefault();
    originalEvent.stopPropagation && originalEvent.stopPropagation();
  }

  return !stopEvent;
}

var Hook = function Hook(event) {
  this.event = event;
  this.method = 'on' + event;
};

Hook.prototype.fire = function fire (ractive, arg) {
  var context = getRactiveContext(ractive);
  var method = this.method;

  if (ractive[method]) {
    arg ? ractive[method](context, arg) : ractive[method](context);
  }

  fireEvent(ractive, this.event, context, arg ? [arg, ractive] : [ractive]);
};

function getChildQueue(queue, ractive) {
  return queue[ractive._guid] || (queue[ractive._guid] = []);
}

function fire(hookQueue, ractive) {
  var childQueue = getChildQueue(hookQueue.queue, ractive);

  hookQueue.hook.fire(ractive);

  // queue is "live" because components can end up being
  // added while hooks fire on parents that modify data values.
  while (childQueue.length) {
    fire(hookQueue, childQueue.shift());
  }

  delete hookQueue.queue[ractive._guid];
}

var HookQueue = function HookQueue(event) {
  this.hook = new Hook(event);
  this.inProcess = {};
  this.queue = {};
};
var HookQueue__proto__ = HookQueue.prototype;

HookQueue__proto__.begin = function begin (ractive) {
  this.inProcess[ractive._guid] = true;
};

HookQueue__proto__.end = function end (ractive) {
  var parent = ractive.parent;

  // If this is *isn't* a child of a component that's in process,
  // it should call methods or fire at this point
  if (!parent || !this.inProcess[parent._guid]) {
    fire(this, ractive);
  } else {
    // elsewise, handoff to parent to fire when ready
    getChildQueue(this.queue, parent).push(ractive);
  }

  delete this.inProcess[ractive._guid];
};

var hooks = {};
[
  'construct',
  'config',
  'attachchild',
  'detach',
  'detachchild',
  'insert',
  'complete',
  'reset',
  'render',
  'unrendering',
  'unrender',
  'teardown',
  'destruct',
  'update'
].forEach(function (hook) {
  hooks[hook] = new Hook(hook);
});
hooks.init = new HookQueue('init');

function findAnchors(fragment, name) {
  if ( name === void 0 ) name = null;

  var res = [];

  findAnchorsIn(fragment, name, res);

  return res;
}

function findAnchorsIn(item, name, result) {
  if (item.isAnchor) {
    if (!name || item.name === name) {
      result.push(item);
    }
  } else if (item.items) {
    item.items.forEach(function (i) { return findAnchorsIn(i, name, result); });
  } else if (item.iterations) {
    item.iterations.forEach(function (i) { return findAnchorsIn(i, name, result); });
  } else if (item.fragment && !item.component) {
    findAnchorsIn(item.fragment, name, result);
  }
}

function updateAnchors(instance, name) {
  if ( name === void 0 ) name = null;

  var anchors = findAnchors(instance.fragment, name);
  var idxs = {};
  var children = instance._children.byName;

  anchors.forEach(function (a) {
    var name = a.name;
    if (!(name in idxs)) { idxs[name] = 0; }
    var idx = idxs[name];
    var child = (children[name] || [])[idx];

    if (child && child.lastBound !== a) {
      if (child.lastBound) { child.lastBound.removeChild(child); }
      a.addChild(child);
    }

    idxs[name]++;
  });
}

function unrenderChild(meta) {
  if (meta.instance.fragment.rendered) {
    meta.shouldDestroy = true;
    meta.instance.unrender();
  }
  meta.instance.el = null;
}

function attachChild(child, options) {
  if ( options === void 0 ) options = {};

  var children = this._children;
  var idx;

  if (child.parent && child.parent !== this)
    { throw new Error(
      ("Instance " + (child._guid) + " is already attached to a different instance " + (child.parent._guid) + ". Please detach it from the other instance using detachChild first.")
    ); }
  else if (child.parent)
    { throw new Error(("Instance " + (child._guid) + " is already attached to this instance.")); }

  var meta = {
    instance: child,
    ractive: this,
    name: options.name || child.constructor.name || 'Ractive',
    target: options.target || false,
    bubble: bubble,
    findNextNode: findNextNode
  };
  meta.nameOption = options.name;

  // child is managing itself
  if (!meta.target) {
    meta.up = this.fragment;
    meta.external = true;
  } else {
    var list;
    if (!(list = children.byName[meta.target])) {
      list = [];
      this.set(("@this.children.byName." + (meta.target)), list);
    }
    idx = options.prepend ? 0 : options.insertAt !== undefined ? options.insertAt : list.length;
  }

  child.parent = this;
  child.root = this.root;
  child.component = meta;
  children.push(meta);

  var promise = runloop.start();

  var rm = child.viewmodel.getRactiveModel();
  rm.joinKey('parent', { lastLink: false }).link(this.viewmodel.getRactiveModel());
  rm.joinKey('root', { lastLink: false }).link(this.root.viewmodel.getRactiveModel());

  hooks.attachchild.fire(child);

  if (meta.target) {
    unrenderChild(meta);
    this.splice(("@this.children.byName." + (meta.target)), idx, 0, meta);
    updateAnchors(this, meta.target);
  } else {
    if (!child.isolated) { child.viewmodel.attached(this.fragment); }
  }

  runloop.end();

  promise.ractive = child;
  return promise.then(function () { return child; });
}

function bubble() {
  runloop.addFragment(this.instance.fragment);
}

function findNextNode() {
  if (this.anchor) { return this.anchor.findNextNode(); }
}

function compute(path, computed) {
  this.computed[path] = computed;
  if (isString(computed) || isFunction(computed))
    { computed = this.computed[path] = { get: computed }; }

  var keys = splitKeypath(path);
  if (!~path.indexOf('*')) {
    var last = keys.pop();
    return this.viewmodel.joinAll(keys).compute(last, computed);
  } else {
    computed.pattern = new RegExp(
      '^' +
        keys
          .map(function (k) { return k.replace(/\*\*/g, '(.+)').replace(/\*/g, '((?:\\\\.|[^\\.])+)'); })
          .join('\\.') +
        '$'
    );
  }
}

function Ractive$compute(path, computed) {
  var promise = runloop.start();
  var comp = compute.call(this, path, computed);

  if (comp) {
    var keys = splitKeypath(path);
    if (keys.length === 1 && !comp.isReadonly) {
      comp.set(this.viewmodel.value[keys[0]]);
    }

    var first = keys.reduce(function (a, c) { return a && a.childByKey[c]; }, this.viewmodel);
    if (first) {
      first.rebind(comp, first, false);
      if (first.parent) { delete first.parent.childByKey[first.key]; }
      fireShuffleTasks();
    }
  }

  runloop.end();

  return promise;
}

function Ractive$detach() {
  if (this.isDetached) {
    return this.el;
  }

  if (this.el) {
    removeFromArray(this.el.__ractive_instances__, this);
  }

  this.el = this.fragment.detach();
  this.isDetached = true;

  hooks.detach.fire(this);
  return this.el;
}

function detachChild(child) {
  var children = this._children;
  var meta, index;

  var i = children.length;
  while (i--) {
    if (children[i].instance === child) {
      index = i;
      meta = children[i];
      break;
    }
  }

  if (!meta || child.parent !== this)
    { throw new Error(("Instance " + (child._guid) + " is not attached to this instance.")); }

  var promise = runloop.start();

  if (meta.anchor) { meta.anchor.removeChild(meta); }
  if (!child.isolated) { child.viewmodel.detached(); }

  children.splice(index, 1);
  if (meta.target) {
    this.splice(
      ("@this.children.byName." + (meta.target)),
      children.byName[meta.target].indexOf(meta),
      1
    );
    updateAnchors(this, meta.target);
  }
  var rm = child.viewmodel.getRactiveModel();
  rm.joinKey('parent', { lastLink: false }).unlink();
  rm.joinKey('root', { lastLink: false }).link(rm);
  child.root = child;
  child.parent = null;
  child.component = null;

  hooks.detachchild.fire(child);

  runloop.end();

  promise.ractive = child;
  return promise.then(function () { return child; });
}

function Ractive$find(selector, options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  if (!this.rendered)
    { throw new Error(
      ("Cannot call ractive.find('" + selector + "') unless instance is rendered to the DOM")
    ); }

  var node = this.fragment.find(selector, options);
  if (node) { return node; }

  if (options.remote) {
    for (var i = 0; i < this._children.length; i++) {
      if (!this$1._children[i].instance.fragment.rendered) { continue; }
      node = this$1._children[i].instance.find(selector, options);
      if (node) { return node; }
    }
  }
}

function Ractive$findAll(selector, options) {
  if ( options === void 0 ) options = {};

  if (!this.rendered)
    { throw new Error(
      ("Cannot call ractive.findAll('" + selector + "', ...) unless instance is rendered to the DOM")
    ); }

  if (!isArray(options.result)) { options.result = []; }

  this.fragment.findAll(selector, options);

  if (options.remote) {
    // seach non-fragment children
    this._children.forEach(function (c) {
      if (!c.target && c.instance.fragment && c.instance.fragment.rendered) {
        c.instance.findAll(selector, options);
      }
    });
  }

  return options.result;
}

function Ractive$findAllComponents(selector, options) {
  if (!options && isObjectType(selector)) {
    options = selector;
    selector = '';
  }

  options = options || {};

  if (!isArray(options.result)) { options.result = []; }

  this.fragment.findAllComponents(selector, options);

  if (options.remote) {
    // search non-fragment children
    this._children.forEach(function (c) {
      if (!c.target && c.instance.fragment && c.instance.fragment.rendered) {
        if (!selector || c.name === selector) {
          options.result.push(c.instance);
        }

        c.instance.findAllComponents(selector, options);
      }
    });
  }

  return options.result;
}

function Ractive$findComponent(selector, options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  if (isObjectType(selector)) {
    options = selector;
    selector = '';
  }

  var child = this.fragment.findComponent(selector, options);
  if (child) { return child; }

  if (options.remote) {
    if (!selector && this._children.length) { return this._children[0].instance; }
    for (var i = 0; i < this._children.length; i++) {
      // skip children that are or should be in an anchor
      if (this$1._children[i].target) { continue; }
      if (this$1._children[i].name === selector) { return this$1._children[i].instance; }
      child = this$1._children[i].instance.findComponent(selector, options);
      if (child) { return child; }
    }
  }
}

function Ractive$findContainer(selector) {
  if (this.container) {
    if (this.container.component && this.container.component.name === selector) {
      return this.container;
    } else {
      return this.container.findContainer(selector);
    }
  }

  return null;
}

function Ractive$findParent(selector) {
  if (this.parent) {
    if (this.parent.component && this.parent.component.name === selector) {
      return this.parent;
    } else {
      return this.parent.findParent(selector);
    }
  }

  return null;
}

function findElement(start, orComponent, name) {
  if ( orComponent === void 0 ) orComponent = true;

  while (
    start &&
    (start.type !== ELEMENT || (name && start.name !== name)) &&
    (!orComponent || (start.type !== COMPONENT && start.type !== ANCHOR))
  ) {
    // start is a fragment - look at the owner
    if (start.owner) { start = start.owner; }
    else if (start.component || start.yield)
      // start is a component or yielder - look at the container
      { start = start.containerFragment || start.component.up; }
    else if (start.parent)
      // start is an item - look at the parent
      { start = start.parent; }
    else if (start.up)
      // start is an item without a parent - look at the parent fragment
      { start = start.up; }
    else { start = undefined; }
  }

  return start;
}

// This function takes an array, the name of a mutator method, and the
// arguments to call that mutator method with, and returns an array that
// maps the old indices to their new indices.

// So if you had something like this...
//
//     array = [ 'a', 'b', 'c', 'd' ];
//     array.push( 'e' );
//
// ...you'd get `[ 0, 1, 2, 3 ]` - in other words, none of the old indices
// have changed. If you then did this...
//
//     array.unshift( 'z' );
//
// ...the indices would be `[ 1, 2, 3, 4, 5 ]` - every item has been moved
// one higher to make room for the 'z'. If you removed an item, the new index
// would be -1...
//
//     array.splice( 2, 2 );
//
// ...this would result in [ 0, 1, -1, -1, 2, 3 ].
//
// This information is used to enable fast, non-destructive shuffling of list
// sections when you do e.g. `ractive.splice( 'items', 2, 2 );

function getNewIndices(length, methodName, args) {
  var newIndices = [];

  var spliceArguments = getSpliceEquivalent(length, methodName, args);

  if (!spliceArguments) {
    return null; // TODO support reverse and sort?
  }

  var balance = spliceArguments.length - 2 - spliceArguments[1];

  var removeStart = Math.min(length, spliceArguments[0]);
  var removeEnd = removeStart + spliceArguments[1];
  newIndices.startIndex = removeStart;

  var i;
  for (i = 0; i < removeStart; i += 1) {
    newIndices.push(i);
  }

  for (; i < removeEnd; i += 1) {
    newIndices.push(-1);
  }

  for (; i < length; i += 1) {
    newIndices.push(i + balance);
  }

  // there is a net shift for the rest of the array starting with index + balance
  if (balance !== 0) {
    newIndices.touchedFrom = spliceArguments[0];
  } else {
    newIndices.touchedFrom = length;
  }

  return newIndices;
}

// The pop, push, shift an unshift methods can all be represented
// as an equivalent splice
function getSpliceEquivalent(length, methodName, args) {
  switch (methodName) {
    case 'splice':
      if (args[0] !== undefined && args[0] < 0) {
        args[0] = length + Math.max(args[0], -length);
      }

      if (isUndefined(args[0])) { args[0] = 0; }

      while (args.length < 2) {
        args.push(length - args[0]);
      }

      if (!isNumber(args[1])) {
        args[1] = length - args[0];
      }

      // ensure we only remove elements that exist
      args[1] = Math.min(args[1], length - args[0]);

      return args;

    case 'sort':
    case 'reverse':
      return null;

    case 'pop':
      if (length) {
        return [length - 1, 1];
      }
      return [0, 0];

    case 'push':
      return [length, 0].concat(args);

    case 'shift':
      return [0, length ? 1 : 0];

    case 'unshift':
      return [0, 0].concat(args);
  }
}

var arrayProto = Array.prototype;

function makeArrayMethod(methodName) {
  function path(keypath) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return model(this.viewmodel.joinAll(splitKeypath(keypath)), args);
  }

  function model(mdl, args) {
    var array = mdl.get();

    if (!isArray(array)) {
      if (isUndefined(array)) {
        array = [];
        var result$1 = arrayProto[methodName].apply(array, args);
        var promise$1 = runloop.start().then(function () { return result$1; });
        mdl.set(array);
        runloop.end();
        return promise$1;
      } else {
        throw new Error(
          ("shuffle array method " + methodName + " called on non-array at " + (mdl.getKeypath()))
        );
      }
    }

    var newIndices = getNewIndices(array.length, methodName, args);
    var result = arrayProto[methodName].apply(array, args);

    var promise = runloop.start().then(function () { return result; });
    promise.result = result;

    if (newIndices) {
      if (mdl.shuffle) {
        mdl.shuffle(newIndices);
      } else {
        // it's a computation, which don't have a shuffle, so just invalidate
        mdl.mark();
      }
    } else {
      mdl.set(result);
    }

    runloop.end();

    return promise;
  }

  return { path: path, model: model };
}

function update$1(ractive, model, options) {
  // if the parent is wrapped, the adaptor will need to be updated before
  // updating on this keypath
  if (model.parent && model.parent.wrapper) {
    model.parent.adapt();
  }

  var promise = runloop.start();

  model.mark(options && options.force);

  // notify upstream of changes
  model.notifyUpstream();

  runloop.end();

  hooks.update.fire(ractive, model);

  return promise;
}

function Ractive$update(keypath, options) {
  var opts, path;

  if (isString(keypath)) {
    path = splitKeypath(keypath);
    opts = options;
  } else {
    opts = keypath;
  }

  return update$1(this, path ? this.viewmodel.joinAll(path) : this.viewmodel, opts);
}

var modelPush = makeArrayMethod('push').model;
var modelPop = makeArrayMethod('pop').model;
var modelShift = makeArrayMethod('shift').model;
var modelUnshift = makeArrayMethod('unshift').model;
var modelSort = makeArrayMethod('sort').model;
var modelSplice = makeArrayMethod('splice').model;
var modelReverse = makeArrayMethod('reverse').model;

var ContextData = (function (Model) {
  function ContextData(options) {
    Model.call(this, null, null);

    this.isRoot = true;
    this.root = this;
    this.value = {};
    this.ractive = options.ractive;
    this.adaptors = [];
    this.context = options.context;
  }

  if ( Model ) ContextData.__proto__ = Model;
  var ContextData__proto__ = ContextData.prototype = Object.create( Model && Model.prototype );
  ContextData__proto__.constructor = ContextData;

  ContextData__proto__.getKeypath = function getKeypath () {
    return '@context.data';
  };

  ContextData__proto__.rebound = function rebound () {};

  return ContextData;
}(Model));

var Context = function Context(fragment, element) {
  this.fragment = fragment;
  this.element = element || findElement(fragment);
  this.node = this.element && this.element.node;
  this.ractive = fragment.ractive;
  this.root = this;
};
var Context__proto__ = Context.prototype;

var prototypeAccessors = { decorators: {},_data: {} };

prototypeAccessors.decorators.get = function () {
  var items = {};
  if (!this.element) { return items; }
  this.element.decorators.forEach(function (d) { return (items[d.name] = d.handle); });
  return items;
};

prototypeAccessors._data.get = function () {
  return (
    this.model ||
    (this.root.model = new ContextData({
      ractive: this.ractive,
      context: this.root
    }))
  );
};

// the usual mutation suspects
Context__proto__.add = function add (keypath, d, options) {
  var num = isNumber(d) ? +d : 1;
  var opts = isObjectType(d) ? d : options;
  return set(
    build$1(this, keypath, num).map(function (pair) {
      var model = pair[0];
        var val = pair[1];
      var value = model.get();
      if (!isNumeric(val) || !isNumeric(value)) { throw new Error('Cannot add non-numeric value'); }
      return [model, value + val];
    }),
    opts
  );
};

Context__proto__.animate = function animate$1 (keypath, value, options) {
  var model = findModel(this, keypath).model;
  return animate(this.ractive, model, value, options);
};

Context__proto__.find = function find (selector) {
  return this.fragment.find(selector);
};

Context__proto__.findAll = function findAll (selector) {
  var result = [];
  this.fragment.findAll(selector, { result: result });
  return result;
};

Context__proto__.findAllComponents = function findAllComponents (selector) {
  var result = [];
  this.fragment.findAllComponents(selector, { result: result });
  return result;
};

Context__proto__.findComponent = function findComponent (selector) {
  return this.fragment.findComponent(selector);
};

// get relative keypaths and values
Context__proto__.get = function get (keypath) {
  if (!keypath) { return this.fragment.findContext().get(true); }

  var ref = findModel(this, keypath);
    var model = ref.model;

  return model ? model.get(true) : undefined;
};

Context__proto__.getParent = function getParent (component) {
  var fragment = this.fragment;

  if (!fragment.parent && component) { fragment = fragment.componentParent; }
  else {
    if (fragment.context) { fragment = findParentWithContext(fragment.parent); }
    else {
      fragment = findParentWithContext(fragment.parent);
      if (fragment) {
        if (!fragment.parent && component) { fragment = fragment.componentParent; }
        else { fragment = findParentWithContext(fragment.parent); }
      }
    }
  }

  if (!fragment || fragment === this.fragment) { return; }
  else { return fragment.getContext(); }
};

Context__proto__.hasListener = function hasListener (name, bubble) {
  // if the owner is a component, start there because the nearest element
  // may exist outside of the immediate context (yield)
  var el = this.fragment.owner.component
    ? this.fragment.owner
    : this.element || this.fragment.owner;
  var base;

  do {
    base = el.component || el;
    if (base.template.t === ELEMENT) {
      if (findEvent(base, name)) { return true; }
    }
    el = el.up && el.up.owner;
    if (el && el.component) { el = el.component; }
  } while (el && bubble);
};

Context__proto__.link = function link (source, dest) {
  var there = findModel(this, source).model;
  var here = findModel(this, dest).model;
  var promise = runloop.start();
  here.link(there, source);
  runloop.end();
  return promise;
};

Context__proto__.listen = function listen (event, handler) {
  var el = this.element;
  el.on(event, handler);
  return {
    cancel: function cancel() {
      el.off(event, handler);
    }
  };
};

Context__proto__.observe = function observe (keypath, callback, options) {
    if ( options === void 0 ) options = {};

  if (isObject(keypath)) { options = callback || {}; }
  options.fragment = this.fragment;
  return this.ractive.observe(keypath, callback, options);
};

Context__proto__.observeOnce = function observeOnce (keypath, callback, options) {
    if ( options === void 0 ) options = {};

  if (isObject(keypath)) { options = callback || {}; }
  options.fragment = this.fragment;
  return this.ractive.observeOnce(keypath, callback, options);
};

Context__proto__.pop = function pop (keypath) {
  return modelPop(findModel(this, keypath).model, []);
};

Context__proto__.push = function push (keypath) {
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

  return modelPush(findModel(this, keypath).model, values);
};

Context__proto__.raise = function raise (name, event) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

  var el = this.element;
  var ev;

  while (el) {
    if (el.component) { el = el.component; }
    ev = findEvent(el, name);
    if (ev) {
      return ev.fire(
        ev.element.getContext(
          event || {},
          event && !('original' in event) ? { original: {} } : {}
        ),
        args
      );
    }

    el = el.up && el.up.owner;
  }
};

Context__proto__.readLink = function readLink (keypath, options) {
  return this.ractive.readLink(this.resolve(keypath), options);
};

Context__proto__.resolve = function resolve (path, ractive) {
  var ref = findModel(this, path);
    var model = ref.model;
    var instance = ref.instance;
  return model ? model.getKeypath(ractive || instance) : path;
};

Context__proto__.reverse = function reverse (keypath) {
  return modelReverse(findModel(this, keypath).model, []);
};

Context__proto__.set = function set$2 (keypath, value, options) {
  return set(build$1(this, keypath, value), options);
};

Context__proto__.shift = function shift (keypath) {
  return modelShift(findModel(this, keypath).model, []);
};

Context__proto__.splice = function splice (keypath, index, drop) {
    var add = [], len = arguments.length - 3;
    while ( len-- > 0 ) add[ len ] = arguments[ len + 3 ];

  add.unshift(index, drop);
  return modelSplice(findModel(this, keypath).model, add);
};

Context__proto__.sort = function sort (keypath) {
  return modelSort(findModel(this, keypath).model, []);
};

Context__proto__.subtract = function subtract (keypath, d, options) {
  var num = isNumber(d) ? d : 1;
  var opts = isObjectType(d) ? d : options;
  return set(
    build$1(this, keypath, num).map(function (pair) {
      var model = pair[0];
        var val = pair[1];
      var value = model.get();
      if (!isNumeric(val) || !isNumeric(value)) { throw new Error('Cannot add non-numeric value'); }
      return [model, value - val];
    }),
    opts
  );
};

Context__proto__.toggle = function toggle (keypath, options) {
  var ref = findModel(this, keypath);
    var model = ref.model;
  return set([[model, !model.get()]], options);
};

Context__proto__.unlink = function unlink (dest) {
  var here = findModel(this, dest).model;
  var promise = runloop.start();
  if (here.owner && here.owner._link) { here.owner.unlink(); }
  runloop.end();
  return promise;
};

Context__proto__.unlisten = function unlisten (event, handler) {
  this.element.off(event, handler);
};

Context__proto__.unshift = function unshift (keypath) {
    var add = [], len = arguments.length - 1;
    while ( len-- > 0 ) add[ len ] = arguments[ len + 1 ];

  return modelUnshift(findModel(this, keypath).model, add);
};

Context__proto__.update = function update (keypath, options) {
  return update$1(this.ractive, findModel(this, keypath).model, options);
};

Context__proto__.updateModel = function updateModel (keypath, cascade) {
  var ref = findModel(this, keypath);
    var model = ref.model;
  var promise = runloop.start();
  model.updateFromBindings(cascade);
  runloop.end();
  return promise;
};

// two-way binding related helpers
Context__proto__.isBound = function isBound () {
  var ref = this.getBindingModel(this);
    var model = ref.model;
  return !!model;
};

Context__proto__.getBindingPath = function getBindingPath (ractive) {
  var ref = this.getBindingModel(this);
    var model = ref.model;
    var instance = ref.instance;
  if (model) { return model.getKeypath(ractive || instance); }
};

Context__proto__.getBinding = function getBinding () {
  var ref = this.getBindingModel(this);
    var model = ref.model;
  if (model) { return model.get(true); }
};

Context__proto__.getBindingModel = function getBindingModel (ctx) {
  var el = ctx.element;
  return { model: el.binding && el.binding.model, instance: el.up.ractive };
};

Context__proto__.setBinding = function setBinding (value) {
  var ref = this.getBindingModel(this);
    var model = ref.model;
  return set([[model, value]]);
};

Object.defineProperties( Context__proto__, prototypeAccessors );

Context.forRactive = getRactiveContext;
// circular deps are fun
extern.Context = Context;

// TODO: at some point perhaps this could support relative * keypaths?
function build$1(ctx, keypath, value) {
  var sets = [];

  // set multiple keypaths in one go
  if (isObject(keypath)) {
    for (var k in keypath) {
      if (hasOwn(keypath, k)) {
        sets.push([findModel(ctx, k).model, keypath[k]]);
      }
    }
  } else {
    // set a single keypath
    sets.push([findModel(ctx, keypath).model, value]);
  }

  return sets;
}

function findModel(ctx, path) {
  var frag = ctx.fragment;

  if (!isString(path)) {
    return { model: frag.findContext(), instance: path };
  }

  return { model: resolveReference(frag, path), instance: frag.ractive };
}

function findEvent(el, name) {
  return el.events && el.events.find && el.events.find(function (e) { return ~e.template.n.indexOf(name); });
}

function Ractive$fire(eventName) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var ctx;

  // watch for reproxy
  if (args[0] instanceof Context) {
    var proto = args.shift();
    ctx = create(proto);
    assign(ctx, proto);
  } else if (isObjectType(args[0]) && (args[0] === null || args[0].constructor === Object)) {
    ctx = Context.forRactive(this, args.shift());
  } else {
    ctx = Context.forRactive(this);
  }

  return fireEvent(this, eventName, ctx, args);
}

function Ractive$get(keypath, opts) {
  if (!isString(keypath)) { return this.viewmodel.get(true, keypath); }

  var keys = splitKeypath(keypath);
  var key = keys[0];

  var model;

  if (!this.viewmodel.has(key)) {
    // if this is an inline component, we may need to create
    // an implicit mapping
    if (this.component && !this.isolated) {
      model = resolveReference(this.fragment || new FakeFragment(this), key);
    }
  }

  model = this.viewmodel.joinAll(keys);
  return model.get(true, opts);
}

var query = doc && doc.querySelector;

function getContext$1(node) {
  if (isString(node) && query) {
    node = query.call(document, node);
  }

  var instances;
  if (node) {
    if (node._ractive) {
      return node._ractive.proxy.getContext();
    } else if ((instances = node.__ractive_instances__)) {
      if (instances.length === 1) { return getRactiveContext(instances[0]); }
    } else { return getContext$1(node.parentNode); }
  }
}

function getContext$2(node, options) {
  if (!node) { return getRactiveContext(this); }

  if (isString(node)) {
    node = this.find(node, options);
  }

  return getContext$1(node);
}

var html = 'http://www.w3.org/1999/xhtml';
var mathml = 'http://www.w3.org/1998/Math/MathML';
var svg$1 = 'http://www.w3.org/2000/svg';
var xlink = 'http://www.w3.org/1999/xlink';
var xml = 'http://www.w3.org/XML/1998/namespace';
var xmlns = 'http://www.w3.org/2000/xmlns';

var namespaces = { html: html, mathml: mathml, svg: svg$1, xlink: xlink, xml: xml, xmlns: xmlns };

var createElement;
var matches;
var div;
var methodNames;
var unprefixed;
var prefixed;
var i;
var j;
var makeFunction;

// Test for SVG support
if (!svg) {
  /* istanbul ignore next */
  createElement = function (type, ns, extend) {
    if (ns && ns !== html) {
      throw "This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you're trying to render SVG in an older browser. See http://ractive.js.org/support/#svgs for more information";
    }

    return extend ? doc.createElement(type, extend) : doc.createElement(type);
  };
} else {
  createElement = function (type, ns, extend) {
    if (!ns || ns === html) {
      return extend ? doc.createElement(type, extend) : doc.createElement(type);
    }

    return extend ? doc.createElementNS(ns, type, extend) : doc.createElementNS(ns, type);
  };
}

function createDocumentFragment() {
  return doc.createDocumentFragment();
}

function getElement(input) {
  var output;

  if (!input || typeof input === 'boolean') {
    return;
  }

  /* istanbul ignore next */
  if (!win || !doc || !input) {
    return null;
  }

  // We already have a DOM node - no work to do. (Duck typing alert!)
  if (input.nodeType) {
    return input;
  }

  // Get node from string
  if (isString(input)) {
    // try ID first
    output = doc.getElementById(input);

    // then as selector, if possible
    if (!output && doc.querySelector) {
      try {
        output = doc.querySelector(input);
      } catch (e) {
        /* this space intentionally left blank */
      }
    }

    // did it work?
    if (output && output.nodeType) {
      return output;
    }
  }

  // If we've been given a collection (jQuery, Zepto etc), extract the first item
  if (input[0] && input[0].nodeType) {
    return input[0];
  }

  return null;
}

if (!isClient) {
  matches = null;
} else {
  div = createElement('div');
  methodNames = ['matches', 'matchesSelector'];

  makeFunction = function(methodName) {
    return function(node, selector) {
      return node[methodName](selector);
    };
  };

  i = methodNames.length;

  while (i-- && !matches) {
    unprefixed = methodNames[i];

    if (div[unprefixed]) {
      matches = makeFunction(unprefixed);
    } else {
      j = vendors.length;
      while (j--) {
        prefixed = vendors[i] + unprefixed.substr(0, 1).toUpperCase() + unprefixed.substring(1);

        if (div[prefixed]) {
          matches = makeFunction(prefixed);
          break;
        }
      }
    }
  }

  // IE8... and apparently phantom some?
  /* istanbul ignore next */
  if (!matches) {
    matches = function(node, selector) {
      var parentNode, i;

      parentNode = node.parentNode;

      if (!parentNode) {
        // empty dummy <div>
        div.innerHTML = '';

        parentNode = div;
        node = node.cloneNode();

        div.appendChild(node);
      }

      var nodes = parentNode.querySelectorAll(selector);

      i = nodes.length;
      while (i--) {
        if (nodes[i] === node) {
          return true;
        }
      }

      return false;
    };
  }
}

function detachNode(node) {
  // stupid ie
  // eslint-disable-next-line valid-typeof
  if (node && typeof node.parentNode !== 'unknown' && node.parentNode) {
    node.parentNode.removeChild(node);
  }

  return node;
}

function safeToStringValue(value) {
  return value == null || (isNumber(value) && isNaN(value)) || !value.toString ? '' : '' + value;
}

function safeAttributeString(string) {
  return safeToStringValue(string)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function Ractive$insert(target, anchor) {
  if (!this.fragment.rendered) {
    // TODO create, and link to, documentation explaining this
    throw new Error(
      'The API has changed - you must call `ractive.render(target[, anchor])` to render your Ractive instance. Once rendered you can use `ractive.insert()`.'
    );
  }

  target = getElement(target);
  anchor = getElement(anchor) || null;

  if (!target) {
    throw new Error('You must specify a valid target to insert into');
  }

  target.insertBefore(this.detach(), anchor);
  this.el = target;

  (target.__ractive_instances__ || (target.__ractive_instances__ = [])).push(this);
  this.isDetached = false;

  fireInsertHook(this);
}

function fireInsertHook(ractive) {
  hooks.insert.fire(ractive);

  ractive.findAllComponents('*').forEach(function (child) {
    fireInsertHook(child.instance);
  });
}

function link(there, here, options) {
  var model;
  var target = (options && (options.ractive || options.instance)) || this;

  // may need to allow a mapping to resolve implicitly
  var sourcePath = splitKeypath(there);
  if (!target.viewmodel.has(sourcePath[0]) && target.component) {
    model = resolveReference(target.component.up, sourcePath[0]);
    model = model.joinAll(sourcePath.slice(1));
  }

  var src = model || target.viewmodel.joinAll(sourcePath);
  var dest = this.viewmodel.joinAll(splitKeypath(here), { lastLink: false });

  if (isUpstream(src, dest) || isUpstream(dest, src)) {
    throw new Error('A keypath cannot be linked to itself.');
  }

  var promise = runloop.start();

  dest.link(src, (options && options.keypath) || there);

  runloop.end();

  return promise;
}

function isUpstream(check, start) {
  var model = start;
  while (model) {
    if (model === check || model.owner === check) { return true; }
    model = model.target || model.parent;
  }
}

var Observer = function Observer(ractive, model, callback, options) {
  this.context = options.context || ractive;
  this.callback = callback;
  this.ractive = ractive;
  this.keypath = options.keypath;
  this.options = options;

  if (model) { this.resolved(model); }

  if (isFunction(options.old)) {
    this.oldContext = create(ractive);
    this.oldFn = options.old;
  }

  if (options.init !== false) {
    this.dirty = true;
    this.dispatch();
  } else {
    updateOld(this);
  }

  this.dirty = false;
};
var Observer__proto__ = Observer.prototype;

Observer__proto__.cancel = function cancel () {
  this.cancelled = true;
  if (this.model) {
    this.model.unregister(this);
  } else {
    this.resolver.unbind();
  }
  removeFromArray(this.ractive._observers, this);
};

Observer__proto__.dispatch = function dispatch () {
  if (!this.cancelled) {
    this.callback.call(this.context, this.newValue, this.oldValue, this.keypath);
    updateOld(this, true);
    this.dirty = false;
  }
};

Observer__proto__.handleChange = function handleChange () {
    var this$1 = this;

  if (!this.dirty) {
    var newValue = this.model.get();
    if (isEqual(newValue, this.oldValue)) { return; }

    this.newValue = newValue;

    if (this.options.strict && this.newValue === this.oldValue) { return; }

    runloop.addObserver(this, this.options.defer);
    this.dirty = true;

    if (this.options.once) { runloop.scheduleTask(function () { return this$1.cancel(); }); }
  } else {
    // make sure the newValue stays updated in case this observer gets touched multiple times in one loop
    this.newValue = this.model.get();
  }
};

Observer__proto__.rebind = function rebind (next, previous) {
    var this$1 = this;

  next = rebindMatch(this.keypath, next, previous);
  if (next === this.model) { return false; }

  if (this.model) { this.model.unregister(this); }
  if (next) { next.addShuffleTask(function () { return this$1.resolved(next); }); }
};

Observer__proto__.resolved = function resolved (model) {
  this.model = model;

  this.oldValue = undefined;
  this.newValue = model.get();

  model.register(this);
};

function updateOld(observer, fresh) {
  var next = fresh
    ? observer.model
      ? observer.model.get()
      : observer.newValue
    : observer.newValue;
  observer.oldValue = observer.oldFn
    ? observer.oldFn.call(observer.oldContext, undefined, next, observer.keypath)
    : next;
}

var star$1 = /\*+/g;

var PatternObserver = function PatternObserver(ractive, baseModel, keys$$1, callback, options) {
  var this$1 = this;

  this.context = options.context || ractive;
  this.ractive = ractive;
  this.baseModel = baseModel;
  this.keys = keys$$1;
  this.callback = callback;

  var pattern = keys$$1.join('\\.').replace(star$1, '(.+)');
  var baseKeypath = (this.baseKeypath = baseModel.getKeypath(ractive));
  this.pattern = new RegExp(("^" + (baseKeypath ? baseKeypath + '\\.' : '') + pattern + "$"));
  this.recursive = keys$$1.length === 1 && keys$$1[0] === '**';
  if (this.recursive) { this.keys = ['*']; }
  if (options.old) {
    this.oldContext = create(ractive);
    this.oldFn = options.old;
  }

  this.oldValues = {};
  this.newValues = {};

  this.defer = options.defer;
  this.once = options.once;
  this.strict = options.strict;

  this.dirty = false;
  this.changed = [];
  this.partial = false;
  this.links = options.links;

  var models = baseModel.findMatches(this.keys);

  models.forEach(function (model) {
    this$1.newValues[model.getKeypath(this$1.ractive)] = model.get();
  });

  if (options.init !== false) {
    this.dispatch();
  } else {
    updateOld$1(this, this.newValues);
  }

  baseModel.registerPatternObserver(this);
};
var PatternObserver__proto__ = PatternObserver.prototype;

PatternObserver__proto__.cancel = function cancel () {
  this.baseModel.unregisterPatternObserver(this);
  removeFromArray(this.ractive._observers, this);
};

PatternObserver__proto__.dispatch = function dispatch () {
    var this$1 = this;

  var newValues = this.newValues;
  this.newValues = {};
  keys(newValues).forEach(function (keypath) {
    var newValue = newValues[keypath];
    var oldValue = this$1.oldValues[keypath];

    if (this$1.strict && newValue === oldValue) { return; }
    if (isEqual(newValue, oldValue)) { return; }

    var args = [newValue, oldValue, keypath];
    if (keypath) {
      var wildcards = this$1.pattern.exec(keypath);
      if (wildcards) {
        args = args.concat(wildcards.slice(1));
      }
    }

    this$1.callback.apply(this$1.context, args);
  });

  updateOld$1(this, newValues, this.partial);

  this.dirty = false;
};

PatternObserver__proto__.notify = function notify (key) {
  this.changed.push(key);
};

PatternObserver__proto__.shuffle = function shuffle (newIndices) {
    var this$1 = this;

  if (!isArray(this.baseModel.value)) { return; }

  var max = this.baseModel.value.length;

  for (var i = 0; i < newIndices.length; i++) {
    if (newIndices[i] === -1 || newIndices[i] === i) { continue; }
    this$1.changed.push([i]);
  }

  for (var i$1 = newIndices.touchedFrom; i$1 < max; i$1++) {
    this$1.changed.push([i$1]);
  }
};

PatternObserver__proto__.handleChange = function handleChange () {
    var this$1 = this;

  if (!this.dirty || this.changed.length) {
    if (!this.dirty) { this.newValues = {}; }

    if (!this.changed.length) {
      this.baseModel.findMatches(this.keys).forEach(function (model) {
        var keypath = model.getKeypath(this$1.ractive);
        this$1.newValues[keypath] = model.get();
      });
      this.partial = false;
    } else {
      var count = 0;

      if (this.recursive) {
        this.changed.forEach(function (keys$$1) {
          var model = this$1.baseModel.joinAll(keys$$1);
          if (model.isLink && !this$1.links) { return; }
          count++;
          this$1.newValues[model.getKeypath(this$1.ractive)] = model.get();
        });
      } else {
        var ok = this.baseModel.isRoot
          ? this.changed.map(function (keys$$1) { return keys$$1.map(escapeKey).join('.'); })
          : this.changed.map(function (keys$$1) { return this$1.baseKeypath + '.' + keys$$1.map(escapeKey).join('.'); });

        this.baseModel.findMatches(this.keys).forEach(function (model) {
          var keypath = model.getKeypath(this$1.ractive);
          var check = function (k) {
            return (
              (k.indexOf(keypath) === 0 &&
                (k.length === keypath.length || k[keypath.length] === '.')) ||
              (keypath.indexOf(k) === 0 &&
                (k.length === keypath.length || keypath[k.length] === '.'))
            );
          };

          // is this model on a changed keypath?
          if (ok.filter(check).length) {
            count++;
            this$1.newValues[keypath] = model.get();
          }
        });
      }

      // no valid change triggered, so bail to avoid breakage
      if (!count) { return; }

      this.partial = true;
    }

    runloop.addObserver(this, this.defer);
    this.dirty = true;
    this.changed.length = 0;

    if (this.once) { this.cancel(); }
  }
};

function updateOld$1(observer, vals, partial) {
  var olds = observer.oldValues;

  if (observer.oldFn) {
    if (!partial) { observer.oldValues = {}; }

    keys(vals).forEach(function (k) {
      var args = [olds[k], vals[k], k];
      var parts = observer.pattern.exec(k);
      if (parts) {
        args.push.apply(args, parts.slice(1));
      }
      observer.oldValues[k] = observer.oldFn.apply(observer.oldContext, args);
    });
  } else {
    if (partial) {
      keys(vals).forEach(function (k) { return (olds[k] = vals[k]); });
    } else {
      observer.oldValues = vals;
    }
  }
}

function negativeOne() {
  return -1;
}

var ArrayObserver = function ArrayObserver(ractive, model, callback, options) {
  this.ractive = ractive;
  this.model = model;
  this.keypath = model.getKeypath();
  this.callback = callback;
  this.options = options;

  this.pending = null;

  model.register(this);

  if (options.init !== false) {
    this.sliced = [];
    this.shuffle([]);
    this.dispatch();
  } else {
    this.sliced = this.slice();
  }
};
var ArrayObserver__proto__ = ArrayObserver.prototype;

ArrayObserver__proto__.cancel = function cancel () {
  this.model.unregister(this);
  removeFromArray(this.ractive._observers, this);
};

ArrayObserver__proto__.dispatch = function dispatch () {
  this.callback(this.pending);
  this.pending = null;
  if (this.options.once) { this.cancel(); }
};

ArrayObserver__proto__.handleChange = function handleChange (path) {
  if (this.pending) {
    // post-shuffle
    runloop.addObserver(this, this.options.defer);
  } else if (!path) {
    // entire array changed
    this.shuffle(this.sliced.map(negativeOne));
    this.handleChange();
  }
};

ArrayObserver__proto__.shuffle = function shuffle (newIndices) {
    var this$1 = this;

  var newValue = this.slice();

  var inserted = [];
  var deleted = [];
  var start;

  var hadIndex = {};

  newIndices.forEach(function (newIndex, oldIndex) {
    hadIndex[newIndex] = true;

    if (newIndex !== oldIndex && isUndefined(start)) {
      start = oldIndex;
    }

    if (newIndex === -1) {
      deleted.push(this$1.sliced[oldIndex]);
    }
  });

  if (isUndefined(start)) { start = newIndices.length; }

  var len = newValue.length;
  for (var i = 0; i < len; i += 1) {
    if (!hadIndex[i]) { inserted.push(newValue[i]); }
  }

  this.pending = { inserted: inserted, deleted: deleted, start: start };
  this.sliced = newValue;
};

ArrayObserver__proto__.slice = function slice () {
  var value = this.model.get();
  return isArray(value) ? value.slice() : [];
};

function observe(keypath, callback, options) {
  var this$1 = this;

  var observers = [];
  var map;
  var opts;

  if (isObject(keypath)) {
    map = keypath;
    opts = callback || {};
  } else {
    if (isFunction(keypath)) {
      map = { '': keypath };
      opts = callback || {};
    } else {
      map = {};
      map[keypath] = callback;
      opts = options || {};
    }
  }

  var silent = false;
  keys(map).forEach(function (keypath) {
    var callback = map[keypath];
    var caller = function() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (silent) { return; }
      return callback.apply(this, args);
    };

    var keypaths = keypath.split(' ');
    if (keypaths.length > 1) { keypaths = keypaths.filter(function (k) { return k; }); }

    keypaths.forEach(function (keypath) {
      opts.keypath = keypath;
      var observer = createObserver(this$1, keypath, caller, opts);
      if (observer) { observers.push(observer); }
    });
  });

  // add observers to the Ractive instance, so they can be
  // cancelled on ractive.teardown()
  this._observers.push.apply(this._observers, observers);

  return {
    cancel: function () { return observers.forEach(function (o) { return o.cancel(); }); },
    isSilenced: function () { return silent; },
    silence: function () { return (silent = true); },
    resume: function () { return (silent = false); }
  };
}

function createObserver(ractive, keypath, callback, options) {
  var keys$$1 = splitKeypath(keypath);
  var wildcardIndex = keys$$1.indexOf('*');
  if (!~wildcardIndex) { wildcardIndex = keys$$1.indexOf('**'); }

  options.fragment = options.fragment || ractive.fragment;

  var model;
  if (!options.fragment) {
    model = ractive.viewmodel.joinKey(keys$$1[0]);
  } else {
    // .*.whatever relative wildcard is a special case because splitkeypath doesn't handle the leading .
    if (~keys$$1[0].indexOf('.*')) {
      model = options.fragment.findContext();
      wildcardIndex = 0;
      keys$$1[0] = keys$$1[0].slice(1);
    } else {
      model =
        wildcardIndex === 0
          ? options.fragment.findContext()
          : resolveReference(options.fragment, keys$$1[0]);
    }
  }

  // the model may not exist key
  if (!model) { model = ractive.viewmodel.joinKey(keys$$1[0]); }

  if (!~wildcardIndex) {
    model = model.joinAll(keys$$1.slice(1));
    if (options.array) {
      return new ArrayObserver(ractive, model, callback, options);
    } else {
      return new Observer(ractive, model, callback, options);
    }
  } else {
    var double = keys$$1.indexOf('**');
    if (~double) {
      if (double + 1 !== keys$$1.length || ~keys$$1.indexOf('*')) {
        warnOnceIfDebug(
          "Recursive observers may only specify a single '**' at the end of the path."
        );
        return;
      }
    }

    model = model.joinAll(keys$$1.slice(1, wildcardIndex));

    return new PatternObserver(ractive, model, keys$$1.slice(wildcardIndex), callback, options);
  }
}

var onceOptions = { init: false, once: true };

function observeOnce(keypath, callback, options) {
  if (isObject(keypath) || isFunction(keypath)) {
    options = assign(callback || {}, onceOptions);
    return this.observe(keypath, options);
  }

  options = assign(options || {}, onceOptions);
  return this.observe(keypath, callback, options);
}

var trim = function (str) { return str.trim(); };

var notEmptyString = function (str) { return str !== ''; };

function Ractive$off(eventName, callback) {
  var this$1 = this;

  // if no event is specified, remove _all_ event listeners
  if (!eventName) {
    this._subs = {};
  } else {
    // Handle multiple space-separated event names
    var eventNames = eventName
      .split(' ')
      .map(trim)
      .filter(notEmptyString);

    eventNames.forEach(function (event) {
      var subs = this$1._subs[event];
      // if given a specific callback to remove, remove only it
      if (subs && callback) {
        var entry = subs.find(function (s) { return s.callback === callback; });
        if (entry) {
          removeFromArray(subs, entry);
          entry.off = true;

          if (event.indexOf('.')) { this$1._nsSubs--; }
        }
      } else if (subs) {
        // otherwise, remove all listeners for this event
        if (event.indexOf('.')) { this$1._nsSubs -= subs.length; }
        subs.length = 0;
      }
    });
  }

  return this;
}

function Ractive$on(eventName, callback) {
  var this$1 = this;

  // eventName may already be a map
  var map = isObjectType(eventName) ? eventName : {};
  // or it may be a string along with a callback
  if (isString(eventName)) { map[eventName] = callback; }

  var silent = false;
  var events = [];

  var loop = function ( k ) {
    var callback$1 = map[k];
    var caller = function() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (!silent) { return callback$1.apply(this, args); }
    };
    var entry = {
      callback: callback$1,
      handler: caller
    };

    if (hasOwn(map, k)) {
      var names = k
        .split(' ')
        .map(trim)
        .filter(notEmptyString);
      names.forEach(function (n) {
        (this$1._subs[n] || (this$1._subs[n] = [])).push(entry);
        if (n.indexOf('.')) { this$1._nsSubs++; }
        events.push([n, entry]);
      });
    }
  };

  for (var k in map) loop( k );

  return {
    cancel: function () { return events.forEach(function (e) { return this$1.off(e[0], e[1].callback); }); },
    isSilenced: function () { return silent; },
    silence: function () { return (silent = true); },
    resume: function () { return (silent = false); }
  };
}

function Ractive$once(eventName, handler) {
  var listener = this.on(eventName, function() {
    handler.apply(this, arguments);
    listener.cancel();
  });

  // so we can still do listener.cancel() manually
  return listener;
}

var pop = makeArrayMethod('pop').path;

var push = makeArrayMethod('push').path;

function readLink(keypath, options) {
  if ( options === void 0 ) options = {};

  var path = splitKeypath(keypath);

  if (this.viewmodel.has(path[0])) {
    var model = this.viewmodel.joinAll(path);

    if (!model.isLink) { return; }

    while ((model = model.target) && options.canonical !== false) {
      if (!model.isLink) { break; }
    }

    if (model) { return { ractive: model.root.ractive, keypath: model.getKeypath() }; }
  }
}

var PREFIX = '/* Ractive.js component styles */';

// Holds current definitions of styles.
var styleDefinitions = [];

// Flag to tell if we need to update the CSS
var isDirty = false;

// These only make sense on the browser. See additional setup below.
var styleElement = null;
var useCssText = null;

function addCSS(styleDefinition) {
  styleDefinitions.push(styleDefinition);
  isDirty = true;
}

function applyCSS(force) {
  var styleElement = style();

  // Apply only seems to make sense when we're in the DOM. Server-side renders
  // can call toCSS to get the updated CSS.
  if (!styleElement || (!force && !isDirty)) { return; }

  if (useCssText) {
    styleElement.styleSheet.cssText = getCSS(null);
  } else {
    styleElement.innerHTML = getCSS(null);
  }

  isDirty = false;
}

function getCSS(cssIds) {
  var filteredStyleDefinitions = cssIds
    ? styleDefinitions.filter(function (style) { return ~cssIds.indexOf(style.id); })
    : styleDefinitions;

  filteredStyleDefinitions.forEach(function (d) { return (d.applied = true); });

  return filteredStyleDefinitions.reduce(
    function (styles, style) { return ("" + (styles ? (styles + "\n\n/* {" + (style.id) + "} */\n" + (style.styles)) : '')); },
    PREFIX
  );
}

function style() {
  // If we're on the browser, additional setup needed.
  if (doc && !styleElement) {
    styleElement = doc.createElement('style');
    styleElement.type = 'text/css';
    styleElement.setAttribute('data-ractive-css', '');

    doc.getElementsByTagName('head')[0].appendChild(styleElement);

    useCssText = !!styleElement.styleSheet;
  }

  return styleElement;
}

var adaptConfigurator = {
  extend: function (Parent, proto, options) {
    proto.adapt = combine(proto.adapt, ensureArray(options.adapt));
  },

  init: function init() {}
};

var remove = /\/\*(?:[\s\S]*?)\*\//g;
var escape = /url\(\s*(['"])(?:\\[\s\S]|(?!\1).)*\1\s*\)|url\((?:\\[\s\S]|[^)])*\)|(['"])(?:\\[\s\S]|(?!\2).)*\2/gi;
var value = /\0(\d+)/g;

// Removes comments and strings from the given CSS to make it easier to parse.
// Callback receives the cleaned CSS and a function which can be used to put
// the removed strings back in place after parsing is done.
function cleanCss(css, callback, additionalReplaceRules) {
  if ( additionalReplaceRules === void 0 ) additionalReplaceRules = [];

  var values = [];
  var reconstruct = function (css) { return css.replace(value, function (match, n) { return values[n]; }); };
  css = css.replace(escape, function (match) { return ("\u0000" + (values.push(match) - 1)); }).replace(remove, '');

  additionalReplaceRules.forEach(function (pattern) {
    css = css.replace(pattern, function (match) { return ("\u0000" + (values.push(match) - 1)); });
  });

  return callback(css, reconstruct);
}

var selectorsPattern = /(?:^|\}|\{|\x01)\s*([^\{\}\0\x01]+)\s*(?=\{)/g;
var importPattern = /@import\s*\([^)]*\)\s*;?/gi;
var importEndPattern = /\x01/g;
var keyframesDeclarationPattern = /@keyframes\s+[^\{\}]+\s*\{(?:[^{}]+|\{[^{}]+})*}/gi;
var selectorUnitPattern = /((?:(?:\[[^\]]+\])|(?:[^\s\+\>~:]))+)((?:::?[^\s\+\>\~\(:]+(?:\([^\)]+\))?)*\s*[\s\+\>\~]?)\s*/g;
var excludePattern = /^(?:@|\d+%)/;
var dataRvcGuidPattern = /\[data-ractive-css~="\{[a-z0-9-]+\}"]/g;

function trim$1(str) {
  return str.trim();
}

function extractString(unit) {
  return unit.str;
}

function transformSelector(selector, parent) {
  var selectorUnits = [];
  var match;

  while ((match = selectorUnitPattern.exec(selector))) {
    selectorUnits.push({
      str: match[0],
      base: match[1],
      modifiers: match[2]
    });
  }

  // For each simple selector within the selector, we need to create a version
  // that a) combines with the id, and b) is inside the id
  var base = selectorUnits.map(extractString);

  var transformed = [];
  var i = selectorUnits.length;

  while (i--) {
    var appended = base.slice();

    // Pseudo-selectors should go after the attribute selector
    var unit = selectorUnits[i];
    appended[i] = unit.base + parent + unit.modifiers || '';

    var prepended = base.slice();
    prepended[i] = parent + ' ' + prepended[i];

    transformed.push(appended.join(' '), prepended.join(' '));
  }

  return transformed.join(', ');
}

function transformCss(css, id) {
  var dataAttr = "[data-ractive-css~=\"{" + id + "}\"]";

  var transformed;

  if (dataRvcGuidPattern.test(css)) {
    transformed = css.replace(dataRvcGuidPattern, dataAttr);
  } else {
    transformed = cleanCss(
      css,
      function (css, reconstruct) {
        css = css
          .replace(importPattern, '$&\x01')
          .replace(selectorsPattern, function (match, $1) {
            // don't transform at-rules and keyframe declarations
            if (excludePattern.test($1)) { return match; }

            var selectors = $1.split(',').map(trim$1);
            var transformed =
              selectors.map(function (selector) { return transformSelector(selector, dataAttr); }).join(', ') + ' ';

            return match.replace($1, transformed);
          })
          .replace(importEndPattern, '');

        return reconstruct(css);
      },
      [keyframesDeclarationPattern]
    );
  }

  return transformed;
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function uuid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function setCSSData(keypath, value, options) {
  var opts = isObjectType(keypath) ? value : options;
  var model = this._cssModel;

  model.locked = true;
  var promise = set(build({ viewmodel: model }, keypath, value, true), opts);
  model.locked = false;

  var cascade = runloop.start();
  this.extensions.forEach(function (e) {
    var model = e._cssModel;
    model.mark();
    model.downstreamChanged('', 1);
  });
  runloop.end();

  applyChanges(this, !opts || opts.apply !== false);

  return promise.then(function () { return cascade; });
}

function applyChanges(component, apply) {
  var local = recomputeCSS(component);
  var child = component.extensions
    .map(function (e) { return applyChanges(e, false); })
    .reduce(function (a, c) { return c || a; }, false);

  if (apply && (local || child)) {
    var def = component._cssDef;
    if (!def || (def && def.applied)) { applyCSS(true); }
  }

  return local || child;
}

function recomputeCSS(component) {
  var css = component.css;

  if (!isFunction(css)) { return; }

  var def = component._cssDef;
  var result = evalCSS(component, css);
  var styles = def.transform ? transformCss(result, def.id) : result;

  if (def.styles === styles) { return; }

  def.styles = styles;

  return true;
}

var CSSModel = (function (SharedModel) {
  function CSSModel(component) {
    SharedModel.call(this, component.cssData, '@style');
    this.component = component;
  }

  if ( SharedModel ) CSSModel.__proto__ = SharedModel;
  var CSSModel__proto__ = CSSModel.prototype = Object.create( SharedModel && SharedModel.prototype );
  CSSModel__proto__.constructor = CSSModel;

  CSSModel__proto__.downstreamChanged = function downstreamChanged (path, depth) {
    if (this.locked) { return; }

    var component = this.component;

    component.extensions.forEach(function (e) {
      var model = e._cssModel;
      model.mark();
      model.downstreamChanged(path, depth || 1);
    });

    if (!depth) {
      applyChanges(component, true);
    }
  };

  return CSSModel;
}(SharedModel));

var hasCurly = /\{/;
var cssConfigurator = {
  name: 'css',

  // Called when creating a new component definition
  extend: function (Parent, proto, options, Child) {
    Child._cssIds = gatherIds(Parent);

    defineProperty(Child, 'cssData', {
      configurable: true,
      value: assign(create(Parent.cssData), options.cssData || {})
    });

    defineProperty(Child, '_cssModel', {
      configurable: true,
      value: new CSSModel(Child)
    });

    if (options.css) { initCSS(options, Child, proto); }
  },

  // Called when creating a new component instance
  init: function (Parent, target, options) {
    if (!options.css) { return; }

    warnIfDebug("\nThe css option is currently not supported on a per-instance basis and will be discarded. Instead, we recommend instantiating from a component definition with a css option.\n\nconst Component = Ractive.extend({\n\t...\n\tcss: '/* your css */',\n\t...\n});\n\nconst componentInstance = new Component({ ... })\n\t\t");
  }
};

function gatherIds(start) {
  var cmp = start;
  var ids = [];

  while (cmp) {
    if (cmp.prototype.cssId) { ids.push(cmp.prototype.cssId); }
    cmp = cmp.Parent;
  }

  return ids;
}

function evalCSS(component, css) {
  if (isString(css)) { return css; }

  var cssData = component.cssData;
  var model = component._cssModel;
  var data = function data(path) {
    return model.joinAll(splitKeypath(path)).get();
  };
  data.__proto__ = cssData;

  var result = css.call(component, data);
  return isString(result) ? result : '';
}

function initCSS(options, target, proto) {
  var css =
    options.css === true
      ? ''
      : isString(options.css) && !hasCurly.test(options.css)
      ? getElement(options.css) || options.css
      : options.css;
  var cssProp = css;

  var id = options.cssId || uuid();

  if (isObjectType(css)) {
    css = 'textContent' in css ? css.textContent : css.innerHTML;
    cssProp = css;
  } else if (isFunction(css)) {
    cssProp = css;
    css = evalCSS(target, css);
  }

  var def = {
    transform: 'noCSSTransform' in options ? !options.noCSSTransform : !options.noCssTransform
  };

  defineProperty(target, '_cssDef', { configurable: true, value: def });

  defineProperty(target, 'css', {
    get: function get() {
      return cssProp;
    },
    set: function set(next) {
      cssProp = next;
      var css = evalCSS(target, cssProp);
      var styles = def.styles;
      def.styles = def.transform ? transformCss(css, id) : css;
      if (def.applied && styles !== def.styles) { applyCSS(true); }
    }
  });

  def.styles = def.transform ? transformCss(css, id) : css;
  def.id = proto.cssId = id;
  target._cssIds.push(id);

  addCSS(target._cssDef);
}

function validate(data) {
  // Warn if userOptions.data is a non-POJO
  if (data && data.constructor !== Object) {
    if (isFunction(data)) {
      // TODO do we need to support this in the new Ractive() case?
    } else if (!isObjectType(data)) {
      fatal(("data option must be an object or a function, `" + data + "` is not valid"));
    } else {
      warnIfDebug(
        'If supplied, options.data should be a plain JavaScript object - using a non-POJO as the root object may work, but is discouraged'
      );
    }
  }
}

var dataConfigurator = {
  name: 'data',

  extend: function (Parent, proto, options) {
    var key;
    var value;

    // check for non-primitives, which could cause mutation-related bugs
    if (options.data && isObject(options.data)) {
      for (key in options.data) {
        value = options.data[key];

        if (value && isObjectType(value)) {
          if (isObject(value) || isArray(value)) {
            warnIfDebug("Passing a `data` option with object and array properties to Ractive.extend() is discouraged, as mutating them is likely to cause bugs. Consider using a data function instead:\n\n  // this...\n  data: function () {\n    return {\n      myObject: {}\n    };\n  })\n\n  // instead of this:\n  data: {\n    myObject: {}\n  }");
          }
        }
      }
    }

    proto.data = combine$1(proto.data, options.data);
  },

  init: function (Parent, ractive, options) {
    var result = combine$1(Parent.prototype.data, options.data);

    if (isFunction(result)) { result = result.call(ractive); }

    // bind functions to the ractive instance at the top level,
    // unless it's a non-POJO (in which case alarm bells should ring)
    if (result && result.constructor === Object) {
      for (var prop in result) {
        if (isFunction(result[prop])) {
          var value = result[prop];
          result[prop] = bind(value, ractive);
          result[prop]._r_unbound = value;
        }
      }
    }

    return result || {};
  },

  reset: function reset(ractive) {
    var result = this.init(ractive.constructor, ractive, ractive.viewmodel);
    ractive.viewmodel.root.set(result);
    return true;
  }
};

function emptyData() {
  return {};
}

function combine$1(parentValue, childValue) {
  validate(childValue);

  var parentIsFn = isFunction(parentValue);

  // Very important, otherwise child instance can become
  // the default data object on Ractive or a component.
  // then ractive.set() ends up setting on the prototype!
  if (!childValue && !parentIsFn) {
    // this needs to be a function so that it can still inherit parent defaults
    childValue = emptyData;
  }

  var childIsFn = isFunction(childValue);

  // Fast path, where we just need to copy properties from
  // parent to child
  if (!parentIsFn && !childIsFn) {
    return fromProperties(childValue, parentValue);
  }

  return function() {
    var child = childIsFn ? callDataFunction(childValue, this) : childValue;
    var parent = parentIsFn ? callDataFunction(parentValue, this) : parentValue;

    return fromProperties(child, parent);
  };
}

function callDataFunction(fn, context) {
  var data = fn.call(context);

  if (!data) { return; }

  if (!isObjectType(data)) {
    fatal('Data function must return an object');
  }

  if (data.constructor !== Object) {
    warnOnceIfDebug(
      'Data function returned something other than a plain JavaScript object. This might work, but is strongly discouraged'
    );
  }

  return data;
}

function fromProperties(primary, secondary) {
  if (primary && secondary) {
    for (var key in secondary) {
      if (!(key in primary)) {
        primary[key] = secondary[key];
      }
    }

    return primary;
  }

  return primary || secondary;
}

var templateConfigurator = {
  name: 'template',

  extend: function extend(Parent, proto, options) {
    // only assign if exists
    if ('template' in options) {
      var template = options.template;

      if (isFunction(template)) {
        proto.template = template;
      } else {
        proto.template = parseTemplate(template, proto);
      }
    }
  },

  init: function init(Parent, ractive, options) {
    // TODO because of prototypal inheritance, we might just be able to use
    // ractive.template, and not bother passing through the Parent object.
    // At present that breaks the test mocks' expectations
    var template = 'template' in options ? options.template : Parent.prototype.template;
    template = template || { v: TEMPLATE_VERSION, t: [] };

    if (isFunction(template)) {
      var fn = template;
      template = getDynamicTemplate(ractive, fn);

      ractive._config.template = {
        fn: fn,
        result: template
      };
    }

    template = parseTemplate(template, ractive);

    // TODO the naming of this is confusing - ractive.template refers to [...],
    // but Component.prototype.template refers to {v:1,t:[],p:[]}...
    // it's unnecessary, because the developer never needs to access
    // ractive.template
    ractive.template = template.t;

    if (template.p) {
      extendPartials(ractive.partials, template.p);
    }
  },

  reset: function reset(ractive) {
    var result = resetValue(ractive);

    if (result) {
      var parsed = parseTemplate(result, ractive);

      ractive.template = parsed.t;
      extendPartials(ractive.partials, parsed.p, true);

      return true;
    }
  }
};

function resetValue(ractive) {
  var initial = ractive._config.template;

  // If this isn't a dynamic template, there's nothing to do
  if (!initial || !initial.fn) {
    return;
  }

  var result = getDynamicTemplate(ractive, initial.fn);

  // TODO deep equality check to prevent unnecessary re-rendering
  // in the case of already-parsed templates
  if (result !== initial.result) {
    initial.result = result;
    return result;
  }
}

function getDynamicTemplate(ractive, fn) {
  return fn.call(ractive, {
    fromId: parser.fromId,
    isParsed: parser.isParsed,
    parse: function parse(template, options) {
      if ( options === void 0 ) options = parser.getParseOptions(ractive);

      return parser.parse(template, options);
    }
  });
}

function parseTemplate(template, ractive) {
  if (isString(template)) {
    // parse will validate and add expression functions
    template = parseAsString(template, ractive);
  } else {
    // need to validate and add exp for already parsed template
    validate$1(template);
    addFunctions(template);
  }

  return template;
}

function parseAsString(template, ractive) {
  // ID of an element containing the template?
  if (template[0] === '#') {
    template = parser.fromId(template);
  }

  return parser.parseFor(template, ractive);
}

function validate$1(template) {
  // Check that the template even exists
  if (template == undefined) {
    throw new Error(("The template cannot be " + template + "."));
  } else if (!isNumber(template.v)) {
    // Check the parsed template has a version at all
    throw new Error(
      "The template parser was passed a non-string template, but the template doesn't have a version.  Make sure you're passing in the template you think you are."
    );
  } else if (template.v !== TEMPLATE_VERSION) {
    // Check we're using the correct version
    throw new Error(
      ("Mismatched template version (expected " + TEMPLATE_VERSION + ", got " + (template.v) + ") Please ensure you are using the latest version of Ractive.js in your build process as well as in your app")
    );
  }
}

function extendPartials(existingPartials, newPartials, overwrite) {
  if (!newPartials) { return; }

  // TODO there's an ambiguity here - we need to overwrite in the `reset()`
  // case, but not initially...

  for (var key in newPartials) {
    if (overwrite || !hasOwn(existingPartials, key)) {
      existingPartials[key] = newPartials[key];
    }
  }
}

var registryNames = [
  'adaptors',
  'components',
  'computed',
  'decorators',
  'easing',
  'events',
  'helpers',
  'interpolators',
  'partials',
  'transitions'
];

var registriesOnDefaults = ['computed', 'helpers'];

var Registry = function Registry(name, useDefaults) {
  this.name = name;
  this.useDefaults = useDefaults;
};
var Registry__proto__ = Registry.prototype;

Registry__proto__.extend = function extend (Parent, proto, options) {
  var parent = this.useDefaults ? Parent.defaults : Parent;
  var target = this.useDefaults ? proto : proto.constructor;
  this.configure(parent, target, options);
};

Registry__proto__.init = function init () {
  // noop
};

Registry__proto__.configure = function configure (Parent, target, options) {
  var name = this.name;
  var option = options[name];

  var registry = create(Parent[name]);

  assign(registry, option);

  target[name] = registry;

  if (name === 'partials' && target[name]) {
    keys(target[name]).forEach(function (key) {
      addFunctions(target[name][key]);
    });
  }
};

Registry__proto__.reset = function reset (ractive) {
  var registry = ractive[this.name];
  var changed = false;

  keys(registry).forEach(function (key) {
    var item = registry[key];

    if (item._fn) {
      if (item._fn.isOwner) {
        registry[key] = item._fn;
      } else {
        delete registry[key];
      }
      changed = true;
    }
  });

  return changed;
};

var registries = registryNames.map(function (name) {
  var putInDefaults = registriesOnDefaults.indexOf(name) > -1;
  return new Registry(name, putInDefaults);
});

function wrap(parent, name, method) {
  if (!/_super/.test(method)) { return method; }

  function wrapper() {
    var superMethod = getSuperMethod(wrapper._parent, name);
    var hasSuper = '_super' in this;
    var oldSuper = this._super;

    this._super = superMethod;

    var result = method.apply(this, arguments);

    if (hasSuper) {
      this._super = oldSuper;
    } else {
      delete this._super;
    }

    return result;
  }

  wrapper._parent = parent;
  wrapper._method = method;

  return wrapper;
}

function getSuperMethod(parent, name) {
  if (name in parent) {
    var value = parent[name];

    return isFunction(value) ? value : function () { return value; };
  }

  return noop;
}

function getMessage(deprecated, correct, isError) {
  return (
    "options." + deprecated + " has been deprecated in favour of options." + correct + "." +
    (isError ? (" You cannot specify both options, please use options." + correct + ".") : '')
  );
}

function deprecateOption(options, deprecatedOption, correct) {
  if (deprecatedOption in options) {
    if (!(correct in options)) {
      warnIfDebug(getMessage(deprecatedOption, correct));
      options[correct] = options[deprecatedOption];
    } else {
      throw new Error(getMessage(deprecatedOption, correct, true));
    }
  }
}

function deprecate(options) {
  deprecateOption(options, 'beforeInit', 'onconstruct');
  deprecateOption(options, 'init', 'onrender');
  deprecateOption(options, 'complete', 'oncomplete');
  deprecateOption(options, 'eventDefinitions', 'events');

  // Using extend with Component instead of options,
  // like Human.extend( Spider ) means adaptors as a registry
  // gets copied to options. So we have to check if actually an array
  if (isArray(options.adaptors)) {
    deprecateOption(options, 'adaptors', 'adapt');
  }
}

var config = {
  extend: function (Parent, proto, options, Child) { return configure('extend', Parent, proto, options, Child); },
  init: function (Parent, ractive, options) { return configure('init', Parent, ractive, options); },
  reset: function (ractive) { return order.filter(function (c) { return c.reset && c.reset(ractive); }).map(function (c) { return c.name; }); }
};

var custom = {
  adapt: adaptConfigurator,
  computed: config,
  css: cssConfigurator,
  data: dataConfigurator,
  helpers: config,
  template: templateConfigurator
};

var defaultKeys = keys(defaults);

var isStandardKey = makeObj(defaultKeys.filter(function (key) { return !custom[key]; }));

// blacklisted keys that we don't double extend
var isBlacklisted = makeObj(
  defaultKeys.concat(registries.map(function (r) { return r.name; }), ['on', 'observe', 'attributes', 'cssData', 'use'])
);

var order = [].concat(
  defaultKeys.filter(function (key) { return !registries[key] && !custom[key]; }),
  registries,
  //custom.data,
  custom.template,
  custom.css
);

function configure(method, Parent, target, options, Child) {
  deprecate(options);

  for (var key in options) {
    if (hasOwn(isStandardKey, key)) {
      var value = options[key];

      // warn the developer if they passed a function and ignore its value

      // NOTE: we allow some functions on "el" because we duck type element lists
      // and some libraries or ef'ed-up virtual browsers (phantomJS) return a
      // function object as the result of querySelector methods
      if (key !== 'el' && isFunction(value)) {
        warnIfDebug(
          (key + " is a Ractive option that does not expect a function and will be ignored"),
          method === 'init' ? target : null
        );
      } else {
        target[key] = value;
      }
    }
  }

  // disallow combination of `append` and `enhance`
  if (target.append && target.enhance) {
    throw new Error('Cannot use append and enhance at the same time');
  }

  registries.forEach(function (registry) {
    registry[method](Parent, target, options, Child);
  });

  adaptConfigurator[method](Parent, target, options, Child);
  templateConfigurator[method](Parent, target, options, Child);
  cssConfigurator[method](Parent, target, options, Child);

  extendOtherMethods(Parent.prototype, target, options);
}

var _super = /\b_super\b/;
function extendOtherMethods(parent, target, options) {
  for (var key in options) {
    if (!isBlacklisted[key] && hasOwn(options, key)) {
      var member = options[key];

      // if this is a method that overwrites a method, wrap it:
      if (isFunction(member)) {
        if (
          (key in proto$9 ||
            (key.slice(0, 2) === 'on' && key.slice(2) in hooks && key in target)) &&
          !_super.test(member.toString())
        ) {
          warnIfDebug(
            ("Overriding Ractive prototype function '" + key + "' without calling the '" + _super + "' method can be very dangerous.")
          );
        }
        member = wrap(parent, key, member);
      }

      target[key] = member;
    }
  }
}

function makeObj(array) {
  var obj = {};
  array.forEach(function (x) { return (obj[x] = true); });
  return obj;
}

var Item = function Item(options) {
  this.up = options.up;
  this.ractive = options.up.ractive;

  this.template = options.template;
  this.index = options.index;
  this.type = options.template.t;

  this.dirty = false;
};
var Item__proto__ = Item.prototype;

Item__proto__.bubble = function bubble () {
  if (!this.dirty) {
    this.dirty = true;
    this.up.bubble();
  }
};

Item__proto__.destroyed = function destroyed () {
  if (this.fragment) { this.fragment.destroyed(); }
};

Item__proto__.find = function find () {
  return null;
};

Item__proto__.findComponent = function findComponent () {
  return null;
};

Item__proto__.findNextNode = function findNextNode () {
  return this.up.findNextNode(this);
};

Item__proto__.rebound = function rebound (update) {
  if (this.fragment) { this.fragment.rebound(update); }
};

Item__proto__.shuffled = function shuffled () {
  if (this.fragment) { this.fragment.shuffled(); }
};

Item__proto__.valueOf = function valueOf () {
  return this.toString();
};

Item.prototype.findAll = noop;
Item.prototype.findAllComponents = noop;

var ContainerItem = (function (Item) {
  function ContainerItem(options) {
    Item.call(this, options);
  }

  if ( Item ) ContainerItem.__proto__ = Item;
  var ContainerItem__proto__ = ContainerItem.prototype = Object.create( Item && Item.prototype );
  ContainerItem__proto__.constructor = ContainerItem;

  ContainerItem__proto__.detach = function detach () {
    return this.fragment ? this.fragment.detach() : createDocumentFragment();
  };

  ContainerItem__proto__.find = function find (selector) {
    if (this.fragment) {
      return this.fragment.find(selector);
    }
  };

  ContainerItem__proto__.findAll = function findAll (selector, options) {
    if (this.fragment) {
      this.fragment.findAll(selector, options);
    }
  };

  ContainerItem__proto__.findComponent = function findComponent (name) {
    if (this.fragment) {
      return this.fragment.findComponent(name);
    }
  };

  ContainerItem__proto__.findAllComponents = function findAllComponents (name, options) {
    if (this.fragment) {
      this.fragment.findAllComponents(name, options);
    }
  };

  ContainerItem__proto__.firstNode = function firstNode (skipParent) {
    return this.fragment && this.fragment.firstNode(skipParent);
  };

  ContainerItem__proto__.toString = function toString (escape) {
    return this.fragment ? this.fragment.toString(escape) : '';
  };

  return ContainerItem;
}(Item));

var space = /\s+/;

function readStyle(css) {
  if (!isString(css)) { return {}; }

  return cleanCss(css, function (css, reconstruct) {
    return css
      .split(';')
      .filter(function (rule) { return !!rule.trim(); })
      .map(reconstruct)
      .reduce(function (rules, rule) {
        var i = rule.indexOf(':');
        var name = rule.substr(0, i).trim();
        rules[name] = rule.substr(i + 1).trim();
        return rules;
      }, {});
  });
}

function readClass(str) {
  var list = str.split(space);

  // remove any empty entries
  var i = list.length;
  while (i--) {
    if (!list[i]) { list.splice(i, 1); }
  }

  return list;
}

var textTypes = [
  undefined,
  'text',
  'search',
  'url',
  'email',
  'hidden',
  'password',
  'search',
  'reset',
  'submit'
];

function getUpdateDelegate(attribute) {
  var element = attribute.element;
  var name = attribute.name;

  if (name === 'value') {
    if (attribute.interpolator) { attribute.interpolator.bound = true; }

    // special case - selects
    if (element.name === 'select' && name === 'value') {
      return element.getAttribute('multiple') ? updateMultipleSelectValue : updateSelectValue;
    }

    if (element.name === 'textarea') { return updateStringValue; }

    // special case - contenteditable
    if (element.getAttribute('contenteditable') != null) { return updateContentEditableValue; }

    // special case - <input>
    if (element.name === 'input') {
      var type = element.getAttribute('type');

      // type='file' value='{{fileList}}'>
      if (type === 'file') { return noop; } // read-only

      // type='radio' name='{{twoway}}'
      if (type === 'radio' && element.binding && element.binding.attribute.name === 'name')
        { return updateRadioValue; }

      if (~textTypes.indexOf(type)) { return updateStringValue; }
    }

    return updateValue;
  }

  var node = element.node;

  // special case - <input type='radio' name='{{twoway}}' value='foo'>
  if (attribute.isTwoway && name === 'name') {
    if (node.type === 'radio') { return updateRadioName; }
    if (node.type === 'checkbox') { return updateCheckboxName; }
  }

  if (name === 'style') { return updateStyleAttribute; }

  if (name.indexOf('style-') === 0) { return updateInlineStyle; }

  // special case - class names. IE fucks things up, again
  if (name === 'class' && (!node.namespaceURI || node.namespaceURI === html))
    { return updateClassName; }

  if (name.indexOf('class-') === 0) { return updateInlineClass; }

  if (attribute.isBoolean) {
    var type$1 = element.getAttribute('type');
    if (attribute.interpolator && name === 'checked' && (type$1 === 'checkbox' || type$1 === 'radio'))
      { attribute.interpolator.bound = true; }
    return updateBoolean;
  }

  if (attribute.namespace && attribute.namespace !== attribute.node.namespaceURI)
    { return updateNamespacedAttribute; }

  return updateAttribute;
}

function updateMultipleSelectValue(reset) {
  var value = this.getValue();

  if (!isArray(value)) { value = [value]; }

  var options = this.node.options;
  var i = options.length;

  if (reset) {
    while (i--) { options[i].selected = false; }
  } else {
    while (i--) {
      var option = options[i];
      var optionValue = option._ractive ? option._ractive.value : option.value; // options inserted via a triple don't have _ractive

      option.selected = arrayContains(value, optionValue);
    }
  }
}

function updateSelectValue(reset) {
  var value = this.getValue();

  if (!this.locked) {
    // TODO is locked still a thing?
    this.node._ractive.value = value;

    var options = this.node.options;
    var i = options.length;
    var wasSelected = false;

    if (reset) {
      while (i--) { options[i].selected = false; }
    } else {
      while (i--) {
        var option = options[i];
        var optionValue = option._ractive ? option._ractive.value : option.value; // options inserted via a triple don't have _ractive
        if (option.disabled && option.selected) { wasSelected = true; }

        if (optionValue == value) {
          // double equals as we may be comparing numbers with strings
          option.selected = true;
          return;
        }
      }
    }

    if (!wasSelected) { this.node.selectedIndex = -1; }
  }
}

function updateContentEditableValue(reset) {
  var value = this.getValue();

  if (!this.locked) {
    if (reset) { this.node.innerHTML = ''; }
    else { this.node.innerHTML = isUndefined(value) ? '' : value; }
  }
}

function updateRadioValue(reset) {
  var node = this.node;
  var wasChecked = node.checked;

  var value = this.getValue();

  if (reset) { return (node.checked = false); }

  //node.value = this.element.getAttribute( 'value' );
  node.value = this.node._ractive.value = value;
  node.checked = this.element.compare(value, this.element.getAttribute('name'));

  // This is a special case - if the input was checked, and the value
  // changed so that it's no longer checked, the twoway binding is
  // most likely out of date. To fix it we have to jump through some
  // hoops... this is a little kludgy but it works
  if (wasChecked && !node.checked && this.element.binding && this.element.binding.rendered) {
    this.element.binding.group.model.set(this.element.binding.group.getValue());
  }
}

function updateValue(reset) {
  if (!this.locked) {
    if (reset) {
      this.node.removeAttribute('value');
      this.node.value = this.node._ractive.value = null;
    } else {
      var value = this.getValue();

      this.node.value = this.node._ractive.value = value;
      this.node.setAttribute('value', safeToStringValue(value));
    }
  }
}

function updateStringValue(reset) {
  if (!this.locked) {
    if (reset) {
      this.node._ractive.value = '';
      this.node.removeAttribute('value');
    } else {
      var value = this.getValue();

      this.node._ractive.value = value;

      var safeValue = safeToStringValue(value);

      // fixes #3281 – Safari moves caret position when setting an input value to the same value
      if (this.node.value !== safeValue) {
        this.node.value = safeValue;
      }

      this.node.setAttribute('value', safeValue);
    }
  }
}

function updateRadioName(reset) {
  if (reset) { this.node.checked = false; }
  else { this.node.checked = this.element.compare(this.getValue(), this.element.binding.getValue()); }
}

function updateCheckboxName(reset) {
  var ref = this;
  var element = ref.element;
  var node = ref.node;
  var binding = element.binding;

  var value = this.getValue();
  var valueAttribute = element.getAttribute('value');

  if (!isArray(value)) {
    binding.isChecked = node.checked = element.compare(value, valueAttribute);
  } else {
    var i = value.length;
    while (i--) {
      if (element.compare(valueAttribute, value[i])) {
        binding.isChecked = node.checked = true;
        return;
      }
    }
    binding.isChecked = node.checked = false;
  }
}

function updateStyleAttribute(reset) {
  var props = reset ? {} : readStyle(this.getValue() || '');
  var style = this.node.style;
  var keys$$1 = keys(props);
  var prev = this.previous || [];

  var i = 0;
  while (i < keys$$1.length) {
    if (keys$$1[i] in style) {
      var safe = props[keys$$1[i]].replace('!important', '');
      style.setProperty(keys$$1[i], safe, safe.length !== props[keys$$1[i]].length ? 'important' : '');
    }
    i++;
  }

  // remove now-missing attrs
  i = prev.length;
  while (i--) {
    if (!~keys$$1.indexOf(prev[i]) && prev[i] in style) { style.setProperty(prev[i], '', ''); }
  }

  this.previous = keys$$1;
}

function updateInlineStyle(reset) {
  if (!this.style) {
    this.style = hyphenateCamel(this.name.substr(6));
  }

  if (reset && this.node.style.getPropertyValue(this.style) !== this.last) { return; }

  var value = reset ? '' : safeToStringValue(this.getValue());
  var safe = value.replace('!important', '');
  this.node.style.setProperty(this.style, safe, safe.length !== value.length ? 'important' : '');
  this.last = this.node.style.getPropertyValue(this.style);
}

function updateClassName(reset) {
  var value = reset ? [] : readClass(safeToStringValue(this.getValue()));

  // watch out for werdo svg elements
  var cls = this.node.className;
  cls = cls.baseVal !== undefined ? cls.baseVal : cls;

  var attr = readClass(cls);
  var prev = this.previous || [];

  var className = value.concat(attr.filter(function (c) { return !~prev.indexOf(c); })).join(' ');

  if (className !== cls) {
    if (!isString(this.node.className)) {
      this.node.className.baseVal = className;
    } else {
      this.node.className = className;
    }
  }

  this.previous = value;
}

function updateInlineClass(reset) {
  var name = this.name.substr(6);

  // watch out for werdo svg elements
  var cls = this.node.className;
  cls = cls.baseVal !== undefined ? cls.baseVal : cls;

  var attr = readClass(cls);
  var value = reset ? false : this.getValue();

  if (!this.inlineClass) { this.inlineClass = name; }

  if (value && !~attr.indexOf(name)) { attr.push(name); }
  else if (!value && ~attr.indexOf(name)) { attr.splice(attr.indexOf(name), 1); }

  if (!isString(this.node.className)) {
    this.node.className.baseVal = attr.join(' ');
  } else {
    this.node.className = attr.join(' ');
  }
}

function updateBoolean(reset) {
  // with two-way binding, only update if the change wasn't initiated by the user
  // otherwise the cursor will often be sent to the wrong place
  if (!this.locked) {
    if (reset) {
      if (this.useProperty) { this.node[this.propertyName] = false; }
      this.node.removeAttribute(this.propertyName);
    } else {
      if (this.useProperty) {
        this.node[this.propertyName] = this.getValue();
      } else {
        var val = this.getValue();
        if (val) {
          this.node.setAttribute(this.propertyName, isString(val) ? val : '');
        } else {
          this.node.removeAttribute(this.propertyName);
        }
      }
    }
  }
}

function updateAttribute(reset) {
  if (reset) {
    if (this.node.getAttribute(this.name) === this.value) {
      this.node.removeAttribute(this.name);
    }
  } else {
    this.value = safeToStringValue(this.getString());
    this.node.setAttribute(this.name, this.value);
  }
}

function updateNamespacedAttribute(reset) {
  if (reset) {
    if (
      this.value ===
      this.node.getAttributeNS(this.namespace, this.name.slice(this.name.indexOf(':') + 1))
    ) {
      this.node.removeAttributeNS(this.namespace, this.name.slice(this.name.indexOf(':') + 1));
    }
  } else {
    this.value = safeToStringValue(this.getString());
    this.node.setAttributeNS(
      this.namespace,
      this.name.slice(this.name.indexOf(':') + 1),
      this.value
    );
  }
}

var propertyNames = {
  'accept-charset': 'acceptCharset',
  accesskey: 'accessKey',
  bgcolor: 'bgColor',
  class: 'className',
  codebase: 'codeBase',
  colspan: 'colSpan',
  contenteditable: 'contentEditable',
  datetime: 'dateTime',
  dirname: 'dirName',
  for: 'htmlFor',
  'http-equiv': 'httpEquiv',
  ismap: 'isMap',
  maxlength: 'maxLength',
  novalidate: 'noValidate',
  pubdate: 'pubDate',
  readonly: 'readOnly',
  rowspan: 'rowSpan',
  tabindex: 'tabIndex',
  usemap: 'useMap'
};

var div$1 = doc ? createElement('div') : null;

var attributes = false;
function inAttributes() {
  return attributes;
}

var ConditionalAttribute = (function (Item) {
  function ConditionalAttribute(options) {
    Item.call(this, options);

    this.attributes = [];

    this.owner = options.owner;

    this.fragment = new Fragment({
      ractive: this.ractive,
      owner: this,
      template: this.template
    });

    // this fragment can't participate in node-y things
    this.fragment.findNextNode = noop;

    this.dirty = false;
  }

  if ( Item ) ConditionalAttribute.__proto__ = Item;
  var ConditionalAttribute__proto__ = ConditionalAttribute.prototype = Object.create( Item && Item.prototype );
  ConditionalAttribute__proto__.constructor = ConditionalAttribute;

  ConditionalAttribute__proto__.bind = function bind () {
    this.fragment.bind();
  };

  ConditionalAttribute__proto__.bubble = function bubble () {
    if (!this.dirty) {
      this.dirty = true;
      this.owner.bubble();
    }
  };

  ConditionalAttribute__proto__.destroyed = function destroyed () {
    this.unrender();
  };

  ConditionalAttribute__proto__.render = function render () {
    this.node = this.owner.node;
    if (this.node) {
      this.isSvg = this.node.namespaceURI === svg$1;
    }

    attributes = true;
    if (!this.rendered) { this.fragment.render(); }

    this.rendered = true;
    this.dirty = true; // TODO this seems hacky, but necessary for tests to pass in browser AND node.js
    this.update();
    attributes = false;
  };

  ConditionalAttribute__proto__.toString = function toString () {
    return this.fragment.toString();
  };

  ConditionalAttribute__proto__.unbind = function unbind (view) {
    this.fragment.unbind(view);
  };

  ConditionalAttribute__proto__.unrender = function unrender () {
    this.rendered = false;
    this.fragment.unrender();
  };

  ConditionalAttribute__proto__.update = function update () {
    var this$1 = this;

    var str;
    var attrs;

    if (this.dirty) {
      this.dirty = false;

      var current = attributes;
      attributes = true;
      this.fragment.update();

      if (this.rendered && this.node) {
        str = this.fragment.toString();

        attrs = parseAttributes(str, this.isSvg);

        // any attributes that previously existed but no longer do
        // must be removed
        this.attributes
          .filter(function (a) { return notIn(attrs, a); })
          .forEach(function (a) {
            this$1.node.removeAttribute(a.name);
          });

        attrs.forEach(function (a) {
          this$1.node.setAttribute(a.name, a.value);
        });

        this.attributes = attrs;
      }

      attributes = current || false;
    }
  };

  return ConditionalAttribute;
}(Item));

var onlyWhitespace = /^\s*$/;
function parseAttributes(str, isSvg) {
  if (onlyWhitespace.test(str)) { return []; }
  var tagName = isSvg ? 'svg' : 'div';
  return str
    ? (div$1.innerHTML = "<" + tagName + " " + str + "></" + tagName + ">") && toArray(div$1.childNodes[0].attributes)
    : [];
}

function notIn(haystack, needle) {
  var i = haystack.length;

  while (i--) {
    if (haystack[i].name === needle.name) {
      return false;
    }
  }

  return true;
}

function lookupNamespace(node, prefix) {
  var qualified = "xmlns:" + prefix;

  while (node) {
    if (node.hasAttribute && node.hasAttribute(qualified)) { return node.getAttribute(qualified); }
    node = node.parentNode;
  }

  return namespaces[prefix];
}

var attribute = false;
function inAttribute() {
  return attribute;
}

var Attribute = (function (Item) {
  function Attribute(options) {
    Item.call(this, options);

    this.name = options.template.n;
    this.namespace = null;

    this.owner = options.owner || options.up.owner || options.element || findElement(options.up);
    this.element =
      options.element || (this.owner.attributeByName ? this.owner : findElement(options.up));
    this.up = options.up; // shared
    this.ractive = this.up.ractive;

    this.rendered = false;
    this.updateDelegate = null;
    this.fragment = null;

    this.element.attributeByName[this.name] = this;

    if (!isArray(options.template.f)) {
      this.value = options.template.f;
      if (this.value === 0) {
        this.value = '';
      } else if (isUndefined(this.value)) {
        this.value = true;
      }
      return;
    } else {
      this.fragment = new Fragment({
        owner: this,
        template: options.template.f
      });
    }

    this.interpolator =
      this.fragment &&
      this.fragment.items.length === 1 &&
      this.fragment.items[0].type === INTERPOLATOR &&
      this.fragment.items[0];

    if (this.interpolator) { this.interpolator.owner = this; }
  }

  if ( Item ) Attribute.__proto__ = Item;
  var Attribute__proto__ = Attribute.prototype = Object.create( Item && Item.prototype );
  Attribute__proto__.constructor = Attribute;

  Attribute__proto__.bind = function bind () {
    if (this.fragment) {
      this.fragment.bind();
    }
  };

  Attribute__proto__.bubble = function bubble () {
    if (!this.dirty) {
      this.up.bubble();
      this.element.bubble();
      this.dirty = true;
    }
  };

  Attribute__proto__.firstNode = function firstNode () {};

  Attribute__proto__.getString = function getString () {
    attribute = true;
    var value = this.fragment
      ? this.fragment.toString()
      : this.value != null
      ? '' + this.value
      : '';
    attribute = false;
    return value;
  };

  // TODO could getValue ever be called for a static attribute,
  // or can we assume that this.fragment exists?
  Attribute__proto__.getValue = function getValue () {
    attribute = true;
    var value = this.fragment
      ? this.fragment.valueOf()
      : booleanAttributes[this.name.toLowerCase()]
      ? true
      : this.value;
    attribute = false;
    return value;
  };

  Attribute__proto__.render = function render () {
    var node = this.element.node;
    this.node = node;

    // should we use direct property access, or setAttribute?
    if (!node.namespaceURI || node.namespaceURI === namespaces.html) {
      this.propertyName = propertyNames[this.name] || this.name;

      if (node[this.propertyName] !== undefined) {
        this.useProperty = true;
      }

      // is attribute a boolean attribute or 'value'? If so we're better off doing e.g.
      // node.selected = true rather than node.setAttribute( 'selected', '' )
      if (booleanAttributes[this.name.toLowerCase()] || this.isTwoway) {
        this.isBoolean = true;
      }

      if (this.propertyName === 'value') {
        node._ractive.value = this.value;
      }
    }

    if (node.namespaceURI) {
      var index = this.name.indexOf(':');
      if (index !== -1) {
        this.namespace = lookupNamespace(node, this.name.slice(0, index));
      } else {
        this.namespace = node.namespaceURI;
      }
    }

    this.rendered = true;
    this.updateDelegate = getUpdateDelegate(this);
    this.updateDelegate();
  };

  Attribute__proto__.toString = function toString () {
    if (inAttributes()) { return ''; }
    attribute = true;

    var value = this.getValue();

    // Special case - select and textarea values (should not be stringified)
    if (
      this.name === 'value' &&
      (this.element.getAttribute('contenteditable') !== undefined ||
        (this.element.name === 'select' || this.element.name === 'textarea'))
    ) {
      return;
    }

    // Special case – bound radio `name` attributes
    if (
      this.name === 'name' &&
      this.element.name === 'input' &&
      this.interpolator &&
      this.element.getAttribute('type') === 'radio'
    ) {
      return ("name=\"{{" + (this.interpolator.model.getKeypath()) + "}}\"");
    }

    // Special case - style and class attributes and directives
    if (
      this.owner === this.element &&
      (this.name === 'style' || this.name === 'class' || this.style || this.inlineClass)
    ) {
      return;
    }

    if (
      !this.rendered &&
      this.owner === this.element &&
      (!this.name.indexOf('style-') || !this.name.indexOf('class-'))
    ) {
      if (!this.name.indexOf('style-')) {
        this.style = hyphenateCamel(this.name.substr(6));
      } else {
        this.inlineClass = this.name.substr(6);
      }

      return;
    }

    if (booleanAttributes[this.name.toLowerCase()])
      { return value
        ? isString(value)
          ? ((this.name) + "=\"" + (safeAttributeString(value)) + "\"")
          : this.name
        : ''; }
    if (value == null) { return ''; }

    var str = safeAttributeString(this.getString());
    attribute = false;

    return str ? ((this.name) + "=\"" + str + "\"") : this.name;
  };

  Attribute__proto__.unbind = function unbind (view) {
    if (this.fragment) { this.fragment.unbind(view); }
  };

  Attribute__proto__.unrender = function unrender () {
    this.updateDelegate(true);

    this.rendered = false;
  };

  Attribute__proto__.update = function update () {
    if (this.dirty) {
      var binding;
      this.dirty = false;
      if (this.fragment) { this.fragment.update(); }
      if (this.rendered) { this.updateDelegate(); }
      if (this.isTwoway && !this.locked) {
        this.interpolator.twowayBinding.lastVal(true, this.interpolator.model.get());
      } else if (this.name === 'value' && (binding = this.element.binding)) {
        // special case: name bound element with dynamic value
        var attr = binding.attribute;
        if (attr && !attr.dirty && attr.rendered) {
          this.element.binding.attribute.updateDelegate();
        }
      }
    }
  };

  return Attribute;
}(Item));

var BindingFlag = (function (Item) {
  function BindingFlag(options) {
    Item.call(this, options);

    this.owner = options.owner || options.up.owner || findElement(options.up);
    this.element = this.owner.attributeByName ? this.owner : findElement(options.up);
    this.flag = options.template.v === 'l' ? 'lazy' : 'twoway';
    this.bubbler = this.owner === this.element ? this.element : this.up;

    if (this.element.type === ELEMENT) {
      if (isArray(options.template.f)) {
        this.fragment = new Fragment({
          owner: this,
          template: options.template.f
        });
      }

      this.interpolator =
        this.fragment &&
        this.fragment.items.length === 1 &&
        this.fragment.items[0].type === INTERPOLATOR &&
        this.fragment.items[0];
    }
  }

  if ( Item ) BindingFlag.__proto__ = Item;
  var BindingFlag__proto__ = BindingFlag.prototype = Object.create( Item && Item.prototype );
  BindingFlag__proto__.constructor = BindingFlag;

  BindingFlag__proto__.bind = function bind () {
    if (this.fragment) { this.fragment.bind(); }
    set$1(this, this.getValue(), true);
  };

  BindingFlag__proto__.bubble = function bubble () {
    if (!this.dirty) {
      this.bubbler.bubble();
      this.dirty = true;
    }
  };

  BindingFlag__proto__.getValue = function getValue () {
    if (this.fragment) { return this.fragment.valueOf(); }
    else if ('value' in this) { return this.value; }
    else if ('f' in this.template) { return this.template.f; }
    else { return true; }
  };

  BindingFlag__proto__.render = function render () {
    set$1(this, this.getValue(), true);
  };

  BindingFlag__proto__.toString = function toString () {
    return '';
  };

  BindingFlag__proto__.unbind = function unbind (view) {
    if (this.fragment) { this.fragment.unbind(view); }

    delete this.element[this.flag];
  };

  BindingFlag__proto__.unrender = function unrender () {
    if (this.element.rendered) { this.element.recreateTwowayBinding(); }
  };

  BindingFlag__proto__.update = function update () {
    if (this.dirty) {
      this.dirty = false;
      if (this.fragment) { this.fragment.update(); }
      set$1(this, this.getValue(), true);
    }
  };

  return BindingFlag;
}(Item));

function set$1(flag, value, update) {
  if (value === 0) {
    flag.value = true;
  } else if (value === 'true') {
    flag.value = true;
  } else if (value === 'false' || value === '0') {
    flag.value = false;
  } else {
    flag.value = value;
  }

  var current = flag.element[flag.flag];
  flag.element[flag.flag] = flag.value;
  if (update && !flag.element.attributes.binding && current !== flag.value) {
    flag.element.recreateTwowayBinding();
  }

  return flag.value;
}

function Comment(options) {
  Item.call(this, options);
}

var proto$1 = create(Item.prototype);

assign(proto$1, {
  bind: noop,
  unbind: noop,
  update: noop,

  detach: function detach() {
    return detachNode(this.node);
  },

  firstNode: function firstNode() {
    return this.node;
  },

  render: function render(target) {
    this.rendered = true;

    this.node = doc.createComment(this.template.c);
    target.appendChild(this.node);
  },

  toString: function toString() {
    return ("<!-- " + (this.template.c) + " -->");
  },

  unrender: function unrender(shouldDestroy) {
    if (this.rendered && shouldDestroy) { this.detach(); }
    this.rendered = false;
  }
});

Comment.prototype = proto$1;

// Teardown. This goes through the root fragment and all its children, removing observers
// and generally cleaning up after itself

function Ractive$teardown() {
  var this$1 = this;

  if (this.torndown) {
    warnIfDebug('ractive.teardown() was called on a Ractive instance that was already torn down');
    return Promise.resolve();
  }

  this.shouldDestroy = true;
  return teardown$1(this, function () { return (this$1.fragment.rendered ? this$1.unrender() : Promise.resolve()); });
}

function teardown$1(instance, getPromise) {
  instance.torndown = true;
  instance.fragment.unbind();
  instance._observers.slice().forEach(cancel);

  if (instance.el && instance.el.__ractive_instances__) {
    removeFromArray(instance.el.__ractive_instances__, instance);
  }

  var promise = getPromise();

  hooks.teardown.fire(instance);

  promise.then(function () {
    hooks.destruct.fire(instance);
    instance.viewmodel.teardown();
  });

  return promise;
}

var RactiveModel = (function (SharedModel) {
  function RactiveModel(ractive) {
    SharedModel.call(this, ractive, '@this');
    this.ractive = ractive;
  }

  if ( SharedModel ) RactiveModel.__proto__ = SharedModel;
  var RactiveModel__proto__ = RactiveModel.prototype = Object.create( SharedModel && SharedModel.prototype );
  RactiveModel__proto__.constructor = RactiveModel;

  RactiveModel__proto__.joinKey = function joinKey (key) {
    var model = SharedModel.prototype.joinKey.call(this, key);

    if ((key === 'root' || key === 'parent') && !model.isLink) { return initLink(model, key); }
    else if (key === 'data') { return this.ractive.viewmodel; }
    else if (key === 'cssData') { return this.ractive.constructor._cssModel; }

    return model;
  };

  return RactiveModel;
}(SharedModel));

function initLink(model, key) {
  model.applyValue = function(value) {
    this.parent.value[key] = value;
    if (value && value.viewmodel) {
      this.link(value.viewmodel.getRactiveModel(), key);
      this._link.markedAll();
    } else {
      this.link(create(Missing), key);
      this._link.markedAll();
    }
  };

  if (key === 'root') {
    var mark = model.mark;
    model.mark = function(force) {
      if (this._marking) { return; }
      this._marking = true;
      mark.apply(this, force);
      this._marking = false;
    };
  }

  model.applyValue(model.parent.ractive[key], key);
  model._link.set = function (v) { return model.applyValue(v); };
  model._link.applyValue = function (v) { return model.applyValue(v); };

  return model._link;
}

var specialModels = {
  '@this': function _this(root) {
    return root.getRactiveModel();
  },
  '@global': function _global() {
    return GlobalModel;
  },
  '@shared': function _shared() {
    return SharedModel$1;
  },
  '@style': function _style(root) {
    return root.getRactiveModel().joinKey('cssData');
  },
  '@helpers': function _helpers(root) {
    return root.getHelpers();
  }
};
specialModels['@'] = specialModels['@this'];

var RootModel = (function (Model) {
  function RootModel(options) {
    Model.call(this, null, null);

    this.isRoot = true;
    this.root = this;
    this.ractive = options.ractive; // TODO sever this link

    this.value = options.data;
    this.adaptors = options.adapt;
    this.adapt();
  }

  if ( Model ) RootModel.__proto__ = Model;
  var RootModel__proto__ = RootModel.prototype = Object.create( Model && Model.prototype );
  RootModel__proto__.constructor = RootModel;

  RootModel__proto__.attached = function attached (fragment) {
    attachImplicits(this, fragment);
  };

  RootModel__proto__.createLink = function createLink (keypath, target, targetPath, options) {
    var keys = splitKeypath(keypath);

    var model = this;
    while (keys.length) {
      var key = keys.shift();
      model = model.childByKey[key] || model.joinKey(key);
    }

    return model.link(target, targetPath, options);
  };

  RootModel__proto__.detached = function detached () {
    detachImplicits(this);
  };

  RootModel__proto__.get = function get (shouldCapture, options) {
    if (shouldCapture) { capture(this); }

    if (!options || options.virtual !== false) {
      return this.getVirtual();
    } else {
      return this.value;
    }
  };

  RootModel__proto__.getHelpers = function getHelpers () {
    if (!this.helpers) { this.helpers = new SharedModel(this.ractive.helpers, 'helpers', this.ractive); }
    return this.helpers;
  };

  RootModel__proto__.getKeypath = function getKeypath () {
    return '';
  };

  RootModel__proto__.getRactiveModel = function getRactiveModel () {
    return this.ractiveModel || (this.ractiveModel = new RactiveModel(this.ractive));
  };

  RootModel__proto__.getValueChildren = function getValueChildren () {
    var children = Model.prototype.getValueChildren.call(this, this.value);

    this.children.forEach(function (child) {
      if (child._link) {
        var idx = children.indexOf(child);
        if (~idx) { children.splice(idx, 1, child._link); }
        else { children.push(child._link); }
      }
    });

    return children;
  };

  RootModel__proto__.has = function has (key) {
    if (key[0] === '~' && key[1] === '/') { key = key.slice(2); }
    if (specialModels[key] || key === '') { return true; }

    if (Model.prototype.has.call(this, key)) {
      return true;
    } else {
      var unescapedKey = unescapeKey(key);

      // mappings/links and computations
      if (this.childByKey[unescapedKey] && this.childByKey[unescapedKey]._link) { return true; }
    }
  };

  RootModel__proto__.joinKey = function joinKey (key, opts) {
    if (key[0] === '~' && key[1] === '/') { key = key.slice(2); }

    if (key[0] === '@') {
      var fn = specialModels[key];
      if (fn) { return fn(this); }
    } else {
      return Model.prototype.joinKey.call(this, key, opts);
    }
  };

  RootModel__proto__.set = function set (value) {
    // TODO wrapping root node is a baaaad idea. We should prevent this
    var wrapper = this.wrapper;
    if (wrapper) {
      var shouldTeardown = !wrapper.reset || wrapper.reset(value) === false;

      if (shouldTeardown) {
        wrapper.teardown();
        this.wrapper = null;
        this.value = value;
        this.adapt();
      }
    } else {
      this.value = value;
      this.adapt();
    }

    this.deps.forEach(handleChange);
    this.children.forEach(mark);
  };

  RootModel__proto__.retrieve = function retrieve () {
    return this.wrapper ? this.wrapper.get() : this.value;
  };

  RootModel__proto__.teardown = function teardown () {
    Model.prototype.teardown.call(this);
    this.ractiveModel && this.ractiveModel.teardown();
  };

  return RootModel;
}(Model));
RootModel.prototype.update = noop;

function attachImplicits(model, fragment) {
  if (model._link && model._link.implicit && model._link.isDetached()) {
    model.attach(fragment);
  }

  // look for virtual children to relink and cascade
  for (var k in model.childByKey) {
    if (model.value) {
      if (k in model.value) {
        attachImplicits(model.childByKey[k], fragment);
      } else if (!model.childByKey[k]._link || model.childByKey[k]._link.isDetached()) {
        var mdl = resolveReference(fragment, k);
        if (mdl) {
          model.childByKey[k].link(mdl, k, { implicit: true });
        }
      }
    }
  }
}

function detachImplicits(model) {
  if (model._link && model._link.implicit) {
    model.unlink();
  }

  for (var k in model.childByKey) {
    detachImplicits(model.childByKey[k]);
  }
}

function subscribe(instance, options, type) {
  var subs = (instance.constructor[("_" + type)] || []).concat(toPairs(options[type] || []));
  var single = type === 'on' ? 'once' : (type + "Once");

  subs.forEach(function (ref) {
    var target = ref[0];
    var config = ref[1];

    if (isFunction(config)) {
      instance[type](target, config);
    } else if (isObjectType(config) && isFunction(config.handler)) {
      instance[config.once ? single : type](target, config.handler, create(config));
    }
  });
}

var registryNames$1 = [
  'adaptors',
  'components',
  'decorators',
  'easing',
  'events',
  'interpolators',
  'partials',
  'transitions'
];

var protoRegistries = ['computed', 'helpers'];

var uid = 0;

function construct(ractive, options) {
  if (Ractive.DEBUG) { welcome(); }

  initialiseProperties(ractive);
  handleAttributes(ractive);

  // set up event subscribers
  subscribe(ractive, options, 'on');

  // if there's not a delegation setting, inherit from parent if it's not default
  if (
    !hasOwn(options, 'delegate') &&
    ractive.parent &&
    ractive.parent.delegate !== ractive.delegate
  ) {
    ractive.delegate = false;
  }

  // plugins that need to run at construct
  if (isArray(options.use)) {
    ractive.use.apply(ractive, options.use.filter(function (p) { return p.construct; }));
  }

  hooks.construct.fire(ractive, options);
  if (options.onconstruct) { options.onconstruct.call(ractive, getRactiveContext(ractive), options); }

  // Add registries
  var i = registryNames$1.length;
  while (i--) {
    var name = registryNames$1[i];
    ractive[name] = assign(create(ractive.constructor[name] || null), options[name]);
  }

  i = protoRegistries.length;
  while (i--) {
    var name$1 = protoRegistries[i];
    ractive[name$1] = assign(create(ractive.constructor.prototype[name$1]), options[name$1]);
  }

  if (ractive._attributePartial) {
    ractive.partials['extra-attributes'] = ractive._attributePartial;
    delete ractive._attributePartial;
  }

  // Create a viewmodel
  var viewmodel = new RootModel({
    adapt: getAdaptors(ractive, ractive.adapt, options),
    data: dataConfigurator.init(ractive.constructor, ractive, options),
    ractive: ractive
  });

  // once resolved, share the adaptors array between the root model and instance
  ractive.adapt = viewmodel.adaptors;

  ractive.viewmodel = viewmodel;

  for (var k in ractive.computed) {
    compute.call(ractive, k, ractive.computed[k]);
  }
}

function getAdaptors(ractive, protoAdapt, options) {
  protoAdapt = protoAdapt.map(lookup);
  var adapt = ensureArray(options.adapt).map(lookup);

  var srcs = [protoAdapt, adapt];
  if (ractive.parent && !ractive.isolated) {
    srcs.push(ractive.parent.viewmodel.adaptors);
  }

  return combine.apply(null, srcs);

  function lookup(adaptor) {
    if (isString(adaptor)) {
      adaptor = findInViewHierarchy('adaptors', ractive, adaptor);

      if (!adaptor) {
        fatal(missingPlugin(adaptor, 'adaptor'));
      }
    }

    return adaptor;
  }
}

function initialiseProperties(ractive) {
  // Generate a unique identifier, for places where you'd use a weak map if it
  // existed
  ractive._guid = 'r-' + uid++;

  // events
  ractive._subs = create(null);
  ractive._nsSubs = 0;

  // storage for item configuration from instantiation to reset,
  // like dynamic functions or original values
  ractive._config = {};

  // events
  ractive.event = null;
  ractive._eventQueue = [];

  // observers
  ractive._observers = [];

  // external children
  ractive._children = [];
  ractive._children.byName = {};
  ractive.children = ractive._children;

  if (!ractive.component) {
    ractive.root = ractive;
    ractive.parent = ractive.container = null; // TODO container still applicable?
  }
}

function handleAttributes(ractive) {
  var component = ractive.component;
  var attributes = ractive.constructor.attributes;

  if (attributes && component) {
    var tpl = component.template;
    var attrs = tpl.m ? tpl.m.slice() : [];

    // grab all of the passed attribute names
    var props = attrs.filter(function (a) { return a.t === ATTRIBUTE; }).map(function (a) { return a.n; });

    // warn about missing requireds
    attributes.required.forEach(function (p) {
      if (!~props.indexOf(p)) {
        warnIfDebug(("Component '" + (component.name) + "' requires attribute '" + p + "' to be provided"));
      }
    });

    // set up a partial containing non-property attributes
    var all = attributes.optional.concat(attributes.required);
    var partial = [];
    var i = attrs.length;
    while (i--) {
      var a = attrs[i];
      if (a.t === ATTRIBUTE && !~all.indexOf(a.n)) {
        if (attributes.mapAll) {
          // map the attribute if requested and make the extra attribute in the partial refer to the mapping
          partial.unshift({
            t: ATTRIBUTE,
            n: a.n,
            f: [{ t: INTERPOLATOR, r: ("~/" + (a.n)) }]
          });
        } else {
          // transfer the attribute to the extra attributes partal
          partial.unshift(attrs.splice(i, 1)[0]);
        }
      } else if (
        !attributes.mapAll &&
        (a.t === DECORATOR || a.t === TRANSITION || a.t === BINDING_FLAG)
      ) {
        partial.unshift(attrs.splice(i, 1)[0]);
      }
    }

    if (partial.length) { component.template = { t: tpl.t, e: tpl.e, f: tpl.f, m: attrs, p: tpl.p }; }
    ractive._attributePartial = partial;
  }
}

var Component = (function (Item) {
  function Component(options, ComponentConstructor) {
    var this$1 = this;

    Item.call(this, options);
    var template = options.template;
    this.isAnchor = template.t === ANCHOR;
    this.type = this.isAnchor ? ANCHOR : COMPONENT; // override ELEMENT from super
    var attrs = template.m;

    var partials = template.p || {};
    if (!('content' in partials)) { partials.content = template.f || []; }
    this._partials = partials; // TEMP

    if (this.isAnchor) {
      this.name = template.n;

      this.addChild = addChild;
      this.removeChild = removeChild;
    } else {
      var instance = create(ComponentConstructor.prototype);

      this.instance = instance;
      this.name = template.e;

      if (instance.el || instance.target) {
        warnIfDebug(
          ("The <" + (this.name) + "> component has a default '" + (instance.el ? 'el' : 'target') + "' property; it has been disregarded")
        );
        instance.el = instance.target = null;
      }

      // find container
      var fragment = options.up;
      var container;
      while (fragment) {
        if (fragment.owner.type === YIELDER) {
          container = fragment.owner.container;
          break;
        }

        fragment = fragment.parent;
      }

      // add component-instance-specific properties
      instance.parent = this.up.ractive;
      instance.container = container || null;
      instance.root = instance.parent.root;
      instance.component = this;

      construct(this.instance, { partials: partials });

      // these can be modified during construction
      template = this.template;
      attrs = template.m;

      // allow components that are so inclined to add programmatic mappings
      if (isArray(this.mappings)) {
        attrs = (attrs || []).concat(this.mappings);
      } else if (isString(this.mappings)) {
        attrs = (attrs || []).concat(parser.parse(this.mappings, { attributes: true }).t);
      }

      // for hackability, this could be an open option
      // for any ractive instance, but for now, just
      // for components and just for ractive...
      instance._inlinePartials = partials;
    }

    this.attributeByName = {};
    this.attributes = [];

    if (attrs) {
      var leftovers = [];
      attrs.forEach(function (template) {
        switch (template.t) {
          case ATTRIBUTE:
          case EVENT:
            this$1.attributes.push(
              createItem({
                owner: this$1,
                up: this$1.up,
                template: template
              })
            );
            break;

          case TRANSITION:
          case BINDING_FLAG:
          case DECORATOR:
            break;

          default:
            leftovers.push(template);
            break;
        }
      });

      if (leftovers.length) {
        this.attributes.push(
          new ConditionalAttribute({
            owner: this,
            up: this.up,
            template: leftovers
          })
        );
      }
    }

    this.eventHandlers = [];
  }

  if ( Item ) Component.__proto__ = Item;
  var Component__proto__ = Component.prototype = Object.create( Item && Item.prototype );
  Component__proto__.constructor = Component;

  Component__proto__.bind = function bind () {
    if (!this.isAnchor) {
      this.attributes.forEach(bind$1);
      this.eventHandlers.forEach(bind$1);

      initialise(
        this.instance,
        {
          partials: this._partials
        },
        {
          cssIds: this.up.cssIds
        }
      );

      if (this.instance.target || this.instance.el) { this.extern = true; }

      this.bound = true;
    }
  };

  Component__proto__.bubble = function bubble () {
    if (!this.dirty) {
      this.dirty = true;
      this.up.bubble();
    }
  };

  Component__proto__.destroyed = function destroyed () {
    if (!this.isAnchor && this.instance.fragment) { this.instance.fragment.destroyed(); }
  };

  Component__proto__.detach = function detach () {
    if (this.isAnchor) {
      if (this.instance) { return this.instance.fragment.detach(); }
      return createDocumentFragment();
    }

    return this.instance.fragment.detach();
  };

  Component__proto__.find = function find (selector, options) {
    if (this.instance) { return this.instance.fragment.find(selector, options); }
  };

  Component__proto__.findAll = function findAll (selector, options) {
    if (this.instance) { this.instance.fragment.findAll(selector, options); }
  };

  Component__proto__.findComponent = function findComponent (name, options) {
    if (!name || this.name === name) { return this.instance; }

    if (this.instance.fragment) {
      return this.instance.fragment.findComponent(name, options);
    }
  };

  Component__proto__.findAllComponents = function findAllComponents (name, options) {
    var result = options.result;

    if (this.instance && (!name || this.name === name)) {
      result.push(this.instance);
    }

    if (this.instance) { this.instance.findAllComponents(name, options); }
  };

  Component__proto__.firstNode = function firstNode (skipParent) {
    if (this.instance) { return this.instance.fragment.firstNode(skipParent); }
  };

  Component__proto__.getContext = function getContext () {
    var assigns = [], len = arguments.length;
    while ( len-- ) assigns[ len ] = arguments[ len ];

    assigns.unshift(this.instance);
    return getRactiveContext.apply(null, assigns);
  };

  Component__proto__.rebound = function rebound (update$$1) {
    this.attributes.forEach(function (x) { return x.rebound(update$$1); });
  };

  Component__proto__.render = function render$2 (target, occupants) {
    if (this.isAnchor) {
      this.rendered = true;
      this.target = target;

      if (!checking.length) {
        checking.push(this.ractive);
        if (occupants) {
          this.occupants = occupants;
          checkAnchors();
          this.occupants = null;
        } else {
          runloop.scheduleTask(checkAnchors, true);
        }
      }
    } else {
      this.attributes.forEach(render);
      this.eventHandlers.forEach(render);

      if (this.extern) {
        this.instance.delegate = false;
        this.instance.render();
      } else {
        render$1(this.instance, target, null, occupants);
      }

      this.rendered = true;
    }
  };

  Component__proto__.shuffled = function shuffled () {
    Item.prototype.shuffled.call(this);
    this.instance &&
      !this.instance.isolated &&
      this.instance.fragment &&
      this.instance.fragment.shuffled();
  };

  Component__proto__.toString = function toString () {
    if (this.instance) { return this.instance.toHTML(); }
  };

  Component__proto__.unbind = function unbind$1 (view) {
    if (!this.isAnchor) {
      this.bound = false;

      this.attributes.forEach(unbind);

      if (view) { this.instance.fragment.unbind(); }
      else { teardown$1(this.instance, function () { return runloop.promise(); }); }
    }
  };

  Component__proto__.unrender = function unrender$1 (shouldDestroy) {
    this.shouldDestroy = shouldDestroy;

    if (this.isAnchor) {
      if (this.item) { unrenderItem(this, this.item); }
      this.target = null;
      if (!checking.length) {
        checking.push(this.ractive);
        runloop.scheduleTask(checkAnchors, true);
      }
    } else {
      this.instance.unrender();
      this.instance.el = this.instance.target = null;
      this.attributes.forEach(unrender);
      this.eventHandlers.forEach(unrender);
    }

    this.rendered = false;
  };

  Component__proto__.update = function update$2 () {
    this.dirty = false;
    if (this.instance) {
      this.instance.fragment.update();
      this.attributes.forEach(update);
      this.eventHandlers.forEach(update);
    }
  };

  return Component;
}(Item));

function addChild(meta) {
  if (this.item) { this.removeChild(this.item); }

  var child = meta.instance;
  meta.anchor = this;

  meta.up = this.up;
  meta.name = meta.nameOption || this.name;
  this.name = meta.name;

  if (!child.isolated) { child.viewmodel.attached(this.up); }

  // render as necessary
  if (this.rendered) {
    renderItem(this, meta);
  }
}

function removeChild(meta) {
  // unrender as necessary
  if (this.item === meta) {
    unrenderItem(this, meta);
    this.name = this.template.n;
  }
}

function renderItem(anchor, meta) {
  if (!anchor.rendered) { return; }

  meta.shouldDestroy = false;
  meta.up = anchor.up;

  anchor.item = meta;
  anchor.instance = meta.instance;
  var nextNode = anchor.up.findNextNode(anchor);

  if (meta.instance.fragment.rendered) {
    meta.instance.unrender();
  }

  meta.partials = meta.instance.partials;
  meta.instance.partials = assign(create(meta.partials), meta.partials, anchor._partials);

  meta.instance.fragment.unbind(true);
  meta.instance.fragment.componentParent = anchor.up;
  meta.instance.fragment.bind(meta.instance.viewmodel);

  anchor.attributes.forEach(bind$1);
  anchor.eventHandlers.forEach(bind$1);
  anchor.attributes.forEach(render);
  anchor.eventHandlers.forEach(render);

  var target = anchor.up.findParentNode();
  render$1(meta.instance, target, target.contains(nextNode) ? nextNode : null, anchor.occupants);

  if (meta.lastBound !== anchor) {
    meta.lastBound = anchor;
  }
}

function unrenderItem(anchor, meta) {
  if (!anchor.rendered) { return; }

  meta.shouldDestroy = true;
  meta.instance.unrender();

  anchor.eventHandlers.forEach(unrender);
  anchor.attributes.forEach(unrender);
  anchor.eventHandlers.forEach(unbind);
  anchor.attributes.forEach(unbind);

  meta.instance.el = meta.instance.anchor = null;
  meta.instance.fragment.componentParent = null;
  meta.up = null;
  meta.anchor = null;
  anchor.item = null;
  anchor.instance = null;
}

var checking = [];
function checkAnchors() {
  var list = checking;
  checking = [];

  list.forEach(updateAnchors);
}

function setupArgsFn(item, template, fragment, opts) {
  if ( opts === void 0 ) opts = {};

  if (template && template.f && template.f.s) {
    item.fn = getFunction(template.f.s, template.f.r.length);
    if (opts.register === true) {
      item.models = resolveArgs(item, template, fragment, opts);
    }
  }
}

function resolveArgs(item, template, fragment, opts) {
  if ( opts === void 0 ) opts = {};

  return template.f.r.map(function (ref, i) {
    var model;

    if (opts.specialRef && (model = opts.specialRef(ref, i))) { return model; }

    model = resolveReference(fragment, ref);
    if (opts.register === true) {
      model.register(item);
    }

    return model;
  });
}

function teardownArgsFn(item, template) {
  if (template && template.f && template.f.s) {
    if (item.models)
      { item.models.forEach(function (m) {
        if (m && m.unregister) { m.unregister(item); }
      }); }
    item.models = null;
  }
}

var missingDecorator = {
  update: noop,
  teardown: noop
};

var Decorator = function Decorator(options) {
  this.owner = options.owner || options.up.owner || findElement(options.up);
  this.element = this.owner.attributeByName ? this.owner : findElement(options.up);
  this.up = options.up || this.owner.up;
  this.ractive = this.owner.ractive;
  var template = (this.template = options.template);

  this.name = template.n;

  this.node = null;
  this.handle = null;

  this.element.decorators.push(this);
};
var Decorator__proto__ = Decorator.prototype;

Decorator__proto__.bind = function bind () {
  // if the owner is the elment, make sure the context includes the element
  var frag = this.element === this.owner ? new Fragment({ owner: this.owner }) : this.up;
  setupArgsFn(this, this.template, frag, { register: true });
};

Decorator__proto__.bubble = function bubble () {
  if (!this.dirty) {
    this.dirty = true;
    // decorators may be owned directly by an element or by a fragment if conditional
    this.owner.bubble();
    this.up.bubble();
  }
};

Decorator__proto__.destroyed = function destroyed () {
  if (this.handle) {
    this.handle.teardown();
    this.handle = null;
  }
  this.shouldDestroy = true;
};

Decorator__proto__.handleChange = function handleChange () {
  this.bubble();
};

Decorator__proto__.rebind = function rebind (next, previous, safe) {
  var idx = this.models.indexOf(previous);
  if (!~idx) { return; }

  next = rebindMatch(this.template.f.r[idx], next, previous);
  if (next === previous) { return; }

  previous.unregister(this);
  this.models.splice(idx, 1, next);
  if (next) { next.addShuffleRegister(this, 'mark'); }

  if (!safe) { this.bubble(); }
};

Decorator__proto__.rebound = function rebound (update) {
  teardownArgsFn(this, this.template);
  setupArgsFn(this, this.template, this.up, { register: true });
  if (update) { this.bubble(); }
};

Decorator__proto__.render = function render () {
    var this$1 = this;

  this.shouldDestroy = false;
  if (this.handle) { this.unrender(); }
  runloop.scheduleTask(function () {
    // bail if the host element has managed to become unrendered
    if (!this$1.element.rendered) { return; }

    var fn = findInViewHierarchy('decorators', this$1.ractive, this$1.name);

    if (!fn) {
      warnOnce(missingPlugin(this$1.name, 'decorator'));
      this$1.handle = missingDecorator;
      return;
    }

    this$1.node = this$1.element.node;

    var args;
    if (this$1.fn) {
      args = this$1.models.map(function (model) {
        if (!model) { return undefined; }

        return model.get();
      });
      args = this$1.fn.apply(this$1.ractive, args);
    }

    this$1.handle = fn.apply(this$1.ractive, [this$1.node].concat(args));

    if (!this$1.handle || !this$1.handle.teardown) {
      throw new Error(
        ("The '" + (this$1.name) + "' decorator must return an object with a teardown method")
      );
    }

    // watch out for decorators that cause their host element to be unrendered
    if (this$1.shouldDestroy) { this$1.destroyed(); }
  }, true);
};

Decorator__proto__.toString = function toString () {
  return '';
};

Decorator__proto__.unbind = function unbind () {
  teardownArgsFn(this, this.template);
};

Decorator__proto__.unrender = function unrender (shouldDestroy) {
  if ((!shouldDestroy || this.element.rendered) && this.handle) {
    this.handle.teardown();
    this.handle = null;
  }
};

Decorator__proto__.update = function update () {
  var instance = this.handle;

  if (!this.dirty) {
    if (instance && instance.invalidate) {
      runloop.scheduleTask(function () { return instance.invalidate(); }, true);
    }
    return;
  }

  this.dirty = false;

  if (instance) {
    if (!instance.update) {
      this.unrender();
      this.render();
    } else {
      var args = this.models.map(function (model) { return model && model.get(); });
      instance.update.apply(this.ractive, this.fn.apply(this.ractive, args));
    }
  }
};

Decorator.prototype.firstNode = noop;

var Doctype = (function (Item) {
  function Doctype () {
    Item.apply(this, arguments);
  }

  if ( Item ) Doctype.__proto__ = Item;
  var Doctype__proto__ = Doctype.prototype = Object.create( Item && Item.prototype );
  Doctype__proto__.constructor = Doctype;

  Doctype__proto__.toString = function toString () {
    return '<!DOCTYPE' + this.template.a + '>';
  };

  return Doctype;
}(Item));

var proto$2 = Doctype.prototype;
proto$2.bind = proto$2.render = proto$2.teardown = proto$2.unbind = proto$2.unrender = proto$2.update = noop;

var Binding = function Binding(element, name) {
  if ( name === void 0 ) name = 'value';

  this.element = element;
  this.ractive = element.ractive;
  this.attribute = element.attributeByName[name];

  var interpolator = this.attribute.interpolator;
  interpolator.twowayBinding = this;

  var model = interpolator.model;

  if (model.isReadonly && !model.setRoot) {
    var keypath = model.getKeypath().replace(/^@/, '');
    warnOnceIfDebug(
      ("Cannot use two-way binding on <" + (element.name) + "> element: " + keypath + " is read-only. To suppress this warning use <" + (element.name) + " twoway='false'...>"),
      { ractive: this.ractive }
    );
    return false;
  }

  this.attribute.isTwoway = true;
  this.model = model;

  // initialise value, if it's undefined
  var value = model.get();
  this.wasUndefined = isUndefined(value);

  if (isUndefined(value) && this.getInitialValue) {
    value = this.getInitialValue();
    model.set(value);
  }
  this.lastVal(true, value);

  var parentForm = findElement(this.element, false, 'form');
  if (parentForm) {
    this.resetValue = value;
    parentForm.formBindings.push(this);
  }
};
var Binding__proto__ = Binding.prototype;

Binding__proto__.bind = function bind () {
  this.model.registerTwowayBinding(this);
};

Binding__proto__.handleChange = function handleChange () {
    var this$1 = this;

  var value = this.getValue();
  if (this.lastVal() === value) { return; }

  runloop.start();
  this.attribute.locked = true;
  this.model.set(value);
  this.lastVal(true, value);

  // if the value changes before observers fire, unlock to be updatable cause something weird and potentially freezy is up
  if (this.model.get() !== value) { this.attribute.locked = false; }
  else { runloop.scheduleTask(function () { return (this$1.attribute.locked = false); }); }

  runloop.end();
};

Binding__proto__.lastVal = function lastVal (setting, value) {
  if (setting) { this.lastValue = value; }
  else { return this.lastValue; }
};

Binding__proto__.rebind = function rebind (next, previous) {
    var this$1 = this;

  if (this.model && this.model === previous) { previous.unregisterTwowayBinding(this); }
  if (next) {
    this.model = next;
    runloop.scheduleTask(function () { return next.registerTwowayBinding(this$1); });
  }
};

Binding__proto__.rebound = function rebound () {
  if (this.model) { this.model.unregisterTwowayBinding(this); }
  this.model = this.attribute.interpolator.model;
  this.model && this.model.registerTwowayBinding(this);
};

Binding__proto__.render = function render () {
  this.node = this.element.node;
  this.node._ractive.binding = this;
  this.rendered = true; // TODO is this used anywhere?
};

Binding__proto__.setFromNode = function setFromNode (node) {
  this.model.set(node.value);
};

Binding__proto__.unbind = function unbind () {
  this.model && this.model.unregisterTwowayBinding(this);
};

Binding.prototype.unrender = noop;

// This is the handler for DOM events that would lead to a change in the model
// (i.e. change, sometimes, input, and occasionally click and keyup)
function handleDomEvent() {
  this._ractive.binding.handleChange();
}

var CheckboxBinding = (function (Binding) {
  function CheckboxBinding(element) {
    Binding.call(this, element, 'checked');
  }

  if ( Binding ) CheckboxBinding.__proto__ = Binding;
  var CheckboxBinding__proto__ = CheckboxBinding.prototype = Object.create( Binding && Binding.prototype );
  CheckboxBinding__proto__.constructor = CheckboxBinding;

  CheckboxBinding__proto__.render = function render () {
    Binding.prototype.render.call(this);

    this.element.on('change', handleDomEvent);

    if (this.node.attachEvent) {
      this.element.on('click', handleDomEvent);
    }
  };

  CheckboxBinding__proto__.unrender = function unrender () {
    this.element.off('change', handleDomEvent);

    if (this.node.attachEvent) {
      this.element.off('click', handleDomEvent);
    }
  };

  CheckboxBinding__proto__.getInitialValue = function getInitialValue () {
    return !!this.element.getAttribute('checked');
  };

  CheckboxBinding__proto__.getValue = function getValue () {
    return this.node.checked;
  };

  CheckboxBinding__proto__.setFromNode = function setFromNode (node) {
    this.model.set(node.checked);
  };

  return CheckboxBinding;
}(Binding));

function getBindingGroup(group, model, getValue) {
  var hash = group + "-bindingGroup";
  return model[hash] || (model[hash] = new BindingGroup(hash, model, getValue));
}

var BindingGroup = function BindingGroup(hash, model, getValue) {
  var this$1 = this;

  this.model = model;
  this.hash = hash;
  this.getValue = function () {
    this$1.value = getValue.call(this$1);
    return this$1.value;
  };

  this.bindings = [];
};
var BindingGroup__proto__ = BindingGroup.prototype;

BindingGroup__proto__.add = function add (binding) {
  this.bindings.push(binding);
};

BindingGroup__proto__.bind = function bind () {
    var this$1 = this;

  this.value = this.model.get();
  this.bindings.forEach(function (b) { return b.lastVal(true, this$1.value); });
  this.model.registerTwowayBinding(this);
  this.bound = true;
};

BindingGroup__proto__.remove = function remove (binding) {
  removeFromArray(this.bindings, binding);
  if (!this.bindings.length) {
    this.unbind();
  }
};

BindingGroup__proto__.unbind = function unbind () {
  this.model.unregisterTwowayBinding(this);
  this.bound = false;
  delete this.model[this.hash];
};

BindingGroup.prototype.rebind = Binding.prototype.rebind;

var push$1 = [].push;

function getValue() {
  var this$1 = this;

  var all = this.bindings
    .filter(function (b) { return b.node && b.node.checked; })
    .map(function (b) { return b.element.getAttribute('value'); });
  var res = [];
  all.forEach(function (v) {
    if (!this$1.bindings[0].arrayContains(res, v)) { res.push(v); }
  });
  return res;
}

var CheckboxNameBinding = (function (Binding) {
  function CheckboxNameBinding(element) {
    Binding.call(this, element, 'name');

    this.checkboxName = true; // so that ractive.updateModel() knows what to do with this

    // Each input has a reference to an array containing it and its
    // group, as two-way binding depends on being able to ascertain
    // the status of all inputs within the group
    this.group = getBindingGroup('checkboxes', this.model, getValue);
    this.group.add(this);

    if (this.noInitialValue) {
      this.group.noInitialValue = true;
    }

    // If no initial value was set, and this input is checked, we
    // update the model
    if (this.group.noInitialValue && this.element.getAttribute('checked')) {
      var existingValue = this.model.get();
      var bindingValue = this.element.getAttribute('value');

      if (!this.arrayContains(existingValue, bindingValue)) {
        push$1.call(existingValue, bindingValue); // to avoid triggering runloop with array adaptor
      }
    }
  }

  if ( Binding ) CheckboxNameBinding.__proto__ = Binding;
  var CheckboxNameBinding__proto__ = CheckboxNameBinding.prototype = Object.create( Binding && Binding.prototype );
  CheckboxNameBinding__proto__.constructor = CheckboxNameBinding;

  CheckboxNameBinding__proto__.bind = function bind () {
    if (!this.group.bound) {
      this.group.bind();
    }
  };

  CheckboxNameBinding__proto__.getInitialValue = function getInitialValue () {
    // This only gets called once per group (of inputs that
    // share a name), because it only gets called if there
    // isn't an initial value. By the same token, we can make
    // a note of that fact that there was no initial value,
    // and populate it using any `checked` attributes that
    // exist (which users should avoid, but which we should
    // support anyway to avoid breaking expectations)
    this.noInitialValue = true; // TODO are noInitialValue and wasUndefined the same thing?
    return [];
  };

  CheckboxNameBinding__proto__.getValue = function getValue () {
    return this.group.value;
  };

  CheckboxNameBinding__proto__.handleChange = function handleChange () {
    this.isChecked = this.element.node.checked;
    this.group.value = this.model.get().slice();
    var value = this.element.getAttribute('value');
    if (this.isChecked && !this.arrayContains(this.group.value, value)) {
      this.group.value.push(value);
    } else if (!this.isChecked && this.arrayContains(this.group.value, value)) {
      this.removeFromArray(this.group.value, value);
    }
    // make sure super knows there's a change
    this.lastValue = null;
    Binding.prototype.handleChange.call(this);
  };

  CheckboxNameBinding__proto__.render = function render () {
    Binding.prototype.render.call(this);

    var node = this.node;

    var existingValue = this.model.get();
    var bindingValue = this.element.getAttribute('value');

    if (isArray(existingValue)) {
      this.isChecked = this.arrayContains(existingValue, bindingValue);
    } else {
      this.isChecked = this.element.compare(existingValue, bindingValue);
    }
    node.name = '{{' + this.model.getKeypath() + '}}';
    node.checked = this.isChecked;

    this.element.on('change', handleDomEvent);

    // in case of IE emergency, bind to click event as well
    if (this.node.attachEvent) {
      this.element.on('click', handleDomEvent);
    }
  };

  CheckboxNameBinding__proto__.setFromNode = function setFromNode (node) {
    this.group.bindings.forEach(function (binding) { return (binding.wasUndefined = true); });

    if (node.checked) {
      var valueSoFar = this.group.getValue();
      valueSoFar.push(this.element.getAttribute('value'));

      this.group.model.set(valueSoFar);
    }
  };

  CheckboxNameBinding__proto__.unbind = function unbind () {
    this.group.remove(this);
  };

  CheckboxNameBinding__proto__.unrender = function unrender () {
    var el = this.element;

    el.off('change', handleDomEvent);

    if (this.node.attachEvent) {
      el.off('click', handleDomEvent);
    }
  };

  CheckboxNameBinding__proto__.arrayContains = function arrayContains (selectValue, optionValue) {
    var this$1 = this;

    var i = selectValue.length;
    while (i--) {
      if (this$1.element.compare(optionValue, selectValue[i])) { return true; }
    }
    return false;
  };

  CheckboxNameBinding__proto__.removeFromArray = function removeFromArray (array, item) {
    var this$1 = this;

    if (!array) { return; }
    var i = array.length;
    while (i--) {
      if (this$1.element.compare(item, array[i])) {
        array.splice(i, 1);
      }
    }
  };

  return CheckboxNameBinding;
}(Binding));

var ContentEditableBinding = (function (Binding) {
  function ContentEditableBinding () {
    Binding.apply(this, arguments);
  }

  if ( Binding ) ContentEditableBinding.__proto__ = Binding;
  var ContentEditableBinding__proto__ = ContentEditableBinding.prototype = Object.create( Binding && Binding.prototype );
  ContentEditableBinding__proto__.constructor = ContentEditableBinding;

  ContentEditableBinding__proto__.getInitialValue = function getInitialValue () {
    return this.element.fragment ? this.element.fragment.toString() : '';
  };

  ContentEditableBinding__proto__.getValue = function getValue () {
    return this.element.node.innerHTML;
  };

  ContentEditableBinding__proto__.render = function render () {
    Binding.prototype.render.call(this);

    var el = this.element;

    el.on('change', handleDomEvent);
    el.on('blur', handleDomEvent);

    if (!this.ractive.lazy) {
      el.on('input', handleDomEvent);

      if (this.node.attachEvent) {
        el.on('keyup', handleDomEvent);
      }
    }
  };

  ContentEditableBinding__proto__.setFromNode = function setFromNode (node) {
    this.model.set(node.innerHTML);
  };

  ContentEditableBinding__proto__.unrender = function unrender () {
    var el = this.element;

    el.off('blur', handleDomEvent);
    el.off('change', handleDomEvent);
    el.off('input', handleDomEvent);
    el.off('keyup', handleDomEvent);
  };

  return ContentEditableBinding;
}(Binding));

function handleBlur() {
  handleDomEvent.call(this);

  var value = this._ractive.binding.model.get();
  this.value = value == undefined ? '' : value;
}

function handleDelay(delay) {
  var timeout;

  return function() {
    var this$1 = this;

    if (timeout) { clearTimeout(timeout); }

    timeout = setTimeout(function () {
      var binding = this$1._ractive.binding;
      if (binding.rendered) { handleDomEvent.call(this$1); }
      timeout = null;
    }, delay);
  };
}

var GenericBinding = (function (Binding) {
  function GenericBinding () {
    Binding.apply(this, arguments);
  }

  if ( Binding ) GenericBinding.__proto__ = Binding;
  var GenericBinding__proto__ = GenericBinding.prototype = Object.create( Binding && Binding.prototype );
  GenericBinding__proto__.constructor = GenericBinding;

  GenericBinding__proto__.getInitialValue = function getInitialValue () {
    return '';
  };

  GenericBinding__proto__.getValue = function getValue () {
    return this.node.value;
  };

  GenericBinding__proto__.render = function render () {
    Binding.prototype.render.call(this);

    // any lazy setting for this element overrides the root
    // if the value is a number, it's a timeout
    var lazy = this.ractive.lazy;
    var timeout = false;
    var el = this.element;

    if ('lazy' in this.element) {
      lazy = this.element.lazy;
    }

    if (isNumeric(lazy)) {
      timeout = +lazy;
      lazy = false;
    }

    this.handler = timeout ? handleDelay(timeout) : handleDomEvent;

    var node = this.node;

    el.on('change', handleDomEvent);

    if (node.type !== 'file') {
      if (!lazy) {
        el.on('input', this.handler);

        // IE is a special snowflake
        if (node.attachEvent) {
          el.on('keyup', this.handler);
        }
      }

      el.on('blur', handleBlur);
    }
  };

  GenericBinding__proto__.unrender = function unrender () {
    var el = this.element;
    this.rendered = false;

    el.off('change', handleDomEvent);
    el.off('input', this.handler);
    el.off('keyup', this.handler);
    el.off('blur', handleBlur);
  };

  return GenericBinding;
}(Binding));

var FileBinding = (function (GenericBinding) {
  function FileBinding () {
    GenericBinding.apply(this, arguments);
  }

  if ( GenericBinding ) FileBinding.__proto__ = GenericBinding;
  var FileBinding__proto__ = FileBinding.prototype = Object.create( GenericBinding && GenericBinding.prototype );
  FileBinding__proto__.constructor = FileBinding;

  FileBinding__proto__.getInitialValue = function getInitialValue () {
    /* istanbul ignore next */
    return undefined;
  };

  FileBinding__proto__.getValue = function getValue () {
    /* istanbul ignore next */
    return this.node.files;
  };

  FileBinding__proto__.render = function render () {
    /* istanbul ignore next */
    this.element.lazy = false;
    /* istanbul ignore next */
    GenericBinding.prototype.render.call(this);
  };

  FileBinding__proto__.setFromNode = function setFromNode (node) {
    /* istanbul ignore next */
    this.model.set(node.files);
  };

  return FileBinding;
}(GenericBinding));

function getSelectedOptions(select) {
  /* istanbul ignore next */
  return select.selectedOptions
    ? toArray(select.selectedOptions)
    : select.options
    ? toArray(select.options).filter(function (option) { return option.selected; })
    : [];
}

var MultipleSelectBinding = (function (Binding) {
  function MultipleSelectBinding () {
    Binding.apply(this, arguments);
  }

  if ( Binding ) MultipleSelectBinding.__proto__ = Binding;
  var MultipleSelectBinding__proto__ = MultipleSelectBinding.prototype = Object.create( Binding && Binding.prototype );
  MultipleSelectBinding__proto__.constructor = MultipleSelectBinding;

  MultipleSelectBinding__proto__.getInitialValue = function getInitialValue () {
    return this.element.options
      .filter(function (option) { return option.getAttribute('selected'); })
      .map(function (option) { return option.getAttribute('value'); });
  };

  MultipleSelectBinding__proto__.getValue = function getValue () {
    var options = this.element.node.options;
    var len = options.length;

    var selectedValues = [];

    for (var i = 0; i < len; i += 1) {
      var option = options[i];

      if (option.selected) {
        var optionValue = option._ractive ? option._ractive.value : option.value;
        selectedValues.push(optionValue);
      }
    }

    return selectedValues;
  };

  MultipleSelectBinding__proto__.handleChange = function handleChange () {
    var attribute = this.attribute;
    var previousValue = attribute.getValue();

    var value = this.getValue();

    if (isUndefined(previousValue) || !arrayContentsMatch(value, previousValue)) {
      Binding.prototype.handleChange.call(this);
    }

    return this;
  };

  MultipleSelectBinding__proto__.render = function render () {
    Binding.prototype.render.call(this);

    this.element.on('change', handleDomEvent);

    if (isUndefined(this.model.get())) {
      // get value from DOM, if possible
      this.handleChange();
    }
  };

  MultipleSelectBinding__proto__.setFromNode = function setFromNode (node) {
    var selectedOptions = getSelectedOptions(node);
    var i = selectedOptions.length;
    var result = new Array(i);

    while (i--) {
      var option = selectedOptions[i];
      result[i] = option._ractive ? option._ractive.value : option.value;
    }

    this.model.set(result);
  };

  MultipleSelectBinding__proto__.unrender = function unrender () {
    this.element.off('change', handleDomEvent);
  };

  return MultipleSelectBinding;
}(Binding));

var NumericBinding = (function (GenericBinding) {
  function NumericBinding () {
    GenericBinding.apply(this, arguments);
  }

  if ( GenericBinding ) NumericBinding.__proto__ = GenericBinding;
  var NumericBinding__proto__ = NumericBinding.prototype = Object.create( GenericBinding && GenericBinding.prototype );
  NumericBinding__proto__.constructor = NumericBinding;

  NumericBinding__proto__.getInitialValue = function getInitialValue () {
    return undefined;
  };

  NumericBinding__proto__.getValue = function getValue () {
    var value = parseFloat(this.node.value);
    return isNaN(value) ? undefined : value;
  };

  NumericBinding__proto__.setFromNode = function setFromNode (node) {
    var value = parseFloat(node.value);
    if (!isNaN(value)) { this.model.set(value); }
  };

  return NumericBinding;
}(GenericBinding));

var siblings = {};

function getSiblings(hash) {
  return siblings[hash] || (siblings[hash] = []);
}

var RadioBinding = (function (Binding) {
  function RadioBinding(element) {
    Binding.call(this, element, 'checked');

    this.siblings = getSiblings(this.ractive._guid + this.element.getAttribute('name'));
    this.siblings.push(this);
  }

  if ( Binding ) RadioBinding.__proto__ = Binding;
  var RadioBinding__proto__ = RadioBinding.prototype = Object.create( Binding && Binding.prototype );
  RadioBinding__proto__.constructor = RadioBinding;

  RadioBinding__proto__.getValue = function getValue () {
    return this.node.checked;
  };

  RadioBinding__proto__.handleChange = function handleChange () {
    runloop.start();

    this.siblings.forEach(function (binding) {
      binding.model.set(binding.getValue());
    });

    runloop.end();
  };

  RadioBinding__proto__.render = function render () {
    Binding.prototype.render.call(this);

    this.element.on('change', handleDomEvent);

    if (this.node.attachEvent) {
      this.element.on('click', handleDomEvent);
    }
  };

  RadioBinding__proto__.setFromNode = function setFromNode (node) {
    this.model.set(node.checked);
  };

  RadioBinding__proto__.unbind = function unbind () {
    removeFromArray(this.siblings, this);
  };

  RadioBinding__proto__.unrender = function unrender () {
    this.element.off('change', handleDomEvent);

    if (this.node.attachEvent) {
      this.element.off('click', handleDomEvent);
    }
  };

  return RadioBinding;
}(Binding));

function getValue$1() {
  var checked = this.bindings.filter(function (b) { return b.node.checked; });
  if (checked.length > 0) {
    return checked[0].element.getAttribute('value');
  }
}

var RadioNameBinding = (function (Binding) {
  function RadioNameBinding(element) {
    var this$1 = this;

    Binding.call(this, element, 'name');

    this.group = getBindingGroup('radioname', this.model, getValue$1);
    this.group.add(this);

    if (element.checked) {
      this.group.value = this.getValue();
    }

    this.attribute.interpolator.pathChanged = function () { return this$1.updateName(); };
  }

  if ( Binding ) RadioNameBinding.__proto__ = Binding;
  var RadioNameBinding__proto__ = RadioNameBinding.prototype = Object.create( Binding && Binding.prototype );
  RadioNameBinding__proto__.constructor = RadioNameBinding;

  RadioNameBinding__proto__.bind = function bind () {
    if (!this.group.bound) {
      this.group.bind();
    }
  };

  RadioNameBinding__proto__.getInitialValue = function getInitialValue () {
    if (this.element.getAttribute('checked')) {
      return this.element.getAttribute('value');
    }
  };

  RadioNameBinding__proto__.getValue = function getValue () {
    return this.element.getAttribute('value');
  };

  RadioNameBinding__proto__.handleChange = function handleChange () {
    // If this <input> is the one that's checked, then the value of its
    // `name` model gets set to its value
    if (this.node.checked) {
      this.group.value = this.getValue();
      Binding.prototype.handleChange.call(this);
    }

    this.updateName();
  };

  RadioNameBinding__proto__.lastVal = function lastVal (setting, value) {
    if (!this.group) { return; }
    if (setting) { this.group.lastValue = value; }
    else { return this.group.lastValue; }
  };

  RadioNameBinding__proto__.rebind = function rebind (next, previous) {
    Binding.prototype.rebind.call(this, next, previous);
    this.updateName();
  };

  RadioNameBinding__proto__.rebound = function rebound (update) {
    Binding.prototype.rebound.call(this, update);
    this.updateName();
  };

  RadioNameBinding__proto__.render = function render () {
    Binding.prototype.render.call(this);

    var node = this.node;

    this.updateName();
    node.checked = this.element.compare(this.model.get(), this.element.getAttribute('value'));

    this.element.on('change', handleDomEvent);

    if (node.attachEvent) {
      this.element.on('click', handleDomEvent);
    }
  };

  RadioNameBinding__proto__.setFromNode = function setFromNode (node) {
    if (node.checked) {
      this.group.model.set(this.element.getAttribute('value'));
    }
  };

  RadioNameBinding__proto__.unbind = function unbind () {
    this.group.remove(this);
  };

  RadioNameBinding__proto__.unrender = function unrender () {
    var el = this.element;

    el.off('change', handleDomEvent);

    if (this.node.attachEvent) {
      el.off('click', handleDomEvent);
    }
  };

  RadioNameBinding__proto__.updateName = function updateName () {
    if (this.node) { this.node.name = "{{" + (this.model.getKeypath()) + "}}"; }
  };

  return RadioNameBinding;
}(Binding));

var SingleSelectBinding = (function (Binding) {
  function SingleSelectBinding () {
    Binding.apply(this, arguments);
  }

  if ( Binding ) SingleSelectBinding.__proto__ = Binding;
  var SingleSelectBinding__proto__ = SingleSelectBinding.prototype = Object.create( Binding && Binding.prototype );
  SingleSelectBinding__proto__.constructor = SingleSelectBinding;

  SingleSelectBinding__proto__.forceUpdate = function forceUpdate () {
    var this$1 = this;

    var value = this.getValue();

    if (value !== undefined) {
      this.attribute.locked = true;
      runloop.scheduleTask(function () { return (this$1.attribute.locked = false); });
      this.model.set(value);
    }
  };

  SingleSelectBinding__proto__.getInitialValue = function getInitialValue () {
    if (this.element.getAttribute('value') !== undefined) {
      return;
    }

    var options = this.element.options;
    var len = options.length;

    if (!len) { return; }

    var value;
    var optionWasSelected;
    var i = len;

    // take the final selected option...
    while (i--) {
      var option = options[i];

      if (option.getAttribute('selected')) {
        if (!option.getAttribute('disabled')) {
          value = option.getAttribute('value');
        }

        optionWasSelected = true;
        break;
      }
    }

    // or the first non-disabled option, if none are selected
    if (!optionWasSelected) {
      while (++i < len) {
        if (!options[i].getAttribute('disabled')) {
          value = options[i].getAttribute('value');
          break;
        }
      }
    }

    // This is an optimisation (aka hack) that allows us to forgo some
    // other more expensive work
    // TODO does it still work? seems at odds with new architecture
    if (value !== undefined) {
      this.element.attributeByName.value.value = value;
    }

    return value;
  };

  SingleSelectBinding__proto__.getValue = function getValue () {
    var options = this.node.options;
    var len = options.length;

    var i;
    for (i = 0; i < len; i += 1) {
      var option = options[i];

      if (options[i].selected && !options[i].disabled) {
        return option._ractive ? option._ractive.value : option.value;
      }
    }
  };

  SingleSelectBinding__proto__.render = function render () {
    Binding.prototype.render.call(this);
    this.element.on('change', handleDomEvent);
  };

  SingleSelectBinding__proto__.setFromNode = function setFromNode (node) {
    var option = getSelectedOptions(node)[0];
    this.model.set(option._ractive ? option._ractive.value : option.value);
  };

  SingleSelectBinding__proto__.unrender = function unrender () {
    this.element.off('change', handleDomEvent);
  };

  return SingleSelectBinding;
}(Binding));

function isBindable(attribute) {
  // The fragment must be a single non-string fragment
  if (
    !attribute ||
    !attribute.template.f ||
    attribute.template.f.length !== 1 ||
    attribute.template.f[0].s
  )
    { return false; }

  // A binding is an interpolator `{{ }}`, yey.
  if (attribute.template.f[0].t === INTERPOLATOR) { return true; }

  // The above is probably the only true case. For the rest, show an appropriate
  // warning before returning false.

  // You can't bind a triple curly. HTML values on an attribute makes no sense.
  if (attribute.template.f[0].t === TRIPLE)
    { warnIfDebug('It is not possible create a binding using a triple mustache.'); }

  return false;
}

function selectBinding(element) {
  var name = element.name;
  var attributes = element.attributeByName;
  if (name !== 'input' && name !== 'textarea' && name !== 'select' && !attributes.contenteditable)
    { return; }
  var isBindableByValue = isBindable(attributes.value);
  var isBindableByContentEditable = isBindable(attributes.contenteditable);
  var isContentEditable = element.getAttribute('contenteditable');

  // contenteditable
  // Bind if the contenteditable is true or a binding that may become true.
  if ((isContentEditable || isBindableByContentEditable) && isBindableByValue)
    { return ContentEditableBinding; }

  // <input>
  if (name === 'input') {
    var type = element.getAttribute('type');

    if (type === 'radio') {
      var isBindableByName = isBindable(attributes.name);
      var isBindableByChecked = isBindable(attributes.checked);

      // For radios we can either bind the name or checked, but not both.
      // Name binding is handed instead.
      if (isBindableByName && isBindableByChecked) {
        warnIfDebug(
          'A radio input can have two-way binding on its name attribute, or its checked attribute - not both',
          { ractive: element.root }
        );
        return RadioNameBinding;
      }

      if (isBindableByName) { return RadioNameBinding; }

      if (isBindableByChecked) { return RadioBinding; }

      // Dead end. Unknown binding on radio input.
      return null;
    }

    if (type === 'checkbox') {
      var isBindableByName$1 = isBindable(attributes.name);
      var isBindableByChecked$1 = isBindable(attributes.checked);

      // A checkbox with bindings for both name and checked. Checked treated as
      // the checkbox value, name is treated as a regular binding.
      //
      // See https://github.com/ractivejs/ractive/issues/1749
      if (isBindableByName$1 && isBindableByChecked$1) { return CheckboxBinding; }

      if (isBindableByName$1) { return CheckboxNameBinding; }

      if (isBindableByChecked$1) { return CheckboxBinding; }

      // Dead end. Unknown binding on checkbox input.
      return null;
    }

    if (type === 'file' && isBindableByValue) { return FileBinding; }

    if (type === 'number' && isBindableByValue) { return NumericBinding; }

    if (type === 'range' && isBindableByValue) { return NumericBinding; }

    // Some input of unknown type (browser usually falls back to text).
    if (isBindableByValue) { return GenericBinding; }

    // Dead end. Some unknown input and an unbindable.
    return null;
  }

  // <select>
  if (name === 'select' && isBindableByValue) {
    return element.getAttribute('multiple') ? MultipleSelectBinding : SingleSelectBinding;
  }

  // <textarea>
  if (name === 'textarea' && isBindableByValue) { return GenericBinding; }

  // Dead end. Some unbindable element.
  return null;
}

var endsWithSemi = /;\s*$/;

var Element = (function (ContainerItem) {
  function Element(options) {
    var this$1 = this;

    ContainerItem.call(this, options);

    this.name = options.template.e.toLowerCase();

    // find parent element
    this.parent = findElement(this.up, false);

    if (this.parent && this.parent.name === 'option') {
      throw new Error(
        ("An <option> element cannot contain other elements (encountered <" + (this.name) + ">)")
      );
    }

    this.decorators = [];

    // create attributes
    this.attributeByName = {};

    var attrs;
    var n, attr, val, cls, name, template, leftovers;

    var m = this.template.m;
    var len = (m && m.length) || 0;

    for (var i = 0; i < len; i++) {
      template = m[i];
      if (template.g) {
        (this$1.statics || (this$1.statics = {}))[template.n] = isString(template.f)
          ? template.f
          : template.n;
      } else {
        switch (template.t) {
          case ATTRIBUTE:
          case BINDING_FLAG:
          case DECORATOR:
          case EVENT:
          case TRANSITION:
            attr = createItem({
              owner: this$1,
              up: this$1.up,
              template: template
            });

            n = template.n;

            attrs = attrs || (attrs = this$1.attributes = []);

            if (n === 'value') { val = attr; }
            else if (n === 'name') { name = attr; }
            else if (n === 'class') { cls = attr; }
            else { attrs.push(attr); }

            break;

          case DELEGATE_FLAG:
            this$1.delegate = false;
            break;

          default:
            (leftovers || (leftovers = [])).push(template);
            break;
        }
      }
    }

    if (val) { attrs.push(val); }
    if (name) { attrs.push(name); }
    if (cls) { attrs.unshift(cls); }

    if (leftovers) {
      (attrs || (this.attributes = [])).push(
        new ConditionalAttribute({
          owner: this,
          up: this.up,
          template: leftovers
        })
      );

      // empty leftovers array
      leftovers = [];
    }

    // create children
    if (options.template.f && !options.deferContent) {
      this.fragment = new Fragment({
        template: options.template.f,
        owner: this,
        cssIds: null
      });
    }

    this.binding = null; // filled in later
  }

  if ( ContainerItem ) Element.__proto__ = ContainerItem;
  var Element__proto__ = Element.prototype = Object.create( ContainerItem && ContainerItem.prototype );
  Element__proto__.constructor = Element;

  Element__proto__.bind = function bind () {
    var attrs = this.attributes;
    if (attrs) {
      attrs.binding = true;
      var len = attrs.length;
      for (var i = 0; i < len; i++) { attrs[i].bind(); }
      attrs.binding = false;
    }

    if (this.fragment) { this.fragment.bind(); }

    // create two-way binding if necessary
    if (!this.binding) { this.recreateTwowayBinding(); }
    else { this.binding.bind(); }
  };

  Element__proto__.createTwowayBinding = function createTwowayBinding () {
    if ('twoway' in this ? this.twoway : this.ractive.twoway) {
      var Binding = selectBinding(this);
      if (Binding) {
        var binding = new Binding(this);
        if (binding && binding.model) { return binding; }
      }
    }
  };

  Element__proto__.destroyed = function destroyed$1 () {
    if (this.attributes) { this.attributes.forEach(destroyed); }
    if (this.fragment) { this.fragment.destroyed(); }
  };

  Element__proto__.detach = function detach () {
    // if this element is no longer rendered, the transitions are complete and the attributes can be torn down
    if (!this.rendered) { this.destroyed(); }

    return detachNode(this.node);
  };

  Element__proto__.find = function find (selector, options) {
    if (this.node && matches(this.node, selector)) { return this.node; }
    if (this.fragment) {
      return this.fragment.find(selector, options);
    }
  };

  Element__proto__.findAll = function findAll (selector, options) {
    var result = options.result;

    if (matches(this.node, selector)) {
      result.push(this.node);
    }

    if (this.fragment) {
      this.fragment.findAll(selector, options);
    }
  };

  Element__proto__.findNextNode = function findNextNode () {
    return null;
  };

  Element__proto__.firstNode = function firstNode () {
    return this.node;
  };

  Element__proto__.getAttribute = function getAttribute (name) {
    if (this.statics && name in this.statics) { return this.statics[name]; }
    var attribute = this.attributeByName[name];
    return attribute ? attribute.getValue() : undefined;
  };

  Element__proto__.getContext = function getContext () {
    var assigns = [], len = arguments.length;
    while ( len-- ) assigns[ len ] = arguments[ len ];

    if (this.fragment) { return (ref = this.fragment).getContext.apply(ref, assigns); }

    if (!this.ctx) { this.ctx = new Context(this.up, this); }
    assigns.unshift(create(this.ctx));
    return assign.apply(null, assigns);
    var ref;
  };

  Element__proto__.off = function off (event, callback, capture) {
    if ( capture === void 0 ) capture = false;

    var delegate = this.up.delegate;
    var ref = this.listeners && this.listeners[event];

    if (!ref) { return; }
    removeFromArray(ref, callback);

    if (delegate) {
      var listeners =
        (delegate.listeners || (delegate.listeners = [])) &&
        (delegate.listeners[event] || (delegate.listeners[event] = []));
      if (listeners.refs && !--listeners.refs) { delegate.off(event, delegateHandler, true); }
    } else if (this.rendered) {
      var n = this.node;
      var add = n.addEventListener;
      var rem = n.removeEventListener;

      if (!ref.length) {
        rem.call(n, event, handler, capture);
      } else if (ref.length && !ref.refs && capture) {
        rem.call(n, event, handler, true);
        add.call(n, event, handler, false);
      }
    }
  };

  Element__proto__.on = function on (event, callback, capture) {
    if ( capture === void 0 ) capture = false;

    var delegate = this.up.delegate;
    var ref = (this.listeners || (this.listeners = {}))[event] || (this.listeners[event] = []);

    if (delegate) {
      var listeners =
        ((delegate.listeners || (delegate.listeners = [])) && delegate.listeners[event]) ||
        (delegate.listeners[event] = []);
      if (!listeners.refs) {
        listeners.refs = 0;
        delegate.on(event, delegateHandler, true);
        listeners.refs++;
      } else {
        listeners.refs++;
      }
    } else if (this.rendered) {
      var n = this.node;
      var add = n.addEventListener;
      var rem = n.removeEventListener;

      if (!ref.length) {
        add.call(n, event, handler, capture);
      } else if (ref.length && !ref.refs && capture) {
        rem.call(n, event, handler, false);
        add.call(n, event, handler, true);
      }
    }

    addToArray(this.listeners[event], callback);
  };

  Element__proto__.recreateTwowayBinding = function recreateTwowayBinding () {
    if (this.binding) {
      this.binding.unbind();
      this.binding.unrender();
    }

    if ((this.binding = this.createTwowayBinding())) {
      this.binding.bind();
      if (this.rendered) { this.binding.render(); }
    }
  };

  Element__proto__.rebound = function rebound (update$$1) {
    ContainerItem.prototype.rebound.call(this, update$$1);
    if (this.attributes) { this.attributes.forEach(function (x) { return x.rebound(update$$1); }); }
    if (this.binding) { this.binding.rebound(update$$1); }
  };

  Element__proto__.render = function render (target, occupants) {
    var this$1 = this;

    // TODO determine correct namespace
    this.namespace = getNamespace(this);

    var node;
    var existing = false;

    if (occupants) {
      var n;
      while ((n = occupants.shift())) {
        if (
          n.nodeName.toUpperCase() === this$1.template.e.toUpperCase() &&
          n.namespaceURI === this$1.namespace
        ) {
          this$1.node = node = n;
          existing = true;
          break;
        } else {
          detachNode(n);
        }
      }
    }

    if (!existing && this.node) {
      node = this.node;
      target.appendChild(node);
      existing = true;
    }

    if (!node) {
      var name = this.template.e;
      node = createElement(
        this.namespace === html ? name.toLowerCase() : name,
        this.namespace,
        this.getAttribute('is')
      );
      this.node = node;
    }

    // tie the node to this vdom element
    defineProperty(node, '_ractive', {
      value: {
        proxy: this
      },
      configurable: true
    });

    if (this.statics) {
      keys(this.statics).forEach(function (k) {
        node.setAttribute(k, this$1.statics[k]);
      });
    }

    if (existing && this.foundNode) { this.foundNode(node); }

    // register intro before rendering content so children can find the intro
    var intro = this.intro;
    if (intro && intro.shouldFire('intro')) {
      intro.isIntro = true;
      intro.isOutro = false;
      runloop.registerTransition(intro);
    }

    if (this.fragment) {
      var children = existing ? toArray(node.childNodes) : undefined;

      this.fragment.render(node, children);

      // clean up leftover children
      if (children) {
        children.forEach(detachNode);
      }
    }

    if (existing) {
      // store initial values for two-way binding
      if (this.binding && this.binding.wasUndefined) { this.binding.setFromNode(node); }
      // remove unused attributes
      var i = node.attributes.length;
      while (i--) {
        var name$1 = node.attributes[i].name;
        if (!(name$1 in this$1.attributeByName) && (!this$1.statics || !(name$1 in this$1.statics)))
          { node.removeAttribute(name$1); }
      }
    }

    // Is this a top-level node of a component? If so, we may need to add
    // a data-ractive-css attribute, for CSS encapsulation
    if (this.up.cssIds) {
      node.setAttribute('data-ractive-css', this.up.cssIds.map(function (x) { return ("{" + x + "}"); }).join(' '));
    }

    if (this.attributes) {
      var len = this.attributes.length;
      for (var i$1 = 0; i$1 < len; i$1++) { this$1.attributes[i$1].render(); }
    }
    if (this.binding) { this.binding.render(); }

    if (!this.up.delegate && this.listeners) {
      var ls = this.listeners;
      for (var k in ls) {
        if (ls[k] && ls[k].length) { this$1.node.addEventListener(k, handler, !!ls[k].refs); }
      }
    }

    if (!existing) {
      target.appendChild(node);
    }

    this.rendered = true;
  };

  Element__proto__.toString = function toString () {
    var this$1 = this;

    var tagName = this.template.e;

    var attrs = (this.attributes && this.attributes.map(stringifyAttribute).join('')) || '';

    if (this.statics)
      { keys(this.statics).forEach(
        function (k) { return k !== 'class' &&
          k !== 'style' &&
          (attrs = " " + k + "=\"" + (safeAttributeString(this$1.statics[k])) + "\"" + attrs); }
      ); }

    // Special case - selected options
    if (this.name === 'option' && this.isSelected()) {
      attrs += ' selected';
    }

    // Special case - two-way radio name bindings
    if (this.name === 'input' && inputIsCheckedRadio(this)) {
      attrs += ' checked';
    }

    // Special case style and class attributes and directives
    var style = this.statics ? this.statics.style : undefined;
    var cls = this.statics ? this.statics.class : undefined;
    this.attributes &&
      this.attributes.forEach(function (attr) {
        if (attr.name === 'class') {
          cls = (cls || '') + (cls ? ' ' : '') + safeAttributeString(attr.getString());
        } else if (attr.name === 'style') {
          style = (style || '') + (style ? ' ' : '') + safeAttributeString(attr.getString());
          if (style && !endsWithSemi.test(style)) { style += ';'; }
        } else if (attr.style) {
          style =
            (style || '') +
            (style ? ' ' : '') +
            (attr.style) + ": " + (safeAttributeString(attr.getString())) + ";";
        } else if (attr.inlineClass && attr.getValue()) {
          cls = (cls || '') + (cls ? ' ' : '') + attr.inlineClass;
        }
      });
    // put classes first, then inline style
    if (style !== undefined) { attrs = ' style' + (style ? ("=\"" + style + "\"") : '') + attrs; }
    if (cls !== undefined) { attrs = ' class' + (cls ? ("=\"" + cls + "\"") : '') + attrs; }

    if (this.up.cssIds) {
      attrs += " data-ractive-css=\"" + (this.up.cssIds.map(function (x) { return ("{" + x + "}"); }).join(' ')) + "\"";
    }

    var str = "<" + tagName + attrs + ">";

    if (voidElements[this.name.toLowerCase()]) { return str; }

    // Special case - textarea
    if (this.name === 'textarea' && this.getAttribute('value') !== undefined) {
      str += escapeHtml(this.getAttribute('value'));
    } else if (this.getAttribute('contenteditable') !== undefined) {
      // Special case - contenteditable
      str += this.getAttribute('value') || '';
    }

    if (this.fragment) {
      str += this.fragment.toString(!/^(?:script|style)$/i.test(this.template.e)); // escape text unless script/style
    }

    str += "</" + tagName + ">";
    return str;
  };

  Element__proto__.unbind = function unbind (view) {
    var attrs = this.attributes;
    if (attrs) {
      attrs.unbinding = true;
      var len = attrs.length;
      for (var i = 0; i < len; i++) { attrs[i].unbind(view); }
      attrs.unbinding = false;
    }

    if (this.binding) { this.binding.unbind(view); }
    if (this.fragment) { this.fragment.unbind(view); }
  };

  Element__proto__.unrender = function unrender (shouldDestroy) {
    if (!this.rendered) { return; }
    this.rendered = false;

    // unrendering before intro completed? complete it now
    // TODO should be an API for aborting transitions
    var transition = this.intro;
    if (transition && transition.complete) { transition.complete(); }

    // Detach as soon as we can
    if (this.name === 'option') {
      // <option> elements detach immediately, so that
      // their parent <select> element syncs correctly, and
      // since option elements can't have transitions anyway
      this.detach();
    } else if (shouldDestroy) {
      runloop.detachWhenReady(this);
    }

    // outro transition
    var outro = this.outro;
    if (outro && outro.shouldFire('outro')) {
      outro.isIntro = false;
      outro.isOutro = true;
      runloop.registerTransition(outro);
    }

    if (this.fragment) { this.fragment.unrender(); }

    if (this.binding) { this.binding.unrender(); }
  };

  Element__proto__.update = function update () {
    if (this.dirty) {
      this.dirty = false;

      var attrs = this.attributes;
      if (attrs) {
        var len = attrs.length;
        for (var i = 0; i < len; i++) { attrs[i].update(); }
      }

      if (this.fragment) { this.fragment.update(); }
    }
  };

  return Element;
}(ContainerItem));

function inputIsCheckedRadio(element) {
  var nameAttr = element.attributeByName.name;
  return (
    element.getAttribute('type') === 'radio' &&
    (nameAttr || {}).interpolator &&
    element.getAttribute('value') === nameAttr.interpolator.model.get()
  );
}

function stringifyAttribute(attribute) {
  var str = attribute.toString();
  return str ? ' ' + str : '';
}

function getNamespace(element) {
  // Use specified namespace...
  var xmlns$$1 = element.getAttribute('xmlns');
  if (xmlns$$1) { return xmlns$$1; }

  // ...or SVG namespace, if this is an <svg> element
  if (element.name === 'svg') { return svg$1; }

  var parent = element.parent;

  if (parent) {
    // ...or HTML, if the parent is a <foreignObject>
    if (parent.name === 'foreignobject') { return html; }

    // ...or inherit from the parent node
    return parent.node.namespaceURI;
  }

  return element.ractive.el.namespaceURI;
}

function delegateHandler(ev) {
  var name = ev.type;
  var end = ev.currentTarget;
  var endEl = end._ractive && end._ractive.proxy;
  var node = ev.target;
  var bubble = true;
  var listeners;

  // starting with the origin node, walk up the DOM looking for ractive nodes with a matching event listener
  while (bubble && node && node !== end) {
    var proxy = node._ractive && node._ractive.proxy;
    if (proxy && proxy.up.delegate === endEl && shouldFire(ev, node, end)) {
      listeners = proxy.listeners && proxy.listeners[name];

      if (listeners) {
        var len = listeners.length;
        for (var i = 0; i < len; i++) { bubble = listeners[i].call(node, ev) !== false && bubble; }
      }
    }

    node = node.parentNode || node.correspondingUseElement; // SVG with a <use> element in certain environments
  }

  return bubble;
}

var UIEvent = win !== null ? win.UIEvent : null;
function shouldFire(event, start, end) {
  if (UIEvent && event instanceof UIEvent) {
    var node = start;
    while (node && node !== end) {
      if (node.disabled) { return false; }
      node = node.parentNode || node.correspondingUseElement;
    }
  }

  return true;
}

function handler(ev) {
  var this$1 = this;

  var el = this._ractive.proxy;
  var listeners;
  if (el.listeners && (listeners = el.listeners[ev.type])) {
    var len = listeners.length;
    for (var i = 0; i < len; i++) { listeners[i].call(this$1, ev); }
  }
}

var Form = (function (Element) {
  function Form(options) {
    Element.call(this, options);
    this.formBindings = [];
  }

  if ( Element ) Form.__proto__ = Element;
  var Form__proto__ = Form.prototype = Object.create( Element && Element.prototype );
  Form__proto__.constructor = Form;

  Form__proto__.render = function render (target, occupants) {
    Element.prototype.render.call(this, target, occupants);
    this.on('reset', handleReset);
  };

  Form__proto__.unrender = function unrender (shouldDestroy) {
    this.off('reset', handleReset);
    Element.prototype.unrender.call(this, shouldDestroy);
  };

  return Form;
}(Element));

function handleReset() {
  var element = this._ractive.proxy;

  runloop.start();
  element.formBindings.forEach(updateModel);
  runloop.end();
}

function updateModel(binding) {
  binding.model.set(binding.resetValue);
}

var DOMEvent = function DOMEvent(name, owner) {
  if (name.indexOf('*') !== -1) {
    fatal(
      ("Only component proxy-events may contain \"*\" wildcards, <" + (owner.name) + " on-" + name + "=\"...\"/> is not valid")
    );
  }

  this.name = name;
  this.owner = owner;
  this.handler = null;
};
var DOMEvent__proto__ = DOMEvent.prototype;

DOMEvent__proto__.bind = function bind () {};

DOMEvent__proto__.render = function render (directive) {
    var this$1 = this;

  var name = this.name;

  var register = function () {
    var node = this$1.owner.node;

    this$1.owner.on(
      name,
      (this$1.handler = function (event) {
        return directive.fire({
          node: node,
          original: event,
          event: event,
          name: name
        });
      })
    );
  };

  if (name !== 'load') {
    // schedule events so that they take place after twoway binding
    runloop.scheduleTask(register, true);
  } else {
    // unless its a load event
    register();
  }
};

DOMEvent__proto__.unbind = function unbind () {};

DOMEvent__proto__.unrender = function unrender () {
  if (this.handler) { this.owner.off(this.name, this.handler); }
};

var CustomEvent = function CustomEvent(eventPlugin, owner, name, args) {
  this.eventPlugin = eventPlugin;
  this.owner = owner;
  this.name = name;
  this.handler = null;
  this.args = args;
};
var CustomEvent__proto__ = CustomEvent.prototype;

CustomEvent__proto__.bind = function bind () {};

CustomEvent__proto__.render = function render (directive) {
    var this$1 = this;

  runloop.scheduleTask(function () {
    var node = this$1.owner.node;

    this$1.handler = this$1.eventPlugin.apply(
      this$1.owner.ractive,
      [
        node,
        function (event) {
            if ( event === void 0 ) event = {};

          if (event.original) { event.event = event.original; }
          else { event.original = event.event; }

          event.name = this$1.name;
          event.node = event.node || node;
          return directive.fire(event);
        }
      ].concat(this$1.args || [])
    );
  });
};

CustomEvent__proto__.unbind = function unbind () {};

CustomEvent__proto__.unrender = function unrender () {
  this.handler.teardown();
};

var RactiveEvent = function RactiveEvent(component, name) {
  this.component = component;
  this.name = name;
  this.handler = null;
};
var RactiveEvent__proto__ = RactiveEvent.prototype;

RactiveEvent__proto__.bind = function bind (directive) {
  var ractive = this.component.instance;

  this.handler = ractive.on(this.name, function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

    // watch for reproxy
    if (args[0] instanceof Context) {
      var ctx = args.shift();
      ctx.component = ractive;
      directive.fire(ctx, args);
    } else {
      directive.fire({}, args);
    }

    // cancel bubbling
    return false;
  });
};

RactiveEvent__proto__.render = function render () {};

RactiveEvent__proto__.unbind = function unbind () {
  this.handler.cancel();
};

RactiveEvent__proto__.unrender = function unrender () {};

var specialPattern = /^(event|arguments|@node|@event|@context)(\..+)?$/;
var dollarArgsPattern = /^\$(\d+)(\..+)?$/;

var EventDirective = function EventDirective(options) {
  this.owner = options.owner || options.up.owner || findElement(options.up);
  this.element = this.owner.attributeByName ? this.owner : findElement(options.up, true);
  this.template = options.template;
  this.up = options.up;
  this.ractive = options.up.ractive;
  this.events = [];
};
var EventDirective__proto__ = EventDirective.prototype;

EventDirective__proto__.bind = function bind () {
    var this$1 = this;

  // sometimes anchors will cause an unbind without unrender
  if (this.events.length) {
    this.events.forEach(function (e) { return e.unrender(); });
    this.events = [];
  }

  if (this.element.type === COMPONENT || this.element.type === ANCHOR) {
    this.template.n.forEach(function (n) {
      this$1.events.push(new RactiveEvent(this$1.element, n));
    });
  } else {
    var args;
    if ((args = this.template.a)) {
      var rs = args.r.map(function (r) {
        var model = resolveReference(this$1.up, r);
        return model ? model.get() : undefined;
      });
      try {
        args = getFunction(args.s, rs.length).apply(null, rs);
      } catch (err) {
        args = null;
        warnIfDebug(
          ("Failed to compute args for event on-" + (this.template.n.join('- ')) + ": " + (err.message ||
            err))
        );
      }
    }

    this.template.n.forEach(function (n) {
      var fn = findInViewHierarchy('events', this$1.ractive, n);
      if (fn) {
        this$1.events.push(new CustomEvent(fn, this$1.element, n, args));
      } else {
        this$1.events.push(new DOMEvent(n, this$1.element));
      }
    });
  }

  // method calls
  this.models = null;

  addToArray(this.element.events || (this.element.events = []), this);

  setupArgsFn(this, this.template);
  if (!this.fn) { this.action = this.template.f; }

  this.events.forEach(function (e) { return e.bind(this$1); });
};

EventDirective__proto__.destroyed = function destroyed () {
  this.events.forEach(function (e) { return e.unrender(); });
};

EventDirective__proto__.fire = function fire (event, args) {
    var this$1 = this;
    if ( args === void 0 ) args = [];

  var context =
    event instanceof Context && event.refire ? event : this.element.getContext(event);

  if (this.fn) {
    var values = [];

    var models = resolveArgs(this, this.template, this.up, {
      specialRef: function specialRef(ref) {
        var specialMatch = specialPattern.exec(ref);
        if (specialMatch) {
          // on-click="foo(event.node)"
          return {
            special: specialMatch[1],
            keys: specialMatch[2] ? splitKeypath(specialMatch[2].substr(1)) : []
          };
        }

        var dollarMatch = dollarArgsPattern.exec(ref);
        if (dollarMatch) {
          // on-click="foo($1)"
          return {
            special: 'arguments',
            keys: [dollarMatch[1] - 1].concat(
              dollarMatch[2] ? splitKeypath(dollarMatch[2].substr(1)) : []
            )
          };
        }
      }
    });

    if (models) {
      models.forEach(function (model) {
        if (!model) { return values.push(undefined); }

        if (model.special) {
          var which = model.special;
          var obj;

          if (which === '@node') {
            obj = this$1.element.node;
          } else if (which === '@event') {
            obj = event && event.event;
          } else if (which === 'event') {
            warnOnceIfDebug(
              "The event reference available to event directives is deprecated and should be replaced with @context and @event"
            );
            obj = context;
          } else if (which === '@context') {
            obj = context;
          } else {
            obj = args;
          }

          var keys = model.keys.slice();

          while (obj && keys.length) { obj = obj[keys.shift()]; }
          return values.push(obj);
        }

        if (model.wrapper) {
          return values.push(model.wrapperValue);
        }

        values.push(model.get());
      });
    }

    // make event available as `this.event`
    var ractive = this.ractive;
    var oldEvent = ractive.event;

    ractive.event = context;
    var returned = this.fn.apply(ractive, values);
    var result = returned.pop();

    // Auto prevent and stop if return is explicitly false
    if (result === false) {
      var original = event ? event.original : undefined;
      if (original) {
        original.preventDefault && original.preventDefault();
        original.stopPropagation && original.stopPropagation();
      } else {
        warnOnceIfDebug(
          ("handler '" + (this.template.n.join(
            ' '
          )) + "' returned false, but there is no event available to cancel")
        );
      }
    } else if (!returned.length && isArray(result) && isString(result[0])) {
      // watch for proxy events
      result = fireEvent(this.ractive, result.shift(), context, result);
    }

    ractive.event = oldEvent;

    return result;
  } else {
    return fireEvent(this.ractive, this.action, context, args);
  }
};

EventDirective__proto__.handleChange = function handleChange () {};

EventDirective__proto__.render = function render () {
    var this$1 = this;

  this.events.forEach(function (e) { return e.render(this$1); });
};

EventDirective__proto__.toString = function toString () {
  return '';
};

EventDirective__proto__.unbind = function unbind (view) {
  removeFromArray(this.element.events, this);
  this.events.forEach(function (e) { return e.unbind(view); });
};

EventDirective__proto__.unrender = function unrender () {
  this.events.forEach(function (e) { return e.unrender(); });
};

var proto$3 = EventDirective.prototype;
proto$3.firstNode = proto$3.rebound = proto$3.update = noop;

function progressiveText(item, target, occupants, text) {
  if (occupants) {
    var n = occupants[0];
    if (n && n.nodeType === 3) {
      var idx = n.nodeValue.indexOf(text);
      occupants.shift();

      if (idx === 0) {
        if (n.nodeValue.length !== text.length) {
          occupants.unshift(n.splitText(text.length));
        }
      } else {
        n.nodeValue = text;
      }
    } else {
      n = item.node = doc.createTextNode(text);
      if (occupants[0]) {
        target.insertBefore(n, occupants[0]);
      } else {
        target.appendChild(n);
      }
    }

    item.node = n;
  } else {
    if (!item.node) { item.node = doc.createTextNode(text); }
    target.appendChild(item.node);
  }
}

var ComputationChild = (function (Model) {
  function ComputationChild(parent, key) {
    Model.call(this, parent, key);

    this.isReadonly = !this.root.ractive.syncComputedChildren;
    this.dirty = true;
    this.isComputed = true;
  }

  if ( Model ) ComputationChild.__proto__ = Model;
  var ComputationChild__proto__ = ComputationChild.prototype = Object.create( Model && Model.prototype );
  ComputationChild__proto__.constructor = ComputationChild;

  var prototypeAccessors$1 = { setRoot: {} };

  prototypeAccessors$1.setRoot.get = function () {
    return this.parent.setRoot;
  };

  ComputationChild__proto__.applyValue = function applyValue (value) {
    Model.prototype.applyValue.call(this, value);

    if (!this.isReadonly) {
      var source = this.parent;
      // computed models don't have a shuffle method
      while (source && source.shuffle) {
        source = source.parent;
      }

      if (source) {
        source.dependencies.forEach(mark);
      }
    }

    if (this.setRoot) {
      this.setRoot.set(this.setRoot.value);
    }
  };

  ComputationChild__proto__.get = function get (shouldCapture, opts) {
    if (shouldCapture) { capture(this); }

    if (this.dirty) {
      this.dirty = false;
      var parentValue = this.parent.get();
      this.value = parentValue ? parentValue[this.key] : undefined;
      if (this.wrapper) { this.newWrapperValue = this.value; }
      this.adapt();
    }

    return (opts && 'unwrap' in opts ? opts.unwrap !== false : shouldCapture) && this.wrapper
      ? this.wrapperValue
      : this.value;
  };

  ComputationChild__proto__.handleChange = function handleChange$2 () {
    if (this.dirty) { return; }
    this.dirty = true;

    if (this.boundValue) { this.boundValue = null; }

    this.links.forEach(marked);
    this.deps.forEach(handleChange);
    this.children.forEach(handleChange);
  };

  ComputationChild__proto__.joinKey = function joinKey (key) {
    if (isUndefined(key) || key === '') { return this; }

    if (!hasOwn(this.childByKey, key)) {
      var child = new ComputationChild(this, key);
      this.children.push(child);
      this.childByKey[key] = child;
    }

    return this.childByKey[key];
  };

  Object.defineProperties( ComputationChild__proto__, prototypeAccessors$1 );

  return ComputationChild;
}(Model));

/* global console */
/* eslint no-console:"off" */

var Computation = (function (Model) {
  function Computation(parent, signature, key) {
    Model.call(this, parent, key);

    this.signature = signature;

    this.isReadonly = !this.signature.setter;
    this.isComputed = true;

    this.dependencies = [];

    this.children = [];
    this.childByKey = {};

    this.deps = [];

    this.dirty = true;

    // TODO: is there a less hackish way to do this?
    this.shuffle = undefined;
  }

  if ( Model ) Computation.__proto__ = Model;
  var Computation__proto__ = Computation.prototype = Object.create( Model && Model.prototype );
  Computation__proto__.constructor = Computation;

  var prototypeAccessors$2 = { setRoot: {} };

  prototypeAccessors$2.setRoot.get = function () {
    if (this.signature.setter) { return this; }
  };

  Computation__proto__.get = function get (shouldCapture, opts) {
    if (shouldCapture) { capture(this); }

    if (this.dirty) {
      this.dirty = false;
      var old = this.value;
      this.value = this.getValue();
      // this may cause a view somewhere to update, so it must be in a runloop
      if (!runloop.active()) {
        runloop.start();
        if (!isEqual(old, this.value)) { this.notifyUpstream(); }
        runloop.end();
      } else {
        if (!isEqual(old, this.value)) { this.notifyUpstream(); }
      }
      if (this.wrapper) { this.newWrapperValue = this.value; }
      this.adapt();
    }

    // if capturing, this value needs to be unwrapped because it's for external use
    return maybeBind(
      this,
      // if unwrap is supplied, it overrides capture
      this.wrapper && (opts && 'unwrap' in opts ? opts.unwrap !== false : shouldCapture)
        ? this.wrapperValue
        : this.value,
      !opts || opts.shouldBind !== false
    );
  };

  Computation__proto__.getContext = function getContext () {
    return this.parent.isRoot ? this.root.ractive : this.parent.get(false, noVirtual);
  };

  Computation__proto__.getValue = function getValue () {
    startCapturing();
    var result;

    try {
      result = this.signature.getter.call(this.root.ractive, this.getContext());
    } catch (err) {
      warnIfDebug(("Failed to compute " + (this.getKeypath()) + ": " + (err.message || err)));

      // TODO this is all well and good in Chrome, but...
      // ...also, should encapsulate this stuff better, and only
      // show it if Ractive.DEBUG
      if (hasConsole) {
        if (console.groupCollapsed)
          { console.groupCollapsed(
            '%cshow details',
            'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;'
          ); }
        var sig = this.signature;
        console.error(
          ((err.name) + ": " + (err.message) + "\n\n" + (sig.getterString) + (sig.getterUseStack ? '\n\n' + err.stack : ''))
        );
        if (console.groupCollapsed) { console.groupEnd(); }
      }
    }

    var dependencies = stopCapturing();
    this.setDependencies(dependencies);

    return result;
  };

  Computation__proto__.mark = function mark () {
    this.handleChange();
  };

  Computation__proto__.rebind = function rebind (next, previous) {
    // computations will grab all of their deps again automagically
    if (next !== previous) { this.handleChange(); }
  };

  Computation__proto__.set = function set (value) {
    if (this.isReadonly) {
      throw new Error(("Cannot set read-only computed value '" + (this.key) + "'"));
    }

    this.signature.setter(value);
    this.mark();
  };

  Computation__proto__.setDependencies = function setDependencies (dependencies) {
    var this$1 = this;

    // unregister any soft dependencies we no longer have
    var i = this.dependencies.length;
    while (i--) {
      var model = this$1.dependencies[i];
      if (!~dependencies.indexOf(model)) { model.unregister(this$1); }
    }

    // and add any new ones
    i = dependencies.length;
    while (i--) {
      var model$1 = dependencies[i];
      if (!~this$1.dependencies.indexOf(model$1)) { model$1.register(this$1); }
    }

    this.dependencies = dependencies;
  };

  Computation__proto__.teardown = function teardown () {
    var this$1 = this;

    var i = this.dependencies.length;
    while (i--) {
      if (this$1.dependencies[i]) { this$1.dependencies[i].unregister(this$1); }
    }
    if (this.parent.computed[this.key] === this) { delete this.parent.computed[this.key]; }
    Model.prototype.teardown.call(this);
  };

  Object.defineProperties( Computation__proto__, prototypeAccessors$2 );

  return Computation;
}(Model));

var prototype = Computation.prototype;
var child = ComputationChild.prototype;
prototype.handleChange = child.handleChange;
prototype.joinKey = child.joinKey;

shared$1.Computation = Computation;

var ExpressionProxy = (function (Model) {
  function ExpressionProxy(fragment, template) {
    var this$1 = this;

    Model.call(this, fragment.ractive.viewmodel, null);

    this.fragment = fragment;
    this.template = template;

    this.isReadonly = true;
    this.isComputed = true;
    this.dirty = true;

    this.fn =
      fragment.ractive.allowExpressions === false
        ? noop
        : getFunction(template.s, template.r.length);

    this.models = this.template.r.map(function (ref) {
      return resolveReference(this$1.fragment, ref);
    });
    this.dependencies = [];

    this.shuffle = undefined;

    this.bubble();
  }

  if ( Model ) ExpressionProxy.__proto__ = Model;
  var ExpressionProxy__proto__ = ExpressionProxy.prototype = Object.create( Model && Model.prototype );
  ExpressionProxy__proto__.constructor = ExpressionProxy;

  ExpressionProxy__proto__.bubble = function bubble (actuallyChanged) {
    if ( actuallyChanged === void 0 ) actuallyChanged = true;

    // refresh the keypath
    this.keypath = undefined;

    if (actuallyChanged) {
      this.handleChange();
    }
  };

  ExpressionProxy__proto__.getKeypath = function getKeypath () {
    var this$1 = this;

    if (!this.template) { return '@undefined'; }
    if (!this.keypath) {
      this.keypath =
        '@' +
        this.template.s.replace(/_(\d+)/g, function (match, i) {
          if (i >= this$1.models.length) { return match; }

          var model = this$1.models[i];
          return model ? model.getKeypath() : '@undefined';
        });
    }

    return this.keypath;
  };

  ExpressionProxy__proto__.getValue = function getValue () {
    var this$1 = this;

    startCapturing();
    var result;

    try {
      var params = this.models.map(function (m) { return (m ? m.get(true) : undefined); });
      result = this.fn.apply(this.fragment.ractive, params);
    } catch (err) {
      warnIfDebug(("Failed to compute " + (this.getKeypath()) + ": " + (err.message || err)));
    }

    var dependencies = stopCapturing();
    // remove missing deps
    this.dependencies
      .filter(function (d) { return !~dependencies.indexOf(d); })
      .forEach(function (d) {
        d.unregister(this$1);
        removeFromArray(this$1.dependencies, d);
      });
    // register new deps
    dependencies
      .filter(function (d) { return !~this$1.dependencies.indexOf(d); })
      .forEach(function (d) {
        d.register(this$1);
        this$1.dependencies.push(d);
      });

    return result;
  };

  ExpressionProxy__proto__.notifyUpstream = function notifyUpstream () {};

  ExpressionProxy__proto__.rebind = function rebind (next, previous, safe) {
    var idx = this.models.indexOf(previous);

    if (~idx) {
      next = rebindMatch(this.template.r[idx], next, previous);
      if (next !== previous) {
        previous.unregister(this);
        this.models.splice(idx, 1, next);
        if (next) { next.addShuffleRegister(this, 'mark'); }
      }
    }
    this.bubble(!safe);
  };

  ExpressionProxy__proto__.rebound = function rebound (update) {
    var this$1 = this;

    this.models = this.template.r.map(function (ref) { return resolveReference(this$1.fragment, ref); });
    if (update) { this.bubble(true); }
  };

  ExpressionProxy__proto__.retrieve = function retrieve () {
    return this.get();
  };

  ExpressionProxy__proto__.teardown = function teardown () {
    var this$1 = this;

    this.fragment = undefined;
    if (this.dependencies) { this.dependencies.forEach(function (d) { return d.unregister(this$1); }); }
    Model.prototype.teardown.call(this);
  };

  ExpressionProxy__proto__.unreference = function unreference () {
    Model.prototype.unreference.call(this);
    collect(this);
  };

  ExpressionProxy__proto__.unregister = function unregister (dep) {
    Model.prototype.unregister.call(this, dep);
    collect(this);
  };

  ExpressionProxy__proto__.unregisterLink = function unregisterLink (link) {
    Model.prototype.unregisterLink.call(this, link);
    collect(this);
  };

  return ExpressionProxy;
}(Model));

var prototype$1 = ExpressionProxy.prototype;
var computation = Computation.prototype;
prototype$1.get = computation.get;
prototype$1.handleChange = computation.handleChange;
prototype$1.joinKey = computation.joinKey;
prototype$1.mark = computation.mark;
prototype$1.unbind = noop;

function collect(model) {
  if (!model.deps.length && !model.refs && !model.links.length) { model.teardown(); }
}

var ReferenceExpressionProxy = (function (LinkModel) {
  function ReferenceExpressionProxy(fragment, template) {
    LinkModel.call(this, null, null, null, '@undefined');
    this.root = fragment.ractive.viewmodel;
    this.template = template;
    this.rootLink = true;
    this.template = template;
    this.fragment = fragment;

    this.rebound();
  }

  if ( LinkModel ) ReferenceExpressionProxy.__proto__ = LinkModel;
  var ReferenceExpressionProxy__proto__ = ReferenceExpressionProxy.prototype = Object.create( LinkModel && LinkModel.prototype );
  ReferenceExpressionProxy__proto__.constructor = ReferenceExpressionProxy;

  ReferenceExpressionProxy__proto__.getKeypath = function getKeypath () {
    return this.model ? this.model.getKeypath() : '@undefined';
  };

  ReferenceExpressionProxy__proto__.rebound = function rebound () {
    var this$1 = this;

    var fragment = this.fragment;
    var template = this.template;

    var base = (this.base = resolve(fragment, template));
    var idx;

    if (this.proxy) {
      teardown$2(this);
    }

    var proxy = (this.proxy = {
      rebind: function (next, previous) {
        if (previous === base) {
          next = rebindMatch(template, next, previous);
          if (next !== base) {
            this$1.base = base = next;
          }
        } else if (~(idx = members.indexOf(previous))) {
          next = rebindMatch(template.m[idx].n, next, previous);
          if (next !== members[idx]) {
            members.splice(idx, 1, next || Missing);
          }
        }

        if (next !== previous) {
          previous.unregister(proxy);
          if (next) { next.addShuffleTask(function () { return next.register(proxy); }); }
        }
      },
      handleChange: function () {
        pathChanged();
      }
    });

    base.register(proxy);

    var members = (this.members = template.m.map(function (tpl) {
      if (isString(tpl)) {
        return { get: function () { return tpl; } };
      }

      var model;

      if (tpl.t === REFERENCE) {
        model = resolveReference(fragment, tpl.n);
        model.register(proxy);

        return model;
      }

      model = new ExpressionProxy(fragment, tpl);
      model.register(proxy);
      return model;
    }));

    var pathChanged = function () {
      var model =
        base &&
        base.joinAll(
          members.reduce(function (list, m) {
            var k = m.get();
            if (isArray(k)) { return list.concat(k); }
            else { list.push(escapeKey(String(k))); }
            return list;
          }, [])
        );

      if (model !== this$1.model) {
        this$1.model = model;
        this$1.relinking(model);
        fireShuffleTasks();
        refreshPathDeps(this$1);
      }
    };

    pathChanged();
  };

  ReferenceExpressionProxy__proto__.teardown = function teardown () {
    teardown$2(this);
    LinkModel.prototype.teardown.call(this);
  };

  ReferenceExpressionProxy__proto__.unreference = function unreference () {
    LinkModel.prototype.unreference.call(this);
    if (!this.deps.length && !this.refs) { this.teardown(); }
  };

  ReferenceExpressionProxy__proto__.unregister = function unregister (dep) {
    LinkModel.prototype.unregister.call(this, dep);
    if (!this.deps.length && !this.refs) { this.teardown(); }
  };

  return ReferenceExpressionProxy;
}(LinkModel));

function teardown$2(proxy) {
  if (proxy.base) { proxy.base.unregister(proxy.proxy); }
  if (proxy.models) {
    proxy.models.forEach(function (m) {
      if (m.unregister) { m.unregister(proxy); }
    });
  }
}

function refreshPathDeps(proxy) {
  var len = proxy.deps.length;
  var i, v;

  for (i = 0; i < len; i++) {
    v = proxy.deps[i];
    if (v.pathChanged) { v.pathChanged(); }
    if (v.fragment && v.fragment.pathModel) { v.fragment.pathModel.applyValue(proxy.getKeypath()); }
  }

  len = proxy.children.length;
  for (i = 0; i < len; i++) {
    refreshPathDeps(proxy.children[i]);
  }
}

var eproto = ExpressionProxy.prototype;
var proto$4 = ReferenceExpressionProxy.prototype;

proto$4.unreference = eproto.unreference;
proto$4.unregister = eproto.unregister;
proto$4.unregisterLink = eproto.unregisterLink;

function resolve(fragment, template) {
  if (template.r) {
    return resolveReference(fragment, template.r);
  } else if (template.x) {
    return new ExpressionProxy(fragment, template.x);
  } else if (template.rx) {
    return new ReferenceExpressionProxy(fragment, template.rx);
  }
}

var Mustache = (function (Item) {
  function Mustache(options) {
    Item.call(this, options);

    if (options.owner) { this.parent = options.owner; }

    this.isStatic = !!options.template.s;

    this.model = null;
    this.dirty = false;
  }

  if ( Item ) Mustache.__proto__ = Item;
  var Mustache__proto__ = Mustache.prototype = Object.create( Item && Item.prototype );
  Mustache__proto__.constructor = Mustache;

  Mustache__proto__.bind = function bind (pre) {
    // yield mustaches and inner contexts should resolve in container context
    var start = this.template.y
      ? this.template.y.containerFragment
      : this.containerFragment || this.up;
    // try to find a model for this view
    var model = pre || resolve(start, this.template);

    if (model) {
      var value = model.get();

      if (this.isStatic) {
        this.model = { get: function () { return value; } };
        model.unreference();
        return;
      }

      model.register(this);
      this.model = model;
    }
  };

  Mustache__proto__.handleChange = function handleChange () {
    this.bubble();
  };

  Mustache__proto__.rebind = function rebind (next, previous, safe) {
    if (this.isStatic) { return; }

    next = rebindMatch(this.template, next, previous, this.up);
    if (next === this.model) { return false; }

    if (this.model) {
      this.model.unregister(this);
    }
    if (next) { next.addShuffleRegister(this, 'mark'); }
    this.model = next;
    if (!safe) { this.handleChange(); }
    return true;
  };

  Mustache__proto__.rebound = function rebound (update) {
    if (this.model) {
      if (this.model.rebound) { this.model.rebound(update); }
      else {
        // check to see if the model actually changed...
        // yield mustaches and inner contexts should resolve in container context
        var start = this.template.y
          ? this.template.y.containerFragment
          : this.containerFragment || this.up;
        // try to find a model for this view
        var model = resolve(start, this.template);
        if (model !== this.model) {
          this.model.unregister(this);
          this.bind(model);
        }
      }

      if (update) { this.bubble(); }
    }
    if (this.fragment) { this.fragment.rebound(update); }
  };

  Mustache__proto__.unbind = function unbind () {
    if (!this.isStatic) {
      this.model && this.model.unregister(this);
      this.model = undefined;
    }
  };

  return Mustache;
}(Item));

function MustacheContainer(options) {
  Mustache.call(this, options);
}

var proto$5 = (MustacheContainer.prototype = Object.create(ContainerItem.prototype));

assign(proto$5, Mustache.prototype, { constructor: MustacheContainer });

var Interpolator = (function (Mustache) {
  function Interpolator () {
    Mustache.apply(this, arguments);
  }

  if ( Mustache ) Interpolator.__proto__ = Mustache;
  var Interpolator__proto__ = Interpolator.prototype = Object.create( Mustache && Mustache.prototype );
  Interpolator__proto__.constructor = Interpolator;

  Interpolator__proto__.bubble = function bubble () {
    if (this.owner) { this.owner.bubble(); }
    Mustache.prototype.bubble.call(this);
  };

  Interpolator__proto__.detach = function detach () {
    return detachNode(this.node);
  };

  Interpolator__proto__.firstNode = function firstNode () {
    return this.node;
  };

  Interpolator__proto__.getString = function getString () {
    return this.model ? safeToStringValue(this.model.get()) : '';
  };

  Interpolator__proto__.render = function render (target, occupants) {
    if (inAttributes()) { return; }
    var value = (this.value = this.getString());

    this.rendered = true;

    progressiveText(this, target, occupants, value);
  };

  Interpolator__proto__.toString = function toString (escape) {
    var string = this.getString();
    return escape ? escapeHtml(string) : string;
  };

  Interpolator__proto__.unrender = function unrender (shouldDestroy) {
    if (shouldDestroy) { this.detach(); }
    this.rendered = false;
  };

  Interpolator__proto__.update = function update () {
    if (this.dirty) {
      this.dirty = false;
      if (this.rendered) {
        var value = this.getString();
        if (value !== this.value) { this.node.data = this.value = value; }
      }
    }
  };

  Interpolator__proto__.valueOf = function valueOf () {
    return this.model ? this.model.get() : undefined;
  };

  return Interpolator;
}(Mustache));

var Input = (function (Element) {
  function Input () {
    Element.apply(this, arguments);
  }

  if ( Element ) Input.__proto__ = Element;
  var Input__proto__ = Input.prototype = Object.create( Element && Element.prototype );
  Input__proto__.constructor = Input;

  Input__proto__.render = function render (target, occupants) {
    Element.prototype.render.call(this, target, occupants);
    this.node.defaultValue = this.node.value;
  };
  Input__proto__.compare = function compare (value, attrValue) {
    var comparator = this.getAttribute('value-comparator');
    if (comparator) {
      if (isFunction(comparator)) {
        return comparator(value, attrValue);
      }
      if (value && attrValue) {
        return value[comparator] == attrValue[comparator];
      }
    }
    return value == attrValue;
  };

  return Input;
}(Element));

// simple JSON parser, without the restrictions of JSON parse
// (i.e. having to double-quote keys).
//
// If passed a hash of values as the second argument, ${placeholders}
// will be replaced with those values

var specials$1 = {
  true: true,
  false: false,
  null: null,
  undefined: undefined
};

var specialsPattern = new RegExp('^(?:' + keys(specials$1).join('|') + ')');
var numberPattern$1 = /^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
var placeholderPattern = /\$\{([^\}]+)\}/g;
var placeholderAtStartPattern = /^\$\{([^\}]+)\}/;
var onlyWhitespace$1 = /^\s*$/;

var JsonParser = Parser.extend({
  init: function init(str, options) {
    this.values = options.values;
    this.sp();
  },

  postProcess: function postProcess(result) {
    if (result.length !== 1 || !onlyWhitespace$1.test(this.leftover)) {
      return null;
    }

    return { value: result[0].v };
  },

  converters: [
    function getPlaceholder(parser) {
      if (!parser.values) { return null; }

      var placeholder = parser.matchPattern(placeholderAtStartPattern);

      if (placeholder && hasOwn(parser.values, placeholder)) {
        return { v: parser.values[placeholder] };
      }
    },

    function getSpecial(parser) {
      var special = parser.matchPattern(specialsPattern);
      if (special) { return { v: specials$1[special] }; }
    },

    function getNumber(parser) {
      var number = parser.matchPattern(numberPattern$1);
      if (number) { return { v: +number }; }
    },

    function getString(parser) {
      var stringLiteral = readStringLiteral(parser);
      var values = parser.values;

      if (stringLiteral && values) {
        return {
          v: stringLiteral.v.replace(placeholderPattern, function (match, $1) { return $1 in values ? values[$1] : $1; }
          )
        };
      }

      return stringLiteral;
    },

    function getObject(parser) {
      if (!parser.matchString('{')) { return null; }

      var result = {};

      parser.sp();

      if (parser.matchString('}')) {
        return { v: result };
      }

      var pair;
      while ((pair = getKeyValuePair(parser))) {
        result[pair.key] = pair.value;

        parser.sp();

        if (parser.matchString('}')) {
          return { v: result };
        }

        if (!parser.matchString(',')) {
          return null;
        }
      }

      return null;
    },

    function getArray(parser) {
      if (!parser.matchString('[')) { return null; }

      var result = [];

      parser.sp();

      if (parser.matchString(']')) {
        return { v: result };
      }

      var valueToken;
      while ((valueToken = parser.read())) {
        result.push(valueToken.v);

        parser.sp();

        if (parser.matchString(']')) {
          return { v: result };
        }

        if (!parser.matchString(',')) {
          return null;
        }

        parser.sp();
      }

      return null;
    }
  ]
});

function getKeyValuePair(parser) {
  parser.sp();

  var key = readKey(parser);

  if (!key) { return null; }

  var pair = { key: key };

  parser.sp();
  if (!parser.matchString(':')) {
    return null;
  }
  parser.sp();

  var valueToken = parser.read();

  if (!valueToken) { return null; }

  pair.value = valueToken.v;
  return pair;
}

function parseJSON(str, values) {
  var parser = new JsonParser(str, { values: values });
  return parser.result;
}

var Mapping = (function (Item) {
  function Mapping(options) {
    Item.call(this, options);

    this.name = options.template.n;

    this.owner = options.owner || options.up.owner || options.element || findElement(options.up);
    this.element =
      options.element || (this.owner.attributeByName ? this.owner : findElement(options.up));
    this.up = this.element.up; // shared
    this.ractive = this.up.ractive;

    this.element.attributeByName[this.name] = this;

    this.value = options.template.f;
  }

  if ( Item ) Mapping.__proto__ = Item;
  var Mapping__proto__ = Mapping.prototype = Object.create( Item && Item.prototype );
  Mapping__proto__.constructor = Mapping;

  Mapping__proto__.bind = function bind () {
    var template = this.template.f;
    var viewmodel = this.element.instance.viewmodel;

    if (template === 0) {
      // empty attributes are `true`
      viewmodel.joinKey(this.name).set(true);
    } else if (isString(template)) {
      var parsed = parseJSON(template);
      viewmodel.joinKey(this.name).set(parsed ? parsed.value : template);
    } else if (isArray(template)) {
      createMapping(this, true);
    }
  };

  Mapping__proto__.rebound = function rebound (update) {
    if (this.boundFragment) { this.boundFragment.rebound(update); }
    if (this.link) {
      this.model = resolve(this.up, this.template.f[0]);
      var model = this.element.instance.viewmodel.joinAll(splitKeypath(this.name));
      model.link(this.model, this.name, { mapping: true });
    }
  };

  Mapping__proto__.render = function render () {};

  Mapping__proto__.unbind = function unbind (view) {
    if (this.model) { this.model.unregister(this); }
    if (this.boundFragment) { this.boundFragment.unbind(view); }

    if (this.element.bound) {
      if (this.link.target === this.model) { this.link.owner.unlink(); }
    }
  };

  Mapping__proto__.unrender = function unrender () {};

  Mapping__proto__.update = function update () {
    if (this.dirty) {
      this.dirty = false;
      if (this.boundFragment) { this.boundFragment.update(); }
    }
  };

  return Mapping;
}(Item));

function createMapping(item) {
  var template = item.template.f;
  var viewmodel = item.element.instance.viewmodel;
  var childData = viewmodel.value;

  if (template.length === 1 && template[0].t === INTERPOLATOR) {
    var model = resolve(item.up, template[0]);
    var val = model.get(false);

    // if the interpolator is not static
    if (!template[0].s) {
      item.model = model;
      item.link = viewmodel.createLink(item.name, model, template[0].r, {
        mapping: true
      });

      // initialize parent side of the mapping from child data
      if (isUndefined(val) && !model.isReadonly && item.name in childData) {
        model.set(childData[item.name]);
      }
    } else if (!isObjectType(val) || template[0].x) {
      // copy non-object, non-computed vals through
      viewmodel.joinKey(splitKeypath(item.name)).set(val);
    } else {
      // warn about trying to copy an object
      warnIfDebug(("Cannot copy non-computed object value from static mapping '" + (item.name) + "'"));
    }

    // if the item isn't going to manage the model, give it a change to tear down if it's computed
    if (model !== item.model) { model.unregister(); }
  } else {
    item.boundFragment = new Fragment({
      owner: item,
      template: template
    }).bind();

    item.model = viewmodel.joinKey(splitKeypath(item.name));
    item.model.set(item.boundFragment.valueOf());

    // item is a *bit* of a hack
    item.boundFragment.bubble = function () {
      Fragment.prototype.bubble.call(item.boundFragment);
      // defer this to avoid mucking around model deps if there happens to be an expression involved
      runloop.scheduleTask(function () {
        item.boundFragment.update();
        item.model.set(item.boundFragment.valueOf());
      });
    };
  }
}

var Option = (function (Element) {
  function Option(options) {
    var template = options.template;
    if (!template.a) { template.a = {}; }

    // If the value attribute is missing, use the element's content,
    // as long as it isn't disabled
    if (isUndefined(template.a.value) && !('disabled' in template.a)) {
      template.a.value = template.f || '';
    }

    Element.call(this, options);

    this.select = findElement(this.parent || this.up, false, 'select');
  }

  if ( Element ) Option.__proto__ = Element;
  var Option__proto__ = Option.prototype = Object.create( Element && Element.prototype );
  Option__proto__.constructor = Option;

  Option__proto__.bind = function bind () {
    if (!this.select) {
      Element.prototype.bind.call(this);
      return;
    }

    // If the select has a value, it overrides the `selected` attribute on
    // this option - so we delete the attribute
    var selectedAttribute = this.attributeByName.selected;
    if (selectedAttribute && this.select.getAttribute('value') !== undefined) {
      var index = this.attributes.indexOf(selectedAttribute);
      this.attributes.splice(index, 1);
      delete this.attributeByName.selected;
    }

    Element.prototype.bind.call(this);
    this.select.options.push(this);
  };

  Option__proto__.bubble = function bubble () {
    // if we're using content as value, may need to update here
    var value = this.getAttribute('value');
    if (this.node && this.node.value !== value) {
      this.node._ractive.value = value;
    }
    Element.prototype.bubble.call(this);
  };

  Option__proto__.getAttribute = function getAttribute (name) {
    var attribute = this.attributeByName[name];
    return attribute
      ? attribute.getValue()
      : name === 'value' && this.fragment
      ? this.fragment.valueOf()
      : undefined;
  };

  Option__proto__.isSelected = function isSelected () {
    var this$1 = this;

    var optionValue = this.getAttribute('value');

    if (isUndefined(optionValue) || !this.select) {
      return false;
    }

    var selectValue = this.select.getAttribute('value');

    if (this.select.compare(selectValue, optionValue)) {
      return true;
    }

    if (this.select.getAttribute('multiple') && isArray(selectValue)) {
      var i = selectValue.length;
      while (i--) {
        if (this$1.select.compare(selectValue[i], optionValue)) {
          return true;
        }
      }
    }
  };

  Option__proto__.render = function render (target, occupants) {
    Element.prototype.render.call(this, target, occupants);

    if (!this.attributeByName.value) {
      this.node._ractive.value = this.getAttribute('value');
    }
  };

  Option__proto__.unbind = function unbind (view) {
    Element.prototype.unbind.call(this, view);

    if (this.select) {
      removeFromArray(this.select.options, this);
    }
  };

  return Option;
}(Element));

function getPartialTemplate(ractive, name, up) {
  // If the partial in instance or view heirarchy instances, great
  var partial = getPartialFromRegistry(ractive, name, up || {});
  if (partial) { return partial; }

  // Does it exist on the page as a script tag?
  partial = parser.fromId(name, { noThrow: true });
  if (partial) {
    // parse and register to this ractive instance
    var parsed = parser.parseFor(partial, ractive);

    // register extra partials on the ractive instance if they don't already exist
    if (parsed.p) { fillGaps(ractive.partials, parsed.p); }

    // register (and return main partial if there are others in the template)
    return (ractive.partials[name] = parsed.t);
  }
}

function getPartialFromRegistry(ractive, name, up) {
  // if there was an instance up-hierarchy, cool
  var partial = findParentPartial(name, up.owner);
  if (partial) { return partial; }

  // find first instance in the ractive or view hierarchy that has this partial
  var instance = findInstance('partials', ractive, name);

  if (!instance) {
    return;
  }

  partial = instance.partials[name];

  // partial is a function?
  var fn;
  if (isFunction(partial)) {
    fn = partial;
    // super partial
    if (fn.styleSet) { return fn; }

    fn = partial.bind(instance);
    fn.isOwner = hasOwn(instance.partials, name);
    partial = fn.call(ractive, parser);
  }

  if (!partial && partial !== '') {
    warnIfDebug(noRegistryFunctionReturn, name, 'partial', 'partial', {
      ractive: ractive
    });
    return;
  }

  // If this was added manually to the registry,
  // but hasn't been parsed, parse it now
  if (!parser.isParsed(partial)) {
    // use the parseOptions of the ractive instance on which it was found
    var parsed = parser.parseFor(partial, instance);

    // Partials cannot contain nested partials!
    // TODO add a test for this
    if (parsed.p) {
      warnIfDebug('Partials ({{>%s}}) cannot contain nested inline partials', name, { ractive: ractive });
    }

    // if fn, use instance to store result, otherwise needs to go
    // in the correct point in prototype chain on instance or constructor
    var target = fn ? instance : findOwner(instance, name);

    // may be a template with partials, which need to be registered and main template extracted
    target.partials[name] = partial = parsed.t;
  }

  // store for reset
  if (fn) { partial._fn = fn; }

  // if the partial is a pre-parsed template object, import any expressions and update the registry
  if (partial.v) {
    addFunctions(partial);
    return (instance.partials[name] = partial.t);
  } else {
    return partial;
  }
}

function findOwner(ractive, key) {
  return hasOwn(ractive.partials, key) ? ractive : findConstructor(ractive.constructor, key);
}

function findConstructor(constructor, key) {
  if (!constructor) {
    return;
  }
  return hasOwn(constructor.partials, key) ? constructor : findConstructor(constructor.Parent, key);
}

function findParentPartial(name, parent) {
  if (parent) {
    if (
      parent.template &&
      parent.template.p &&
      !isArray(parent.template.p) &&
      hasOwn(parent.template.p, name)
    ) {
      return parent.template.p[name];
    } else if (parent.up && parent.up.owner) {
      return findParentPartial(name, parent.up.owner);
    }
  }
}

function Partial(options) {
  MustacheContainer.call(this, options);

  var tpl = options.template;

  // yielder is a special form of partial that will later require special handling
  if (tpl.t === YIELDER) {
    this.yielder = 1;
  } else if (tpl.t === ELEMENT) {
    // this is a macro partial, complete with macro constructor
    // leaving this as an element will confuse up-template searches
    this.type = PARTIAL;
    this.macro = options.macro;
  }
}

var proto$6 = (Partial.prototype = create(MustacheContainer.prototype));

assign(proto$6, {
  constructor: Partial,

  bind: function bind() {
    var template = this.template;

    if (this.yielder) {
      // the container is the instance that owns this node
      this.container = this.up.ractive;
      this.component = this.container.component;
      this.containerFragment = this.up;

      // normal component
      if (this.component) {
        // yields skip the owning instance and go straight to the surrounding context
        this.up = this.component.up;

        // {{yield}} is equivalent to {{yield content}}
        if (!template.r && !template.x && !template.rx) { this.refName = 'content'; }
      } else {
        // plain-ish instance that may be attached to a parent later
        this.fragment = new Fragment({
          owner: this,
          template: []
        });
        this.fragment.bind();
        return;
      }
    }

    // this is a macro/super partial
    if (this.macro) {
      this.fn = this.macro;
    } else {
      // this is a plain partial or yielder
      if (!this.refName) { this.refName = template.r; }

      // if the refName exists as a partial, this is a plain old partial reference where no model binding will happen
      if (this.refName) {
        partialFromValue(this, this.refName);
      }

      // this is a dynamic/inline partial
      if (!this.partial && !this.fn) {
        MustacheContainer.prototype.bind.call(this);
        if (this.model) { partialFromValue(this, this.model.get()); }
      }
    }

    if (!this.partial && !this.fn) {
      warnOnceIfDebug(("Could not find template for partial '" + (this.name) + "'"));
    }

    createFragment(this, this.partial || []);

    // macro/super partial
    if (this.fn) { initMacro(this); }

    this.fragment.bind();
  },

  bubble: function bubble() {
    if (!this.dirty) {
      this.dirty = true;

      if (this.yielder) {
        this.containerFragment.bubble();
      } else {
        this.up.bubble();
      }
    }
  },

  findNextNode: function findNextNode() {
    return (this.containerFragment || this.up).findNextNode(this);
  },

  handleChange: function handleChange() {
    this.dirtyTemplate = true;
    this.externalChange = true;
    this.bubble();
  },

  rebound: function rebound(update) {
    var this$1 = this;

    if (this._attrs) {
      keys(this._attrs).forEach(function (k) { return this$1._attrs[k].rebound(update); });
    }
    MustacheContainer.prototype.rebound.call(this, update);
  },

  refreshAttrs: function refreshAttrs() {
    var this$1 = this;

    keys(this._attrs).forEach(function (k) {
      this$1.handle.attributes[k] = !this$1._attrs[k].items.length || this$1._attrs[k].valueOf();
    });
  },

  resetTemplate: function resetTemplate() {
    var this$1 = this;

    if (this.fn && this.proxy) {
      this.last = 0;
      if (this.externalChange) {
        if (isFunction(this.proxy.teardown)) { this.proxy.teardown(); }
        this.fn = this.proxy = null;
      } else {
        this.partial = this.fnTemplate;
        return true;
      }
    }

    this.partial = null;

    if (this.refName) {
      this.partial = getPartialTemplate(this.ractive, this.refName, this.up);
    }

    if (!this.partial && this.model) {
      partialFromValue(this, this.model.get());
    }

    if (!this.fn) {
      if (this.last && this.partial === this.last) { return false; }
      else if (this.partial) {
        this.last = this.partial;
        contextifyTemplate(this);
      }
    }

    this.unbindAttrs();

    if (this.fn) {
      initMacro(this);
      if (isFunction(this.proxy.render)) { runloop.scheduleTask(function () { return this$1.proxy.render(); }); }
    } else if (!this.partial) {
      warnOnceIfDebug(("Could not find template for partial '" + (this.name) + "'"));
    }

    return true;
  },

  render: function render(target, occupants) {
    if (this.fn && this.fn._cssDef && !this.fn._cssDef.applied) { applyCSS(); }

    this.fragment.render(target, occupants);

    if (this.proxy && isFunction(this.proxy.render)) { this.proxy.render(); }
  },

  unbind: function unbind(view) {
    this.fragment.unbind(view);

    this.unbindAttrs(view);

    MustacheContainer.prototype.unbind.call(this, view);
  },

  unbindAttrs: function unbindAttrs(view) {
    var this$1 = this;

    if (this._attrs) {
      keys(this._attrs).forEach(function (k) {
        this$1._attrs[k].unbind(view);
      });
    }
  },

  unrender: function unrender(shouldDestroy) {
    if (this.proxy && isFunction(this.proxy.teardown)) { this.proxy.teardown(); }

    this.fragment.unrender(shouldDestroy);
  },

  update: function update() {
    var this$1 = this;

    var proxy = this.proxy;
    this.updating = 1;

    if (this.dirtyAttrs) {
      this.dirtyAttrs = false;
      keys(this._attrs).forEach(function (k) { return this$1._attrs[k].update(); });
      this.refreshAttrs();
      if (isFunction(proxy.update)) { proxy.update(this.handle.attributes); }
    }

    if (this.dirtyTemplate) {
      this.dirtyTemplate = false;
      this.resetTemplate() && this.fragment.resetTemplate(this.partial || []);
    }

    if (this.dirty) {
      this.dirty = false;
      if (proxy && isFunction(proxy.invalidate)) { proxy.invalidate(); }
      this.fragment.update();
    }

    this.externalChange = false;
    this.updating = 0;
  }
});

function createFragment(self, partial) {
  self.partial = self.last = partial;
  contextifyTemplate(self);

  var options = {
    owner: self,
    template: self.partial
  };

  if (self.yielder) { options.ractive = self.container.parent; }

  if (self.fn) { options.cssIds = self.fn._cssIds; }

  self.fragment = new Fragment(options);
}

function contextifyTemplate(self) {
  if (self.template.c) {
    self.partial = [{ t: SECTION, n: SECTION_WITH, f: self.partial }];
    assign(self.partial[0], self.template.c);
    if (self.yielder) { self.partial[0].y = self; }
    else { self.partial[0].z = self.template.z; }
  }
}

function partialFromValue(self, value, okToParse) {
  var tpl = value;

  if (isArray(tpl)) {
    self.partial = tpl;
  } else if (tpl && isObjectType(tpl)) {
    if (isArray(tpl.t)) { self.partial = tpl.t; }
    else if (isString(tpl.template))
      { self.partial = parsePartial(tpl.template, tpl.template, self.ractive).t; }
  } else if (isFunction(tpl) && tpl.styleSet) {
    self.fn = tpl;
    if (self.fragment) { self.fragment.cssIds = tpl._cssIds; }
  } else if (tpl != null) {
    tpl = getPartialTemplate(self.ractive, '' + tpl, self.containerFragment || self.up);
    if (tpl) {
      self.name = value;
      if (tpl.styleSet) {
        self.fn = tpl;
        if (self.fragment) { self.fragment.cssIds = tpl._cssIds; }
      } else { self.partial = tpl; }
    } else if (okToParse) {
      self.partial = parsePartial('' + value, '' + value, self.ractive).t;
    } else {
      self.name = value;
    }
  }

  return self.partial;
}

function setTemplate(template) {
  partialFromValue(this, template, true);

  if (!this.initing) {
    this.dirtyTemplate = true;
    this.fnTemplate = this.partial;

    if (this.updating) {
      this.bubble();
      runloop.promise();
    } else {
      var promise = runloop.start();

      this.bubble();
      runloop.end();

      return promise;
    }
  }
}

function aliasLocal(ref, name) {
  var aliases = this.fragment.aliases || (this.fragment.aliases = {});
  if (!name) {
    aliases[ref] = this._data;
  } else {
    aliases[name] = this._data.joinAll(splitKeypath(ref));
  }
}

var extras = 'extra-attributes';

function initMacro(self) {
  var fn = self.fn;
  var fragment = self.fragment;

  // defensively copy the template in case it changes
  var template = (self.template = assign({}, self.template));
  var handle = (self.handle = fragment.getContext({
    proxy: self,
    aliasLocal: aliasLocal,
    name: self.template.e || self.name,
    attributes: {},
    setTemplate: setTemplate.bind(self),
    template: template,
    macro: fn
  }));

  if (!template.p) { template.p = {}; }
  template.p = handle.partials = assign({}, template.p);
  if (!hasOwn(template.p, 'content')) { template.p.content = template.f || []; }

  if (isArray(fn.attributes)) {
    self._attrs = {};

    var invalidate = function() {
      this.dirty = true;
      self.dirtyAttrs = true;
      self.bubble();
    };

    if (isArray(template.m)) {
      var attrs = template.m;
      template.p[extras] = template.m = attrs.filter(function (a) { return !~fn.attributes.indexOf(a.n); });
      attrs
        .filter(function (a) { return ~fn.attributes.indexOf(a.n); })
        .forEach(function (a) {
          var fragment = new Fragment({
            template: a.f,
            owner: self
          });
          fragment.bubble = invalidate;
          fragment.findFirstNode = noop;
          self._attrs[a.n] = fragment;
        });
    } else {
      template.p[extras] = [];
    }
  } else {
    template.p[extras] = template.m;
  }

  if (self._attrs) {
    keys(self._attrs).forEach(function (k) {
      self._attrs[k].bind();
    });
    self.refreshAttrs();
  }

  self.initing = 1;
  self.proxy = fn.call(self.ractive, handle, handle.attributes) || {};
  if (!self.partial) { self.partial = []; }
  self.fnTemplate = self.partial;
  self.initing = 0;

  contextifyTemplate(self);
  fragment.resetTemplate(self.partial);
}

function parsePartial(name, partial, ractive) {
  var parsed;

  try {
    parsed = parser.parse(partial, parser.getParseOptions(ractive));
  } catch (e) {
    warnIfDebug(("Could not parse partial from expression '" + name + "'\n" + (e.message)));
  }

  return parsed || { t: [] };
}

var KeyModel = function KeyModel(value, context, instance) {
  this.value = this.key = value;
  this.context = context;
  this.isReadonly = this.isKey = true;
  this.deps = [];
  this.links = [];
  this.children = [];
  this.instance = instance;
};
var KeyModel__proto__ = KeyModel.prototype;

KeyModel__proto__.applyValue = function applyValue (value) {
  if (value !== this.value) {
    this.value = this.key = value;
    this.deps.forEach(handleChange);
    this.links.forEach(handleChange);
    this.children.forEach(function (c) {
      c.applyValue(c.context.getKeypath(c.instance));
    });
  }
};

KeyModel__proto__.destroyed = function destroyed () {
  if (this.upstream) { this.upstream.unregisterChild(this); }
};

KeyModel__proto__.get = function get (shouldCapture) {
  if (shouldCapture) { capture(this); }
  return unescapeKey(this.value);
};

KeyModel__proto__.getKeypath = function getKeypath () {
  return unescapeKey(this.value);
};

KeyModel__proto__.has = function has () {
  return false;
};

KeyModel__proto__.rebind = function rebind (next, previous) {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) { this$1.deps[i].rebind(next, previous, false); }

  i = this.links.length;
  while (i--) { this$1.links[i].relinking(next, false); }
};

KeyModel__proto__.register = function register (dependant) {
  this.deps.push(dependant);
};

KeyModel__proto__.registerChild = function registerChild (child) {
  addToArray(this.children, child);
  child.upstream = this;
};

KeyModel__proto__.registerLink = function registerLink (link) {
  addToArray(this.links, link);
};

KeyModel__proto__.unregister = function unregister (dependant) {
  removeFromArray(this.deps, dependant);
};

KeyModel__proto__.unregisterChild = function unregisterChild (child) {
  removeFromArray(this.children, child);
};

KeyModel__proto__.unregisterLink = function unregisterLink (link) {
  removeFromArray(this.links, link);
};

KeyModel.prototype.reference = noop;
KeyModel.prototype.unreference = noop;

var keypathString = /^"(\\"|[^"])+"$/;

var RepeatedFragment = function RepeatedFragment(options) {
  this.parent = options.owner.up;

  // bit of a hack, so reference resolution works without another
  // layer of indirection
  this.up = this;
  this.owner = options.owner;
  this.ractive = this.parent.ractive;
  this.delegate =
    this.ractive.delegate !== false && (this.parent.delegate || findDelegate(this.parent));
  // delegation disabled by directive
  if (this.delegate && this.delegate.delegate === false) { this.delegate = false; }
  // let the element know it's a delegate handler
  if (this.delegate) { this.delegate.delegate = this.delegate; }

  // encapsulated styles should be inherited until they get applied by an element
  this.cssIds = 'cssIds' in options ? options.cssIds : this.parent ? this.parent.cssIds : null;

  this.context = null;
  this.rendered = false;
  this.iterations = [];

  this.template = options.template;

  this.indexRef = options.indexRef;
  this.keyRef = options.keyRef;

  this.pendingNewIndices = null;
  this.previousIterations = null;

  // track array versus object so updates of type rest
  this.isArray = false;
};
var RepeatedFragment__proto__ = RepeatedFragment.prototype;

RepeatedFragment__proto__.bind = function bind (context) {
    var this$1 = this;

  this.context = context;
  this.bound = true;
  var value = context.get();

  var aliases = (this.aliases = this.owner.template.z && this.owner.template.z.slice());

  var shuffler = aliases && aliases.find(function (a) { return a.n === 'shuffle'; });
  if (shuffler && shuffler.x && shuffler.x.x) {
    if (shuffler.x.x.s === 'true') { this.shuffler = true; }
    else if (keypathString.test(shuffler.x.x.s))
      { this.shuffler = splitKeypath(shuffler.x.x.s.slice(1, -1)); }
  }

  if (this.shuffler) { this.values = shuffleValues(this, this.shuffler); }

  if (this.source) { this.source.model.unbind(this.source); }
  var source = context.isComputed && aliases && aliases.find(function (a) { return a.n === 'source'; });
  if (source && source.x && source.x.r) {
    var model = resolve(this, source.x);
    this.source = {
      handleChange: function handleChange() {},
      rebind: function rebind(next) {
        this.model.unregister(this);
        this.model = next;
        next.register(this);
      }
    };
    this.source.model = model;
    model.register(this.source);
  }

  // {{#each array}}...
  if ((this.isArray = isArray(value))) {
    // we can't use map, because of sparse arrays
    this.iterations = [];
    var max = (this.length = value.length);
    for (var i = 0; i < max; i += 1) {
      this$1.iterations[i] = this$1.createIteration(i, i);
    }
  } else if (isObject(value)) {
    // {{#each object}}...
    this.isArray = false;

    // TODO this is a dreadful hack. There must be a neater way
    if (this.indexRef) {
      var refs = this.indexRef.split(',');
      this.keyRef = refs[0];
      this.indexRef = refs[1];
    }

    var ks = keys(value);
    this.length = ks.length;

    this.iterations = ks.map(function (key, index) {
      return this$1.createIteration(key, index);
    });
  }

  return this;
};

RepeatedFragment__proto__.bubble = function bubble (index) {
  if (!this.bubbled) { this.bubbled = []; }
  this.bubbled.push(index);

  if (!this.rebounding) { this.owner.bubble(); }
};

RepeatedFragment__proto__.createIteration = function createIteration (key, index) {
  var fragment = new Fragment({
    owner: this,
    template: this.template
  });

  fragment.isIteration = true;
  fragment.delegate = this.delegate;

  if (this.aliases) { fragment.aliases = {}; }
  swizzleFragment(this, fragment, key, index);

  return fragment.bind(fragment.context);
};

RepeatedFragment__proto__.destroyed = function destroyed () {
    var this$1 = this;

  var len = this.iterations.length;
  for (var i = 0; i < len; i++) { this$1.iterations[i].destroyed(); }
  if (this.pathModel) { this.pathModel.destroyed(); }
  if (this.rootModel) { this.rootModel.destroyed(); }
};

RepeatedFragment__proto__.detach = function detach () {
  var docFrag = createDocumentFragment();
  this.iterations.forEach(function (fragment) { return docFrag.appendChild(fragment.detach()); });
  return docFrag;
};

RepeatedFragment__proto__.find = function find (selector, options) {
  return findMap(this.iterations, function (i) { return i.find(selector, options); });
};

RepeatedFragment__proto__.findAll = function findAll (selector, options) {
  return this.iterations.forEach(function (i) { return i.findAll(selector, options); });
};

RepeatedFragment__proto__.findAllComponents = function findAllComponents (name, options) {
  return this.iterations.forEach(function (i) { return i.findAllComponents(name, options); });
};

RepeatedFragment__proto__.findComponent = function findComponent (name, options) {
  return findMap(this.iterations, function (i) { return i.findComponent(name, options); });
};

RepeatedFragment__proto__.findContext = function findContext () {
  return this.context;
};

RepeatedFragment__proto__.findNextNode = function findNextNode (iteration) {
    var this$1 = this;

  if (iteration.index < this.iterations.length - 1) {
    for (var i = iteration.index + 1; i < this.iterations.length; i++) {
      var node = this$1.iterations[i].firstNode(true);
      if (node) { return node; }
    }
  }

  return this.owner.findNextNode();
};

RepeatedFragment__proto__.firstNode = function firstNode (skipParent) {
  return this.iterations[0] ? this.iterations[0].firstNode(skipParent) : null;
};

RepeatedFragment__proto__.getLast = function getLast () {
  return this.lastModel || (this.lastModel = new KeyModel(this.length - 1));
};

RepeatedFragment__proto__.rebind = function rebind (next) {
    var this$1 = this;

  this.context = next;
  if (this.source) { return; }
  this.iterations.forEach(function (fragment) {
    swizzleFragment(this$1, fragment, fragment.key, fragment.index);
  });
};

RepeatedFragment__proto__.rebound = function rebound (update$$1) {
    var this$1 = this;

  this.context = this.owner.model;
  this.iterations.forEach(function (f, i) {
    f.context = contextFor(this$1, f, i);
    f.rebound(update$$1);
  });
};

RepeatedFragment__proto__.render = function render (target, occupants) {
  var xs = this.iterations;
  if (xs) {
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      xs[i].render(target, occupants);
    }
  }

  this.rendered = true;
};

RepeatedFragment__proto__.shuffle = function shuffle (newIndices, merge) {
    var this$1 = this;

  if (!this.pendingNewIndices) { this.previousIterations = this.iterations.slice(); }

  if (!this.pendingNewIndices) { this.pendingNewIndices = []; }

  this.pendingNewIndices.push(newIndices);

  var iterations = [];

  newIndices.forEach(function (newIndex, oldIndex) {
    if (newIndex === -1) { return; }

    var fragment = this$1.iterations[oldIndex];
    iterations[newIndex] = fragment;

    if (newIndex !== oldIndex && fragment) {
      fragment.dirty = true;
      if (merge) { fragment.shouldRebind = 1; }
    }
  });

  this.iterations = iterations;

  // if merging, we're in the midst of an update already
  if (!merge) { this.bubble(); }
};

RepeatedFragment__proto__.shuffled = function shuffled$1 () {
  this.iterations.forEach(shuffled);
};

RepeatedFragment__proto__.toString = function toString (escape) {
  return this.iterations ? this.iterations.map(escape ? toEscapedString : toString$1).join('') : '';
};

RepeatedFragment__proto__.unbind = function unbind (view) {
  this.bound = false;
  if (this.source) { this.source.model.unregister(this.source); }
  var iterations = this.pendingNewIndices ? this.previousIterations : this.iterations;
  var len = iterations.length;
  for (var i = 0; i < len; i++) { iterations[i].unbind(view); }
  return this;
};

RepeatedFragment__proto__.unrender = function unrender (shouldDestroy) {
    var this$1 = this;

  var len = this.iterations.length;
  for (var i = 0; i < len; i++) { this$1.iterations[i].unrender(shouldDestroy); }
  if (this.pendingNewIndices && this.previousIterations) {
    len = this.previousIterations.length;
    for (var i$1 = 0; i$1 < len; i$1++) { this$1.previousIterations[i$1].unrender(shouldDestroy); }
  }
  this.rendered = false;
};

RepeatedFragment__proto__.update = function update$3 () {
    var this$1 = this;

  if (this.pendingNewIndices) {
    this.bubbled.length = 0;
    this.updatePostShuffle();
    return;
  }

  if (this.updating) { return; }
  this.updating = true;

  if (this.shuffler) {
    var values = shuffleValues(this, this.shuffler);
    var newIndices = buildNewIndices(this.values, values);
    if (!newIndices.same) {
      this.shuffle(newIndices, true);
      this.updatePostShuffle();
    } else {
      this.iterations.forEach(update);
    }
  } else {
    var len = this.iterations.length;
    for (var i = 0; i < len; i++) {
      var f = this$1.iterations[i];
      f && f.idxModel && f.idxModel.applyValue(i);
    }

    var value = this.context.get();
    var wasArray = this.isArray;

    var toRemove;
    var oldKeys;
    var reset = true;
    var i$1;

    if ((this.isArray = isArray(value))) {
      // if there's a source to map back to, make sure everything stays bound correctly
      if (this.source) {
        this.rebounding = 1;
        var source = this.source.model.get();
        this.iterations.forEach(function (f, c) {
          if (c < value.length && f.lastValue !== value[c] && ~(i$1 = source.indexOf(value[c]))) {
            swizzleFragment(this$1, f, c, c);
            f.rebound(true);
          }
        });
        this.rebounding = 0;
      }

      if (wasArray) {
        reset = false;
        if (this.iterations.length > value.length) {
          toRemove = this.iterations.splice(value.length);
        }
      }
    } else if (isObject(value) && !wasArray) {
      reset = false;
      toRemove = [];
      oldKeys = {};
      i$1 = this.iterations.length;

      while (i$1--) {
        var fragment = this$1.iterations[i$1];
        if (fragment.key in value) {
          oldKeys[fragment.key] = true;
        } else {
          this$1.iterations.splice(i$1, 1);
          toRemove.push(fragment);
        }
      }
    }

    var newLength = isArray(value) ? value.length : isObject(value) ? keys(value).length : 0;
    this.length = newLength;
    this.updateLast();

    if (reset) {
      toRemove = this.iterations;
      this.iterations = [];
    }

    if (toRemove) {
      len = toRemove.length;
      for (var i$2 = 0; i$2 < len; i$2++) { toRemove[i$2].unbind().unrender(true); }
    }

    // update the remaining ones
    if (!reset && this.isArray && this.bubbled && this.bubbled.length) {
      var bubbled = this.bubbled;
      this.bubbled = [];
      len = bubbled.length;
      for (var i$3 = 0; i$3 < len; i$3++)
        { this$1.iterations[bubbled[i$3]] && this$1.iterations[bubbled[i$3]].update(); }
    } else {
      len = this.iterations.length;
      for (var i$4 = 0; i$4 < len; i$4++) { this$1.iterations[i$4].update(); }
    }

    // add new iterations
    var docFrag;
    var fragment$1;

    if (newLength > this.iterations.length) {
      docFrag = this.rendered ? createDocumentFragment() : null;
      i$1 = this.iterations.length;

      if (isArray(value)) {
        while (i$1 < value.length) {
          fragment$1 = this$1.createIteration(i$1, i$1);

          this$1.iterations.push(fragment$1);
          if (this$1.rendered) { fragment$1.render(docFrag); }

          i$1 += 1;
        }
      } else if (isObject(value)) {
        // TODO this is a dreadful hack. There must be a neater way
        if (this.indexRef && !this.keyRef) {
          var refs = this.indexRef.split(',');
          this.keyRef = refs[0];
          this.indexRef = refs[1];
        }

        keys(value).forEach(function (key) {
          if (!oldKeys || !(key in oldKeys)) {
            fragment$1 = this$1.createIteration(key, i$1);

            this$1.iterations.push(fragment$1);
            if (this$1.rendered) { fragment$1.render(docFrag); }

            i$1 += 1;
          }
        });
      }

      if (this.rendered) {
        var parentNode = this.parent.findParentNode();
        var anchor = this.parent.findNextNode(this.owner);

        parentNode.insertBefore(docFrag, anchor);
      }
    }
  }

  this.updating = false;
};

RepeatedFragment__proto__.updateLast = function updateLast () {
  if (this.lastModel) { this.lastModel.applyValue(this.length - 1); }
};

RepeatedFragment__proto__.updatePostShuffle = function updatePostShuffle () {
    var this$1 = this;

  var newIndices = this.pendingNewIndices[0];
  var parentNode = this.rendered ? this.parent.findParentNode() : null;
  var nextNode = parentNode && this.owner.findNextNode();
  var docFrag = parentNode ? createDocumentFragment() : null;

  // map first shuffle through
  this.pendingNewIndices.slice(1).forEach(function (indices) {
    newIndices.forEach(function (newIndex, oldIndex) {
      newIndices[oldIndex] = indices[newIndex];
    });
  });

  var len = (this.length = this.context.get().length);
  var prev = this.previousIterations;
  var iters = this.iterations;
  var value = this.context.get();
  var stash = {};
  var idx, dest, pos, next, anchor, rebound;

  var map = new Array(newIndices.length);
  newIndices.forEach(function (e, i) { return (map[e] = i); });

  this.updateLast();

  idx = pos = 0;
  while (idx < len) {
    // if there's not an existing thing to shuffle, handle that
    if (isUndefined(map[idx])) {
      next = iters[idx] = this$1.createIteration(idx, idx);
      if (parentNode) {
        anchor = prev[pos];
        anchor = (anchor && parentNode && anchor.firstNode()) || nextNode;

        next.render(docFrag);
        parentNode.insertBefore(docFrag, anchor);
      }

      idx++;
    } else {
      dest = newIndices[pos];

      if (dest === -1) {
        // if it needs to be dropped, drop it
        prev[pos] && prev[pos].unbind().unrender(true);
        prev[pos++] = 0;
      } else if (dest > idx) {
        // if it needs to move down, stash it
        stash[dest] = prev[pos];
        prev[pos++] = null;
      } else {
        // get the fragment that goes for this idx
        iters[idx] = next = iters[idx] || stash[idx] || this$1.createIteration(idx, idx);

        // if it's an existing fragment, swizzle
        if (stash[idx] || pos !== idx) {
          rebound = this$1.source && next.lastValue !== value[idx];
          swizzleFragment(this$1, next, idx, idx);
        }

        // does next need to be moved?
        if (parentNode && (stash[idx] || !prev[pos])) {
          anchor = prev[pos + 1];
          anchor = (anchor && parentNode && anchor.firstNode()) || nextNode;

          if (stash[idx]) {
            parentNode.insertBefore(next.detach(), anchor);
          } else {
            next.render(docFrag);
            parentNode.insertBefore(docFrag, anchor);
          }
        }

        prev[pos++] = 0;
        idx++;
      }

      if (next && isObjectType(next)) {
        if (next.shouldRebind || rebound) {
          next.rebound(rebound);
          next.shouldRebind = 0;
        }
        next.update();
        next.shuffled();
      }
    }
  }

  // clean up any stragglers
  var plen = prev.length;
  for (var i = 0; i < plen; i++) { prev[i] && prev[i].unbind().unrender(true); }

  if (this.shuffler) { this.values = shuffleValues(this, this.shuffler); }

  this.pendingNewIndices = null;
  this.previousIterations = null;
};

RepeatedFragment.prototype.getContext = getContext;
RepeatedFragment.prototype.getKeypath = getKeypath;

// find the topmost delegate
function findDelegate(start) {
  var frag = start;
  var delegate, el;

  out: while (frag) {
    // find next element
    el = 0;
    while (!el && frag) {
      if (frag.owner.type === ELEMENT) { el = frag.owner; }
      if (frag.owner.ractive && frag.owner.ractive.delegate === false) { break out; }
      frag = frag.parent || frag.componentParent;
    }

    if (el.delegate === false) { break out; }
    delegate = el.delegate || el;

    // find next repeated fragment
    while (frag) {
      if (frag.iterations) { break; }
      if (frag.owner.ractive && frag.owner.ractive.delegate === false) { break out; }
      frag = frag.parent || frag.componentParent;
    }
  }

  return delegate;
}

function swizzleFragment(section, fragment, key, idx) {
  var model = section.context ? contextFor(section, fragment, key) : undefined;

  fragment.key = key;
  fragment.index = idx;
  fragment.context = model;
  if (section.source) { fragment.lastValue = model && model.get(); }

  if (fragment.idxModel) { fragment.idxModel.applyValue(idx); }
  if (fragment.keyModel) { fragment.keyModel.applyValue(key); }
  if (fragment.pathModel) {
    fragment.pathModel.context = model;
    fragment.pathModel.applyValue(model.getKeypath());
  }
  if (fragment.rootModel) {
    fragment.rootModel.context = model;
    fragment.rootModel.applyValue(model.getKeypath(fragment.ractive.root));
  }

  // handle any aliases
  var aliases = fragment.aliases;
  section.aliases &&
    section.aliases.forEach(function (a) {
      if (a.x.r === '.') { aliases[a.n] = model; }
      else if (a.x.r === '@index') { aliases[a.n] = fragment.getIndex(); }
      else if (a.x.r === '@key') { aliases[a.n] = fragment.getKey(); }
      else if (a.x.r === '@keypath') { aliases[a.n] = fragment.getKeypath(); }
      else if (a.x.r === '@rootpath') { aliases[a.n] = fragment.getKeypath(true); }
    });
}

function shuffleValues(section, shuffler) {
  var array = section.context.get() || [];
  if (shuffler === true) {
    return array.slice();
  } else {
    return array.map(function (v) { return shuffler.reduce(function (a, c) { return a && a[c]; }, v); });
  }
}

function contextFor(section, fragment, key) {
  if (section.source) {
    var idx;
    var source = section.source.model.get();
    if (source.indexOf && ~(idx = source.indexOf(section.context.joinKey(key).get())))
      { return section.source.model.joinKey(idx); }
  }

  return section.context.joinKey(key);
}

function isEmpty(value) {
  return (
    !value ||
    (isArray(value) && value.length === 0) ||
    (isObject(value) && keys(value).length === 0)
  );
}

function getType(value, hasIndexRef) {
  if (hasIndexRef || isArray(value)) { return SECTION_EACH; }
  if (isObjectLike(value)) { return SECTION_IF_WITH; }
  if (isUndefined(value)) { return null; }
  return SECTION_IF;
}

var Section = (function (MustacheContainer) {
  function Section(options) {
    MustacheContainer.call(this, options);

    this.isAlias = options.template.t === ALIAS;
    this.sectionType = options.template.n || (this.isAlias && SECTION_WITH) || null;
    this.templateSectionType = this.sectionType;
    this.subordinate = options.template.l === 1;
    this.fragment = null;
  }

  if ( MustacheContainer ) Section.__proto__ = MustacheContainer;
  var Section__proto__ = Section.prototype = Object.create( MustacheContainer && MustacheContainer.prototype );
  Section__proto__.constructor = Section;

  Section__proto__.bind = function bind () {
    MustacheContainer.prototype.bind.call(this);

    if (this.subordinate) {
      this.sibling = this.up.items[this.up.items.indexOf(this) - 1];
      this.sibling.nextSibling = this;
    }

    // if we managed to bind, we need to create children
    if (this.model || this.isAlias) {
      this.dirty = true;
      this.update();
    } else if (
      this.sectionType &&
      this.sectionType === SECTION_UNLESS &&
      (!this.sibling || !this.sibling.isTruthy())
    ) {
      this.fragment = new Fragment({
        owner: this,
        template: this.template.f
      }).bind();
    }
  };

  Section__proto__.bubble = function bubble () {
    if (!this.dirty && this.yield) {
      this.dirty = true;
      this.containerFragment.bubble();
    } else { MustacheContainer.prototype.bubble.call(this); }
  };

  Section__proto__.detach = function detach () {
    var frag = this.fragment || this.detached;
    return frag ? frag.detach() : MustacheContainer.prototype.detach.call(this);
  };

  Section__proto__.isTruthy = function isTruthy () {
    if (this.subordinate && this.sibling.isTruthy()) { return true; }
    var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
    return !!value && (this.templateSectionType === SECTION_IF_WITH || !isEmpty(value));
  };

  Section__proto__.rebind = function rebind (next, previous, safe) {
    if (MustacheContainer.prototype.rebind.call(this, next, previous, safe)) {
      if (this.fragment && this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS) {
        this.fragment.rebind(next);
      }
    }
  };

  Section__proto__.rebound = function rebound (update) {
    if (this.model) {
      if (this.model.rebound) { this.model.rebound(update); }
      else {
        MustacheContainer.prototype.unbind.call(this);
        MustacheContainer.prototype.bind.call(this);
        if (
          this.sectionType === SECTION_WITH ||
          this.sectionType === SECTION_IF_WITH ||
          this.sectionType === SECTION_EACH
        ) {
          if (this.fragment) { this.fragment.rebind(this.model); }
        }

        if (update) { this.bubble(); }
      }
    }
    if (this.fragment) { this.fragment.rebound(update); }
  };

  Section__proto__.render = function render (target, occupants) {
    this.rendered = true;
    if (this.fragment) { this.fragment.render(target, occupants); }
  };

  Section__proto__.shuffle = function shuffle (newIndices) {
    if (this.fragment && this.sectionType === SECTION_EACH) {
      this.fragment.shuffle(newIndices);
    }
  };

  Section__proto__.unbind = function unbind (view) {
    MustacheContainer.prototype.unbind.call(this, view);
    if (this.fragment) { this.fragment.unbind(view); }
  };

  Section__proto__.unrender = function unrender (shouldDestroy) {
    if (this.rendered && this.fragment) { this.fragment.unrender(shouldDestroy); }
    this.rendered = false;
  };

  Section__proto__.update = function update () {
    var this$1 = this;

    if (!this.dirty) { return; }

    if (this.fragment && this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS) {
      this.fragment.context = this.model;
    }

    if (!this.model && this.sectionType !== SECTION_UNLESS && !this.isAlias) { return; }

    this.dirty = false;

    var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
    var siblingFalsey = !this.subordinate || !this.sibling.isTruthy();
    var lastType = this.sectionType;

    if (this.yield && this.yield !== value) {
      this.up = this.containerFragment;
      this.container = null;
      this.yield = null;
      if (this.rendered) { this.fragment.unbind().unrender(true); }
      this.fragment = null;
    } else if (this.rendered && !this.yield && value instanceof Context) {
      if (this.rendered && this.fragment) { this.fragment.unbind().unrender(true); }
      this.fragment = null;
    }

    // watch for switching section types
    if (this.sectionType === null || this.templateSectionType === null)
      { this.sectionType = getType(value, this.template.i); }
    if (lastType && lastType !== this.sectionType && this.fragment) {
      if (this.rendered) {
        this.fragment.unbind().unrender(true);
      }

      this.fragment = null;
    }

    var newFragment;

    var fragmentShouldExist =
      this.sectionType === SECTION_EACH || // each always gets a fragment, which may have no iterations
      this.sectionType === SECTION_WITH || // with (partial context) always gets a fragment
      (siblingFalsey &&
        (this.sectionType === SECTION_UNLESS ? !this.isTruthy() : this.isTruthy())) || // if, unless, and if-with depend on siblings and the condition
      this.isAlias;

    if (fragmentShouldExist) {
      if (!this.fragment) { this.fragment = this.detached; }

      if (this.fragment) {
        // check for detached fragment
        if (this.detached) {
          attach(this, this.fragment);
          this.detached = false;
          this.rendered = true;
        }

        if (!this.fragment.bound) { this.fragment.bind(this.model); }
        this.fragment.update();
      } else {
        if (this.sectionType === SECTION_EACH) {
          newFragment = new RepeatedFragment({
            owner: this,
            template: this.template.f,
            indexRef: this.template.i
          }).bind(this.model);
        } else {
          // only with and if-with provide context - if and unless do not
          var context =
            this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS
              ? this.model
              : null;

          if (value instanceof Context) {
            this.yield = value;
            this.containerFragment = this.up;
            this.up = value.fragment;
            this.container = value.ractive;
            context = undefined;
          }

          newFragment = new Fragment({
            owner: this,
            template: this.template.f
          }).bind(context);
        }
      }
    } else {
      if (this.fragment && this.rendered) {
        if (keep !== true) {
          this.fragment.unbind().unrender(true);
        } else {
          this.unrender(false);
          this.detached = this.fragment;
          runloop.promise().then(function () {
            if (this$1.detached) { this$1.detach(); }
          });
        }
      } else if (this.fragment) {
        this.fragment.unbind();
      }

      this.fragment = null;
    }

    if (newFragment) {
      if (this.rendered) {
        attach(this, newFragment);
      }

      this.fragment = newFragment;
    }

    if (this.nextSibling) {
      this.nextSibling.dirty = true;
      this.nextSibling.update();
    }
  };

  return Section;
}(MustacheContainer));

function attach(section, fragment) {
  var anchor = (section.containerFragment || section.up).findNextNode(section);

  if (anchor) {
    var docFrag = createDocumentFragment();
    fragment.render(docFrag);

    anchor.parentNode.insertBefore(docFrag, anchor);
  } else {
    fragment.render(section.up.findParentNode());
  }
}

var Select = (function (Element) {
  function Select(options) {
    Element.call(this, options);
    this.options = [];
  }

  if ( Element ) Select.__proto__ = Element;
  var Select__proto__ = Select.prototype = Object.create( Element && Element.prototype );
  Select__proto__.constructor = Select;

  Select__proto__.foundNode = function foundNode (node) {
    if (this.binding) {
      var selectedOptions = getSelectedOptions(node);

      if (selectedOptions.length > 0) {
        this.selectedOptions = selectedOptions;
      }
    }
  };

  Select__proto__.render = function render (target, occupants) {
    Element.prototype.render.call(this, target, occupants);
    this.sync();

    var node = this.node;

    var i = node.options.length;
    while (i--) {
      node.options[i].defaultSelected = node.options[i].selected;
    }

    this.rendered = true;
  };

  Select__proto__.sync = function sync () {
    var this$1 = this;

    var selectNode = this.node;

    if (!selectNode) { return; }

    var options = toArray(selectNode.options);

    if (this.selectedOptions) {
      options.forEach(function (o) {
        if (this$1.selectedOptions.indexOf(o) >= 0) { o.selected = true; }
        else { o.selected = false; }
      });
      this.binding.setFromNode(selectNode);
      delete this.selectedOptions;
      return;
    }

    var selectValue = this.getAttribute('value');
    var isMultiple = this.getAttribute('multiple');
    var array = isMultiple && isArray(selectValue);

    // If the <select> has a specified value, that should override
    // these options
    if (selectValue !== undefined) {
      var optionWasSelected;

      options.forEach(function (o) {
        var optionValue = o._ractive ? o._ractive.value : o.value;
        var shouldSelect = isMultiple
          ? array && this$1.valueContains(selectValue, optionValue)
          : this$1.compare(selectValue, optionValue);

        if (shouldSelect) {
          optionWasSelected = true;
        }

        o.selected = shouldSelect;
      });

      if (!optionWasSelected && !isMultiple) {
        if (this.binding) {
          this.binding.forceUpdate();
        }
      }
    } else if (this.binding && this.binding.forceUpdate) {
      // Otherwise the value should be initialised according to which
      // <option> element is selected, if twoway binding is in effect
      this.binding.forceUpdate();
    }
  };
  Select__proto__.valueContains = function valueContains (selectValue, optionValue) {
    var this$1 = this;

    var i = selectValue.length;
    while (i--) {
      if (this$1.compare(optionValue, selectValue[i])) { return true; }
    }
  };
  Select__proto__.compare = function compare (optionValue, selectValue) {
    var comparator = this.getAttribute('value-comparator');
    if (comparator) {
      if (isFunction(comparator)) {
        return comparator(selectValue, optionValue);
      }
      if (selectValue && optionValue) {
        return selectValue[comparator] == optionValue[comparator];
      }
    }
    return selectValue == optionValue;
  };
  Select__proto__.update = function update () {
    var dirty = this.dirty;
    Element.prototype.update.call(this);
    if (dirty) {
      this.sync();
    }
  };

  return Select;
}(Element));

var Textarea = (function (Input) {
  function Textarea(options) {
    var template = options.template;

    options.deferContent = true;

    Input.call(this, options);

    // check for single interpolator binding
    if (!this.attributeByName.value) {
      if (template.f && isBindable({ template: template })) {
        (this.attributes || (this.attributes = [])).push(
          createItem({
            owner: this,
            template: { t: ATTRIBUTE, f: template.f, n: 'value' },
            up: this.up
          })
        );
      } else {
        this.fragment = new Fragment({
          owner: this,
          cssIds: null,
          template: template.f
        });
      }
    }
  }

  if ( Input ) Textarea.__proto__ = Input;
  var Textarea__proto__ = Textarea.prototype = Object.create( Input && Input.prototype );
  Textarea__proto__.constructor = Textarea;

  Textarea__proto__.bubble = function bubble () {
    var this$1 = this;

    if (!this.dirty) {
      this.dirty = true;

      if (this.rendered && !this.binding && this.fragment) {
        runloop.scheduleTask(function () {
          this$1.dirty = false;
          this$1.node.value = this$1.fragment.toString();
        });
      }

      this.up.bubble(); // default behaviour
    }
  };

  return Textarea;
}(Input));

var Text = (function (Item) {
  function Text(options) {
    Item.call(this, options);
    this.type = TEXT;
  }

  if ( Item ) Text.__proto__ = Item;
  var Text__proto__ = Text.prototype = Object.create( Item && Item.prototype );
  Text__proto__.constructor = Text;

  Text__proto__.detach = function detach () {
    return detachNode(this.node);
  };

  Text__proto__.firstNode = function firstNode () {
    return this.node;
  };

  Text__proto__.render = function render (target, occupants) {
    if (inAttributes()) { return; }
    this.rendered = true;

    progressiveText(this, target, occupants, this.template);
  };

  Text__proto__.toString = function toString (escape) {
    return escape ? escapeHtml(this.template) : this.template;
  };

  Text__proto__.unrender = function unrender (shouldDestroy) {
    if (this.rendered && shouldDestroy) { this.detach(); }
    this.rendered = false;
  };

  Text__proto__.valueOf = function valueOf () {
    return this.template;
  };

  return Text;
}(Item));

var proto$7 = Text.prototype;
proto$7.bind = proto$7.unbind = proto$7.update = noop;

var visible;
var hidden = 'hidden';

if (doc) {
  var prefix$2;

  /* istanbul ignore next */
  if (hidden in doc) {
    prefix$2 = '';
  } else {
    var i$1 = vendors.length;
    while (i$1--) {
      var vendor = vendors[i$1];
      hidden = vendor + 'Hidden';

      if (hidden in doc) {
        prefix$2 = vendor;
        break;
      }
    }
  }

  /* istanbul ignore else */
  if (prefix$2 !== undefined) {
    doc.addEventListener(prefix$2 + 'visibilitychange', onChange);
    onChange();
  } else {
    // gah, we're in an old browser
    if ('onfocusout' in doc) {
      doc.addEventListener('focusout', onHide);
      doc.addEventListener('focusin', onShow);
    } else {
      win.addEventListener('pagehide', onHide);
      win.addEventListener('blur', onHide);

      win.addEventListener('pageshow', onShow);
      win.addEventListener('focus', onShow);
    }

    visible = true; // until proven otherwise. Not ideal but hey
  }
}

function onChange() {
  visible = !doc[hidden];
}

/* istanbul ignore next */
function onHide() {
  visible = false;
}

/* istanbul ignore next */
function onShow() {
  visible = true;
}

var prefix;

/* istanbul ignore next */
if (!isClient) {
  prefix = null;
} else {
  var prefixCache = {};
  var testStyle = createElement('div').style;

  // technically this also normalizes on hyphenated styles as well
  prefix = function(prop) {
    if (!prefixCache[prop]) {
      var name = hyphenateCamel(prop);

      if (testStyle[prop] !== undefined) {
        prefixCache[prop] = name;
      } else {
        /* istanbul ignore next */
        // test vendors...
        var i = vendors.length;
        while (i--) {
          var vendor = "-" + (vendors[i]) + "-" + name;
          if (testStyle[vendor] !== undefined) {
            prefixCache[prop] = vendor;
            break;
          }
        }
      }
    }

    return prefixCache[prop];
  };
}

var prefix$1 = prefix;

var vendorPattern = new RegExp('^(?:' + vendors.join('|') + ')([A-Z])');

function hyphenate(str) {
  /* istanbul ignore next */
  if (!str) { return ''; } // edge case

  /* istanbul ignore next */
  if (vendorPattern.test(str)) { str = '-' + str; }

  return str.replace(/[A-Z]/g, function (match) { return '-' + match.toLowerCase(); });
}

var createTransitions;

if (!isClient) {
  createTransitions = null;
} else {
  var testStyle$1 = createElement('div').style;
  var linear$1 = function (x) { return x; };

  var canUseCssTransitions = {};
  var cannotUseCssTransitions = {};

  // determine some facts about our environment
  var TRANSITION$1;
  var TRANSITIONEND;
  var CSS_TRANSITIONS_ENABLED;
  var TRANSITION_DURATION;
  var TRANSITION_PROPERTY;
  var TRANSITION_TIMING_FUNCTION;

  if (testStyle$1.transition !== undefined) {
    TRANSITION$1 = 'transition';
    TRANSITIONEND = 'transitionend';
    CSS_TRANSITIONS_ENABLED = true;
  } else if (testStyle$1.webkitTransition !== undefined) {
    TRANSITION$1 = 'webkitTransition';
    TRANSITIONEND = 'webkitTransitionEnd';
    CSS_TRANSITIONS_ENABLED = true;
  } else {
    CSS_TRANSITIONS_ENABLED = false;
  }

  if (TRANSITION$1) {
    TRANSITION_DURATION = TRANSITION$1 + 'Duration';
    TRANSITION_PROPERTY = TRANSITION$1 + 'Property';
    TRANSITION_TIMING_FUNCTION = TRANSITION$1 + 'TimingFunction';
  }

  createTransitions = function(t, to, options, changedProperties, resolve) {
    // Wait a beat (otherwise the target styles will be applied immediately)
    // TODO use a fastdom-style mechanism?
    setTimeout(function () {
      var jsTransitionsComplete;
      var cssTransitionsComplete;
      var cssTimeout; // eslint-disable-line prefer-const

      function transitionDone() {
        clearTimeout(cssTimeout);
      }

      function checkComplete() {
        if (jsTransitionsComplete && cssTransitionsComplete) {
          t.unregisterCompleteHandler(transitionDone);
          // will changes to events and fire have an unexpected consequence here?
          t.ractive.fire(t.name + ':end', t.node, t.isIntro);
          resolve();
        }
      }

      // this is used to keep track of which elements can use CSS to animate
      // which properties
      var hashPrefix = (t.node.namespaceURI || '') + t.node.tagName;

      // need to reset transition properties
      var style = t.node.style;
      var previous = {
        property: style[TRANSITION_PROPERTY],
        timing: style[TRANSITION_TIMING_FUNCTION],
        duration: style[TRANSITION_DURATION]
      };

      function transitionEndHandler(event) {
        if (event.target !== t.node) { return; }
        var index = changedProperties.indexOf(event.propertyName);

        if (index !== -1) {
          changedProperties.splice(index, 1);
        }

        if (changedProperties.length) {
          // still transitioning...
          return;
        }

        clearTimeout(cssTimeout);
        cssTransitionsDone();
      }

      function cssTransitionsDone() {
        style[TRANSITION_PROPERTY] = previous.property;
        style[TRANSITION_TIMING_FUNCTION] = previous.duration;
        style[TRANSITION_DURATION] = previous.timing;

        t.node.removeEventListener(TRANSITIONEND, transitionEndHandler, false);

        cssTransitionsComplete = true;
        checkComplete();
      }

      t.node.addEventListener(TRANSITIONEND, transitionEndHandler, false);

      // safety net in case transitionend never fires
      cssTimeout = setTimeout(function () {
        changedProperties = [];
        cssTransitionsDone();
      }, options.duration + (options.delay || 0) + 50);
      t.registerCompleteHandler(transitionDone);

      style[TRANSITION_PROPERTY] = changedProperties.join(',');
      var easingName = hyphenate(options.easing || 'linear');
      style[TRANSITION_TIMING_FUNCTION] = easingName;
      var cssTiming = style[TRANSITION_TIMING_FUNCTION] === easingName;
      style[TRANSITION_DURATION] = options.duration / 1000 + 's';

      setTimeout(function () {
        var i = changedProperties.length;
        var hash;
        var originalValue = null;
        var index;
        var propertiesToTransitionInJs = [];
        var prop;
        var suffix;
        var interpolator;

        while (i--) {
          prop = changedProperties[i];
          hash = hashPrefix + prop;

          if (cssTiming && CSS_TRANSITIONS_ENABLED && !cannotUseCssTransitions[hash]) {
            var initial = style[prop];
            style[prop] = to[prop];

            // If we're not sure if CSS transitions are supported for
            // this tag/property combo, find out now
            if (!(hash in canUseCssTransitions)) {
              originalValue = t.getStyle(prop);

              // if this property is transitionable in this browser,
              // the current style will be different from the target style
              canUseCssTransitions[hash] = t.getStyle(prop) != to[prop];
              cannotUseCssTransitions[hash] = !canUseCssTransitions[hash];

              // Reset, if we're going to use timers after all
              if (cannotUseCssTransitions[hash]) {
                style[prop] = initial;
              }
            }
          }

          if (!cssTiming || !CSS_TRANSITIONS_ENABLED || cannotUseCssTransitions[hash]) {
            // we need to fall back to timer-based stuff
            if (originalValue === null) { originalValue = t.getStyle(prop); }

            // need to remove this from changedProperties, otherwise transitionEndHandler
            // will get confused
            index = changedProperties.indexOf(prop);
            if (index === -1) {
              warnIfDebug(
                'Something very strange happened with transitions. Please raise an issue at https://github.com/ractivejs/ractive/issues - thanks!',
                { node: t.node }
              );
            } else {
              changedProperties.splice(index, 1);
            }

            // TODO Determine whether this property is animatable at all

            suffix = /[^\d]*$/.exec(originalValue)[0];
            interpolator = interpolate(parseFloat(originalValue), parseFloat(to[prop]));

            // ...then kick off a timer-based transition
            if (interpolator) {
              propertiesToTransitionInJs.push({
                name: prop,
                interpolator: interpolator,
                suffix: suffix
              });
            } else {
              style[prop] = to[prop];
            }

            originalValue = null;
          }
        }

        // javascript transitions
        if (propertiesToTransitionInJs.length) {
          var easing;

          if (isString(options.easing)) {
            easing = t.ractive.easing[options.easing];

            if (!easing) {
              warnOnceIfDebug(missingPlugin(options.easing, 'easing'));
              easing = linear$1;
            }
          } else if (isFunction(options.easing)) {
            easing = options.easing;
          } else {
            easing = linear$1;
          }

          new Ticker({
            duration: options.duration,
            easing: easing,
            step: function step(pos) {
              var i = propertiesToTransitionInJs.length;
              while (i--) {
                var prop = propertiesToTransitionInJs[i];
                style[prop.name] = prop.interpolator(pos) + prop.suffix;
              }
            },
            complete: function complete() {
              jsTransitionsComplete = true;
              checkComplete();
            }
          });
        } else {
          jsTransitionsComplete = true;
        }

        if (changedProperties.length) {
          style[TRANSITION_PROPERTY] = changedProperties.join(',');
        } else {
          style[TRANSITION_PROPERTY] = 'none';

          // We need to cancel the transitionEndHandler, and deal with
          // the fact that it will never fire
          t.node.removeEventListener(TRANSITIONEND, transitionEndHandler, false);
          cssTransitionsComplete = true;
          checkComplete();
        }
      }, 0);
    }, options.delay || 0);
  };
}

var createTransitions$1 = createTransitions;

var getComputedStyle = win && win.getComputedStyle;
var resolved = Promise.resolve();

var names = {
  t0: 'intro-outro',
  t1: 'intro',
  t2: 'outro'
};

var Transition = function Transition(options) {
  this.owner = options.owner || options.up.owner || findElement(options.up);
  this.element = this.owner.attributeByName ? this.owner : findElement(options.up);
  this.ractive = this.owner.ractive;
  this.template = options.template;
  this.up = options.up;
  this.options = options;
  this.onComplete = [];
};
var Transition__proto__ = Transition.prototype;

Transition__proto__.animateStyle = function animateStyle (style, value, options) {
    var this$1 = this;

  if (arguments.length === 4) {
    throw new Error(
      't.animateStyle() returns a promise - use .then() instead of passing a callback'
    );
  }

  // Special case - page isn't visible. Don't animate anything, because
  // that way you'll never get CSS transitionend events
  if (!visible) {
    this.setStyle(style, value);
    return resolved;
  }

  var to;

  if (isString(style)) {
    to = {};
    to[style] = value;
  } else {
    to = style;

    // shuffle arguments
    options = value;
  }

  return new Promise(function (fulfil) {
    // Edge case - if duration is zero, set style synchronously and complete
    if (!options.duration) {
      this$1.setStyle(to);
      fulfil();
      return;
    }

    // Get a list of the properties we're animating
    var propertyNames = keys(to);
    var changedProperties = [];

    // Store the current styles
    var computedStyle = getComputedStyle(this$1.node);

    var i = propertyNames.length;
    while (i--) {
      var prop = propertyNames[i];
      var name = prefix$1(prop);

      var current = computedStyle[prefix$1(prop)];

      // record the starting points
      var init = this$1.node.style[name];
      if (!(name in this$1.originals)) { this$1.originals[name] = this$1.node.style[name]; }
      this$1.node.style[name] = to[prop];
      this$1.targets[name] = this$1.node.style[name];
      this$1.node.style[name] = init;

      // we need to know if we're actually changing anything
      if (current != to[prop]) {
        // use != instead of !==, so we can compare strings with numbers
        changedProperties.push(name);

        // if we happened to prefix, make sure there is a properly prefixed value
        to[name] = to[prop];

        // make the computed style explicit, so we can animate where
        // e.g. height='auto'
        this$1.node.style[name] = current;
      }
    }

    // If we're not actually changing anything, the transitionend event
    // will never fire! So we complete early
    if (!changedProperties.length) {
      fulfil();
      return;
    }

    createTransitions$1(this$1, to, options, changedProperties, fulfil);
  });
};

Transition__proto__.bind = function bind () {
  var options = this.options;
  var type = options.template && options.template.v;
  if (type) {
    if (type === 't0' || type === 't1') { this.element.intro = this; }
    if (type === 't0' || type === 't2') { this.element.outro = this; }
    this.eventName = names[type];
  }

  var ractive = this.owner.ractive;

  this.name = options.name || options.template.n;

  if (options.params) {
    this.params = options.params;
  }

  if (isFunction(this.name)) {
    this._fn = this.name;
    this.name = this._fn.name;
  } else {
    this._fn = findInViewHierarchy('transitions', ractive, this.name);
  }

  if (!this._fn) {
    warnOnceIfDebug(missingPlugin(this.name, 'transition'), { ractive: ractive });
  }

  setupArgsFn(this, options.template);
};

Transition__proto__.getParams = function getParams () {
  if (this.params) { return this.params; }

  // get expression args if supplied
  if (this.fn) {
    var values = resolveArgs(this, this.template, this.up).map(function (model) {
      if (!model) { return undefined; }

      return model.get();
    });
    return this.fn.apply(this.ractive, values);
  }
};

Transition__proto__.getStyle = function getStyle (props) {
  var computedStyle = getComputedStyle(this.node);

  if (isString(props)) {
    return computedStyle[prefix$1(props)];
  }

  if (!isArray(props)) {
    throw new Error(
      'Transition$getStyle must be passed a string, or an array of strings representing CSS properties'
    );
  }

  var styles = {};

  var i = props.length;
  while (i--) {
    var prop = props[i];
    var value = computedStyle[prefix$1(prop)];

    if (value === '0px') { value = 0; }
    styles[prop] = value;
  }

  return styles;
};

Transition__proto__.processParams = function processParams (params, defaults) {
  if (isNumber(params)) {
    params = { duration: params };
  } else if (isString(params)) {
    if (params === 'slow') {
      params = { duration: 600 };
    } else if (params === 'fast') {
      params = { duration: 200 };
    } else {
      params = { duration: 400 };
    }
  } else if (!params) {
    params = {};
  }

  return assign({}, defaults, params);
};

Transition__proto__.registerCompleteHandler = function registerCompleteHandler (fn) {
  addToArray(this.onComplete, fn);
};

Transition__proto__.setStyle = function setStyle (style, value) {
    var this$1 = this;

  if (isString(style)) {
    var name = prefix$1(style);
    if (!hasOwn(this.originals, name)) { this.originals[name] = this.node.style[name]; }
    this.node.style[name] = value;
    this.targets[name] = this.node.style[name];
  } else {
    var prop;
    for (prop in style) {
      if (hasOwn(style, prop)) {
        this$1.setStyle(prop, style[prop]);
      }
    }
  }

  return this;
};

Transition__proto__.shouldFire = function shouldFire (type) {
  if (!this.ractive.transitionsEnabled) { return false; }

  // check for noIntro and noOutro cases, which only apply when the owner ractive is rendering and unrendering, respectively
  if (type === 'intro' && this.ractive.rendering && nearestProp('noIntro', this.ractive, true))
    { return false; }
  if (type === 'outro' && this.ractive.unrendering && nearestProp('noOutro', this.ractive, false))
    { return false; }

  var params = this.getParams(); // this is an array, the params object should be the first member
  // if there's not a parent element, this can't be nested, so roll on
  if (!this.element.parent) { return true; }

  // if there is a local param, it takes precedent
  if (params && params[0] && isObject(params[0]) && 'nested' in params[0]) {
    if (params[0].nested !== false) { return true; }
  } else {
    // use the nearest instance setting
    // find the nearest instance that actually has a nested setting
    if (nearestProp('nestedTransitions', this.ractive) !== false) { return true; }
  }

  // check to see if this is actually a nested transition
  var el = this.element.parent;
  while (el) {
    if (el[type] && el[type].starting) { return false; }
    el = el.parent;
  }

  return true;
};

Transition__proto__.start = function start () {
    var this$1 = this;

  var node = (this.node = this.element.node);
  var originals = (this.originals = {}); //= node.getAttribute( 'style' );
  var targets = (this.targets = {});

  var completed;
  var args = this.getParams();

  // create t.complete() - we don't want this on the prototype,
  // because we don't want `this` silliness when passing it as
  // an argument
  this.complete = function (noReset) {
    this$1.starting = false;
    if (completed) {
      return;
    }

    this$1.onComplete.forEach(function (fn) { return fn(); });
    if (!noReset && this$1.isIntro) {
      for (var k in targets) {
        if (node.style[k] === targets[k]) { node.style[k] = originals[k]; }
      }
    }

    this$1._manager.remove(this$1);

    completed = true;
  };

  // If the transition function doesn't exist, abort
  if (!this._fn) {
    this.complete();
    return;
  }

  var promise = this._fn.apply(this.ractive, [this].concat(args));
  if (promise) { promise.then(this.complete); }
};

Transition__proto__.toString = function toString () {
  return '';
};

Transition__proto__.unbind = function unbind () {
  if (!this.element.attributes.unbinding) {
    var type = this.options && this.options.template && this.options.template.v;
    if (type === 't0' || type === 't1') { this.element.intro = null; }
    if (type === 't0' || type === 't2') { this.element.outro = null; }
  }
};

Transition__proto__.unregisterCompleteHandler = function unregisterCompleteHandler (fn) {
  removeFromArray(this.onComplete, fn);
};

var proto$8 = Transition.prototype;
proto$8.destroyed = proto$8.firstNode = proto$8.rebound = proto$8.render = proto$8.unrender = proto$8.update = noop;

function nearestProp(prop, ractive, rendering) {
  var instance = ractive;
  while (instance) {
    if (
      hasOwn(instance, prop) &&
      (isUndefined(rendering) || rendering ? instance.rendering : instance.unrendering)
    )
      { return instance[prop]; }
    instance = instance.component && instance.component.ractive;
  }

  return ractive[prop];
}

var elementCache = {};

var ieBug;
var ieBlacklist;

try {
  createElement('table').innerHTML = 'foo';
} catch (/* istanbul ignore next */ err) {
  ieBug = true;

  ieBlacklist = {
    TABLE: ['<table class="x">', '</table>'],
    THEAD: ['<table><thead class="x">', '</thead></table>'],
    TBODY: ['<table><tbody class="x">', '</tbody></table>'],
    TR: ['<table><tr class="x">', '</tr></table>'],
    SELECT: ['<select class="x">', '</select>']
  };
}

function insertHtml(html$$1, node) {
  var nodes = [];

  // render 0 and false
  if (html$$1 == null || html$$1 === '') { return nodes; }

  var container;
  var wrapper;
  var selectedOption;

  /* istanbul ignore if */
  if (ieBug && (wrapper = ieBlacklist[node.tagName])) {
    container = element('DIV');
    container.innerHTML = wrapper[0] + html$$1 + wrapper[1];
    container = container.querySelector('.x');

    if (container.tagName === 'SELECT') {
      selectedOption = container.options[container.selectedIndex];
    }
  } else if (node.namespaceURI === svg$1) {
    container = element('DIV');
    container.innerHTML = '<svg class="x">' + html$$1 + '</svg>';
    container = container.querySelector('.x');
  } else if (node.tagName === 'TEXTAREA') {
    container = createElement('div');

    if (typeof container.textContent !== 'undefined') {
      container.textContent = html$$1;
    } else {
      container.innerHTML = html$$1;
    }
  } else {
    container = element(node.tagName);
    container.innerHTML = html$$1;

    if (container.tagName === 'SELECT') {
      selectedOption = container.options[container.selectedIndex];
    }
  }

  var child;
  while ((child = container.firstChild)) {
    nodes.push(child);
    container.removeChild(child);
  }

  // This is really annoying. Extracting <option> nodes from the
  // temporary container <select> causes the remaining ones to
  // become selected. So now we have to deselect them. IE8, you
  // amaze me. You really do
  // ...and now Chrome too
  var i;
  if (node.tagName === 'SELECT') {
    i = nodes.length;
    while (i--) {
      if (nodes[i] !== selectedOption) {
        nodes[i].selected = false;
      }
    }
  }

  return nodes;
}

function element(tagName) {
  return elementCache[tagName] || (elementCache[tagName] = createElement(tagName));
}

var Triple = (function (Mustache) {
  function Triple(options) {
    Mustache.call(this, options);
  }

  if ( Mustache ) Triple.__proto__ = Mustache;
  var Triple__proto__ = Triple.prototype = Object.create( Mustache && Mustache.prototype );
  Triple__proto__.constructor = Triple;

  Triple__proto__.detach = function detach () {
    var docFrag = createDocumentFragment();
    if (this.nodes) { this.nodes.forEach(function (node) { return docFrag.appendChild(node); }); }
    return docFrag;
  };

  Triple__proto__.find = function find (selector) {
    var this$1 = this;

    var len = this.nodes.length;
    var i;

    for (i = 0; i < len; i += 1) {
      var node = this$1.nodes[i];

      if (node.nodeType !== 1) { continue; }

      if (matches(node, selector)) { return node; }

      var queryResult = node.querySelector(selector);
      if (queryResult) { return queryResult; }
    }

    return null;
  };

  Triple__proto__.findAll = function findAll (selector, options) {
    var this$1 = this;

    var result = options.result;
    var len = this.nodes.length;
    var i;

    for (i = 0; i < len; i += 1) {
      var node = this$1.nodes[i];

      if (node.nodeType !== 1) { continue; }

      if (matches(node, selector)) { result.push(node); }

      var queryAllResult = node.querySelectorAll(selector);
      if (queryAllResult) {
        result.push.apply(result, queryAllResult);
      }
    }
  };

  Triple__proto__.findComponent = function findComponent () {
    return null;
  };

  Triple__proto__.firstNode = function firstNode () {
    return this.rendered && this.nodes[0];
  };

  Triple__proto__.render = function render (target, occupants, anchor) {
    var this$1 = this;

    if (!this.nodes) {
      var html = this.model ? this.model.get() : '';
      this.nodes = insertHtml(html, target);
    }

    var nodes = this.nodes;

    // progressive enhancement
    if (occupants) {
      var i = -1;
      var next;

      // start with the first node that should be rendered
      while (occupants.length && (next = this.nodes[i + 1])) {
        var n = (void 0);
        // look through the occupants until a matching node is found
        while ((n = occupants.shift())) {
          var t = n.nodeType;

          if (
            t === next.nodeType &&
            ((t === 1 && n.outerHTML === next.outerHTML) ||
              ((t === 3 || t === 8) && n.nodeValue === next.nodeValue))
          ) {
            this$1.nodes.splice(++i, 1, n); // replace the generated node with the existing one
            break;
          } else {
            target.removeChild(n); // remove the non-matching existing node
          }
        }
      }

      if (i >= 0) {
        // update the list of remaining nodes to attach, excluding any that were replaced by existing nodes
        nodes = this.nodes.slice(i);
      }

      // update the anchor to be the next occupant
      if (occupants.length) { anchor = occupants[0]; }
    }

    // attach any remainging nodes to the parent
    if (nodes.length) {
      var frag = createDocumentFragment();
      nodes.forEach(function (n) { return frag.appendChild(n); });

      if (anchor) {
        target.insertBefore(frag, anchor);
      } else {
        target.appendChild(frag);
      }
    }

    this.rendered = true;
  };

  Triple__proto__.toString = function toString () {
    var value = this.model && this.model.get();
    value = value != null ? '' + value : '';

    return inAttribute() ? decodeCharacterReferences(value) : value;
  };

  Triple__proto__.unrender = function unrender () {
    if (this.nodes)
      { this.nodes.forEach(function (node) {
        // defer detachment until all relevant outros are done
        runloop.detachWhenReady({
          node: node,
          detach: function detach() {
            detachNode(node);
          }
        });
      }); }
    this.rendered = false;
    this.nodes = null;
  };

  Triple__proto__.update = function update () {
    if (this.rendered && this.dirty) {
      this.dirty = false;

      this.unrender();
      this.render(this.up.findParentNode(), null, this.up.findNextNode(this));
    } else {
      // make sure to reset the dirty flag even if not rendered
      this.dirty = false;
    }
  };

  return Triple;
}(Mustache));

// finds the component constructor in the registry or view hierarchy registries
function getComponentConstructor(ractive, name) {
  var instance = findInstance('components', ractive, name);
  var Component;

  if (instance) {
    Component = instance.components[name];

    if (Component && !Component.isInstance) {
      if (Component.default && Component.default.isInstance) { Component = Component.default; }
      else if (!Component.then && isFunction(Component)) {
        // function option, execute and store for reset
        var fn = Component.bind(instance);
        fn.isOwner = hasOwn(instance.components, name);
        Component = fn();

        if (!Component) {
          warnIfDebug(noRegistryFunctionReturn, name, 'component', 'component', {
            ractive: ractive
          });
          return;
        }

        if (isString(Component)) {
          // allow string lookup
          Component = getComponentConstructor(ractive, Component);
        }

        Component._fn = fn;
        instance.components[name] = Component;
      }
    }
  }

  return Component;
}

function asyncProxy(promise, options) {
  var partials = options.template.p || {};
  var name = options.template.e;

  var opts = assign({}, options, {
    template: { t: ELEMENT, e: name },
    macro: function macro(handle) {
      handle.setTemplate(partials['async-loading'] || []);
      promise.then(
        function (cmp) {
          options.up.ractive.components[name] = cmp;
          if (partials['async-loaded']) {
            handle.partials.component = [options.template];
            handle.setTemplate(partials['async-loaded']);
          } else {
            handle.setTemplate([options.template]);
          }
        },
        function (err) {
          if (partials['async-failed']) {
            handle.aliasLocal('error', 'error');
            handle.set('@local.error', err);
            handle.setTemplate(partials['async-failed']);
          } else {
            handle.setTemplate([]);
          }
        }
      );
    }
  });
  return new Partial(opts);
}

function extract(tpl, type, name) {
  var p = tpl.f.find(function (s) { return s.t === type; });
  if (p) {
    if (p.n)
      { return [
        {
          t: 19,
          n: 54,
          f: p.f || [],
          z: [{ n: p.n, x: { r: ("__await." + name) } }]
        }
      ]; }
    else { return p.f || []; }
  } else { return []; }
}

function Await(options) {
  var tpl = options.template;

  var success = extract(tpl, THEN, 'value');
  var error = extract(tpl, CATCH, 'error');
  var pending = extract(tpl, SECTION);
  var undef = extract(tpl, ELSE);

  var opts = assign({}, options, {
    template: {
      t: ELEMENT,
      m: [
        {
          t: ATTRIBUTE,
          n: 'for',
          f: [{ t: INTERPOLATOR, r: tpl.r, rx: tpl.rx, x: tpl.x }]
        }
      ]
    },
    macro: function macro(handle, attrs) {
      handle.aliasLocal('__await');

      function update(attrs) {
        if (attrs.for && isFunction(attrs.for.then)) {
          handle.setTemplate(pending);

          attrs.for.then(
            function (v) {
              handle.set('@local.value', v);
              handle.setTemplate(success);
            },
            function (e) {
              handle.set('@local.error', e);
              handle.setTemplate(error);
            }
          );
        } else if (isUndefined(attrs.for)) {
          handle.setTemplate(undef);
        } else {
          handle.set('@local.value', attrs.for);
          handle.setTemplate(success);
        }
      }

      update(attrs);

      return {
        update: update
      };
    }
  });

  opts.macro.attributes = ['for'];

  return new Partial(opts);
}

var constructors = {};
constructors[ALIAS] = Section;
constructors[ANCHOR] = Component;
constructors[AWAIT] = Await;
constructors[DOCTYPE] = Doctype;
constructors[INTERPOLATOR] = Interpolator;
constructors[PARTIAL] = Partial;
constructors[SECTION] = Section;
constructors[TRIPLE] = Triple;
constructors[YIELDER] = Partial;

constructors[ATTRIBUTE] = Attribute;
constructors[BINDING_FLAG] = BindingFlag;
constructors[DECORATOR] = Decorator;
constructors[EVENT] = EventDirective;
constructors[TRANSITION] = Transition;
constructors[COMMENT] = Comment;

var specialElements = {
  doctype: Doctype,
  form: Form,
  input: Input,
  option: Option,
  select: Select,
  textarea: Textarea
};

function createItem(options) {
  if (isString(options.template)) {
    return new Text(options);
  }

  var ctor;
  var name;
  var type = options.template.t;

  if (type === ELEMENT) {
    name = options.template.e;

    // could be a macro partial
    ctor = findInstance('partials', options.up.ractive, name);
    if (ctor) {
      ctor = ctor.partials[name];
      if (ctor.styleSet) {
        options.macro = ctor;
        return new Partial(options);
      }
    }

    // could be component or element
    ctor = getComponentConstructor(options.up.ractive, name);
    if (ctor) {
      if (isFunction(ctor.then)) {
        return asyncProxy(ctor, options);
      } else if (isFunction(ctor)) {
        return new Component(options, ctor);
      }
    }

    ctor = specialElements[name.toLowerCase()] || Element;
    return new ctor(options);
  }

  var Item;

  // component mappings are a special case of attribute
  if (type === ATTRIBUTE) {
    var el = options.owner;
    if (!el || (el.type !== ANCHOR && el.type !== COMPONENT && el.type !== ELEMENT)) {
      el = findElement(options.up);
    }
    options.element = el;

    Item = el.type === COMPONENT || el.type === ANCHOR ? Mapping : Attribute;
  } else {
    Item = constructors[type];
  }

  if (!Item) { throw new Error(("Unrecognised item type " + type)); }

  return new Item(options);
}

// TODO all this code needs to die
function processItems(items, values, guid, counter) {
  if ( counter === void 0 ) counter = 0;

  return items
    .map(function (item) {
      if (item.type === TEXT) {
        return item.template;
      }

      if (item.fragment) {
        if (item.fragment.iterations) {
          return item.fragment.iterations
            .map(function (fragment) {
              return processItems(fragment.items, values, guid, counter);
            })
            .join('');
        } else {
          return processItems(item.fragment.items, values, guid, counter);
        }
      }

      var placeholderId = guid + "-" + (counter++);
      var model = item.model || item.newModel;

      values[placeholderId] = model
        ? model.wrapper
          ? model.wrapperValue
          : model.get()
        : undefined;

      return '${' + placeholderId + '}';
    })
    .join('');
}

function resolveAliases(aliases, fragment, dest) {
  if ( dest === void 0 ) dest = {};

  for (var i = 0; i < aliases.length; i++) {
    if (!dest[aliases[i].n]) {
      var m = resolve(fragment, aliases[i].x);
      dest[aliases[i].n] = m;
      m.reference();
    }
  }

  return dest;
}

var Fragment = function Fragment(options) {
  this.owner = options.owner; // The item that owns this fragment - an element, section, partial, or attribute

  this.isRoot = !options.owner.up;
  this.parent = this.isRoot ? null : this.owner.up;
  this.ractive = options.ractive || (this.isRoot ? options.owner : this.parent.ractive);

  this.componentParent = this.isRoot && this.ractive.component ? this.ractive.component.up : null;
  if (!this.isRoot || this.ractive.delegate) {
    this.delegate = this.owner.containerFragment
      ? this.owner.containerFragment && this.owner.containerFragment.delegate
      : (this.componentParent && this.componentParent.delegate) ||
        (this.parent && this.parent.delegate);
  } else {
    this.delegate = false;
  }

  this.context = null;
  this.rendered = false;

  // encapsulated styles should be inherited until they get applied by an element
  if ('cssIds' in options) {
    this.cssIds = options.cssIds && options.cssIds.length && options.cssIds;
  } else {
    this.cssIds = this.parent ? this.parent.cssIds : null;
  }

  this.dirty = false;
  this.dirtyValue = true; // used for attribute values

  this.template = options.template || [];
  this.createItems();
};
var Fragment__proto__ = Fragment.prototype;

Fragment__proto__.bind = function bind (context) {
    var this$1 = this;

  this.context = context;

  if (this.owner.template.z) {
    this.aliases = resolveAliases(
      this.owner.template.z,
      this.owner.containerFragment || this.parent
    );
  }

  var len = this.items.length;
  for (var i = 0; i < len; i++) { this$1.items[i].bind(); }
  this.bound = true;

  // in rare cases, a forced resolution (or similar) will cause the
  // fragment to be dirty before it's even finished binding. In those
  // cases we update immediately
  if (this.dirty) { this.update(); }

  return this;
};

Fragment__proto__.bubble = function bubble () {
  this.dirtyValue = true;

  if (!this.dirty) {
    this.dirty = true;

    if (this.isRoot) {
      // TODO encapsulate 'is component root, but not overall root' check?
      if (this.ractive.component) {
        this.ractive.component.bubble();
      } else if (this.bound) {
        runloop.addFragment(this);
      }
    } else {
      this.owner.bubble(this.index);
    }
  }
};

Fragment__proto__.createItems = function createItems () {
    var this$1 = this;

  // this is a hot code path
  var max = this.template.length;
  this.items = [];
  for (var i = 0; i < max; i++) {
    this$1.items[i] = createItem({
      up: this$1,
      template: this$1.template[i],
      index: i
    });
  }
};

Fragment__proto__.destroyed = function destroyed () {
    var this$1 = this;

  var len = this.items.length;
  for (var i = 0; i < len; i++) { this$1.items[i].destroyed(); }
  if (this.pathModel) { this.pathModel.destroyed(); }
  if (this.rootModel) { this.rootModel.destroyed(); }
};

Fragment__proto__.detach = function detach () {
  var docFrag = createDocumentFragment();
  var xs = this.items;
  var len = xs.length;
  for (var i = 0; i < len; i++) {
    docFrag.appendChild(xs[i].detach());
  }
  return docFrag;
};

Fragment__proto__.find = function find (selector, options) {
  return findMap(this.items, function (i) { return i.find(selector, options); });
};

Fragment__proto__.findAll = function findAll (selector, options) {
  if (this.items) {
    this.items.forEach(function (i) { return i.findAll && i.findAll(selector, options); });
  }
};

Fragment__proto__.findComponent = function findComponent (name, options) {
  return findMap(this.items, function (i) { return i.findComponent(name, options); });
};

Fragment__proto__.findAllComponents = function findAllComponents (name, options) {
  if (this.items) {
    this.items.forEach(function (i) { return i.findAllComponents && i.findAllComponents(name, options); });
  }
};

Fragment__proto__.findContext = function findContext () {
  var base = findParentWithContext(this);
  if (!base || !base.context) { return this.ractive.viewmodel; }
  else { return base.context; }
};

Fragment__proto__.findNextNode = function findNextNode (item) {
    var this$1 = this;

  // search for the next node going forward
  if (item) {
    var it;
    for (var i = item.index + 1; i < this.items.length; i++) {
      it = this$1.items[i];
      if (!it || !it.firstNode) { continue; }

      var node = it.firstNode(true);
      if (node) { return node; }
    }
  }

  // if this is the root fragment, and there are no more items,
  // it means we're at the end...
  if (this.isRoot) {
    if (this.ractive.component) {
      return this.ractive.component.up.findNextNode(this.ractive.component);
    }

    // TODO possible edge case with other content
    // appended to this.ractive.el?
    return null;
  }

  if (this.parent) { return this.owner.findNextNode(this); } // the argument is in case the parent is a RepeatedFragment
};

Fragment__proto__.findParentNode = function findParentNode () {
  var fragment = this;

  do {
    if (fragment.owner.type === ELEMENT) {
      return fragment.owner.node;
    }

    if (fragment.isRoot && !fragment.ractive.component) {
      // TODO encapsulate check
      return fragment.ractive.el;
    }

    if (fragment.owner.type === YIELDER) {
      fragment = fragment.owner.containerFragment;
    } else {
      fragment = fragment.componentParent || fragment.parent; // TODO ugh
    }
  } while (fragment);

  throw new Error('Could not find parent node'); // TODO link to issue tracker
};

Fragment__proto__.firstNode = function firstNode (skipParent) {
  var node = findMap(this.items, function (i) { return i.firstNode(true); });
  if (node) { return node; }
  if (skipParent) { return null; }

  return this.parent.findNextNode(this.owner);
};

Fragment__proto__.getKey = function getKey () {
  return this.keyModel || (this.keyModel = new KeyModel(this.key));
};

Fragment__proto__.getIndex = function getIndex () {
  return this.idxModel || (this.idxModel = new KeyModel(this.index));
};

Fragment__proto__.rebind = function rebind (next) {
  this.context = next;
  if (this.rootModel) { this.rootModel.context = this.context; }
  if (this.pathModel) { this.pathModel.context = this.context; }
};

Fragment__proto__.rebound = function rebound (update$$1) {
  if (this.owner.template.z) {
    var aliases = this.aliases;
    for (var k in aliases) {
      if (aliases[k].rebound) { aliases[k].rebound(update$$1); }
      else {
        aliases[k].unreference();
        aliases[k] = 0;
      }
    }

    resolveAliases(this.owner.template.z, this.owner.containerFragment || this.parent, aliases);
  }

  this.items.forEach(function (x) { return x.rebound(update$$1); });
  if (update$$1) {
    if (this.rootModel) { this.rootModel.applyValue(this.context.getKeypath(this.ractive.root)); }
    if (this.pathModel) { this.pathModel.applyValue(this.context.getKeypath()); }
  }
};

Fragment__proto__.render = function render (target, occupants) {
  if (this.rendered) { throw new Error('Fragment is already rendered!'); }
  this.rendered = true;

  var xs = this.items;
  var len = xs.length;
  for (var i = 0; i < len; i++) {
    xs[i].render(target, occupants);
  }
};

Fragment__proto__.resetTemplate = function resetTemplate (template) {
  var wasBound = this.bound;
  var wasRendered = this.rendered;

  // TODO ensure transitions are disabled globally during reset

  if (wasBound) {
    if (wasRendered) { this.unrender(true); }
    this.unbind();
  }

  this.template = template;
  this.createItems();

  if (wasBound) {
    this.bind(this.context);

    if (wasRendered) {
      var parentNode = this.findParentNode();
      var anchor = this.findNextNode();

      if (anchor) {
        var docFrag = createDocumentFragment();
        this.render(docFrag);
        parentNode.insertBefore(docFrag, anchor);
      } else {
        this.render(parentNode);
      }
    }
  }
};

Fragment__proto__.shuffled = function shuffled$2 () {
  this.items.forEach(shuffled);
  if (this.rootModel) { this.rootModel.applyValue(this.context.getKeypath(this.ractive.root)); }
  if (this.pathModel) { this.pathModel.applyValue(this.context.getKeypath()); }
};

Fragment__proto__.toString = function toString (escape) {
  return this.items.map(escape ? toEscapedString : toString$1).join('');
};

Fragment__proto__.unbind = function unbind (view) {
    var this$1 = this;

  if (this.owner.template.z && !this.owner.yielder) {
    for (var k in this$1.aliases) {
      this$1.aliases[k].unreference();
    }

    this.aliases = {};
  }

  this.context = null;
  var len = this.items.length;
  for (var i = 0; i < len; i++) { this$1.items[i].unbind(view); }
  this.bound = false;

  return this;
};

Fragment__proto__.unrender = function unrender (shouldDestroy) {
    var this$1 = this;

  var len = this.items.length;
  for (var i = 0; i < len; i++) { this$1.items[i].unrender(shouldDestroy); }
  this.rendered = false;
};

Fragment__proto__.update = function update () {
    var this$1 = this;

  if (this.dirty) {
    if (!this.updating) {
      this.dirty = false;
      this.updating = true;
      var len = this.items.length;
      for (var i = 0; i < len; i++) { this$1.items[i].update(); }
      this.updating = false;
    } else if (this.isRoot) {
      runloop.addFragmentToRoot(this);
    }
  }
};

Fragment__proto__.valueOf = function valueOf () {
  if (this.items.length === 1) {
    return this.items[0].valueOf();
  }

  if (this.dirtyValue) {
    var values = {};
    var source = processItems(this.items, values, this.ractive._guid);
    var parsed = parseJSON(source, values);

    this.value = parsed ? parsed.value : this.toString();

    this.dirtyValue = false;
  }

  return this.value;
};
Fragment.prototype.getContext = getContext;
Fragment.prototype.getKeypath = getKeypath;

function getKeypath(root) {
  var base = findParentWithContext(this);
  var model;
  if (root) {
    if (!this.rootModel) {
      this.rootModel = new KeyModel(
        this.context.getKeypath(this.ractive.root),
        this.context,
        this.ractive.root
      );
      model = this.rootModel;
    } else { return this.rootModel; }
  } else {
    if (!this.pathModel) {
      this.pathModel = new KeyModel(this.context.getKeypath(), this.context);
      model = this.pathModel;
    } else { return this.pathModel; }
  }

  if (base && base.context) { base.getKeypath(root).registerChild(model); }

  return model;
}

function initialise(ractive, userOptions, options) {
  // initialize settable computeds
  var computed = ractive.viewmodel.computed;
  if (computed) {
    for (var k in computed) {
      if (k in ractive.viewmodel.value && computed[k] && !computed[k].isReadonly) {
        computed[k].set(ractive.viewmodel.value[k]);
      }
    }
  }

  // init config from Parent and options
  config.init(ractive.constructor, ractive, userOptions);

  // call any passed in plugins
  if (isArray(userOptions.use))
    { ractive.use.apply(ractive, userOptions.use.filter(function (p) { return !p.construct; })); }

  hooks.config.fire(ractive);

  hooks.init.begin(ractive);

  var fragment = (ractive.fragment = createFragment$1(ractive, options));
  if (fragment) { fragment.bind(ractive.viewmodel); }

  hooks.init.end(ractive);

  // general config done, set up observers
  subscribe(ractive, userOptions, 'observe');

  if (fragment) {
    // render automatically ( if `el` is specified )
    var el = (ractive.el = ractive.target = getElement(ractive.el || ractive.target));
    if (el && !ractive.component) {
      var promise = ractive.render(el, ractive.append);

      if (Ractive.DEBUG_PROMISES) {
        promise.catch(function (err) {
          warnOnceIfDebug(
            'Promise debugging is enabled, to help solve errors that happen asynchronously. Some browsers will log unhandled promise rejections, in which case you can safely disable promise debugging:\n  Ractive.DEBUG_PROMISES = false;'
          );
          warnIfDebug('An error happened during rendering', { ractive: ractive });
          logIfDebug(err);

          throw err;
        });
      }
    }
  }
}

function createFragment$1(ractive, options) {
  if ( options === void 0 ) options = {};

  if (ractive.template) {
    var cssIds = [].concat(ractive.constructor._cssIds || [], options.cssIds || []);

    return new Fragment({
      owner: ractive,
      template: ractive.template,
      cssIds: cssIds
    });
  }
}

function render$1(ractive, target, anchor, occupants) {
  // set a flag to let any transitions know that this instance is currently rendering
  ractive.rendering = true;

  var promise = runloop.start();
  runloop.scheduleTask(function () { return hooks.render.fire(ractive); }, true);

  if (ractive.fragment.rendered) {
    throw new Error(
      'You cannot call ractive.render() on an already rendered instance! Call ractive.unrender() first'
    );
  }

  if (ractive.destroyed) {
    ractive.destroyed = false;
    ractive.fragment = createFragment$1(ractive).bind(ractive.viewmodel);
  }

  anchor = getElement(anchor) || ractive.anchor;

  ractive.el = ractive.target = target;
  ractive.anchor = anchor;

  // ensure encapsulated CSS is up-to-date
  if (ractive.cssId) { applyCSS(); }

  if (target) {
    (target.__ractive_instances__ || (target.__ractive_instances__ = [])).push(ractive);

    if (anchor) {
      var docFrag = doc.createDocumentFragment();
      ractive.fragment.render(docFrag);
      target.insertBefore(docFrag, anchor);
    } else {
      ractive.fragment.render(target, occupants);
    }
  }

  runloop.end();
  ractive.rendering = false;

  return promise.then(function () {
    if (ractive.torndown) { return; }

    hooks.complete.fire(ractive);
  });
}

function Ractive$render(target, anchor) {
  if (this.torndown) {
    warnIfDebug('ractive.render() was called on a Ractive instance that was already torn down');
    return Promise.resolve();
  }

  target = getElement(target) || this.el;

  if (!this.append && target) {
    // Teardown any existing instances *before* trying to set up the new one -
    // avoids certain weird bugs
    var others = target.__ractive_instances__;
    if (others) { others.forEach(teardown); }

    // make sure we are the only occupants
    if (!this.enhance) {
      target.innerHTML = ''; // TODO is this quicker than removeChild? Initial research inconclusive
    }
  }

  var occupants = this.enhance ? toArray(target.childNodes) : null;
  var promise = render$1(this, target, anchor, occupants);

  if (occupants) {
    while (occupants.length) { target.removeChild(occupants.pop()); }
  }

  return promise;
}

var shouldRerender = ['template', 'partials', 'components', 'decorators', 'events'];

function Ractive$reset(data) {
  data = data || {};

  if (!isObjectType(data)) {
    throw new Error('The reset method takes either no arguments, or an object containing new data');
  }

  // TEMP need to tidy this up
  data = dataConfigurator.init(this.constructor, this, { data: data });

  var promise = runloop.start();

  // If the root object is wrapped, try and use the wrapper's reset value
  var wrapper = this.viewmodel.wrapper;
  if (wrapper && wrapper.reset) {
    if (wrapper.reset(data) === false) {
      // reset was rejected, we need to replace the object
      this.viewmodel.set(data);
    }
  } else {
    this.viewmodel.set(data);
  }

  // reset config items and track if need to rerender
  var changes = config.reset(this);
  var rerender;

  var i = changes.length;
  while (i--) {
    if (shouldRerender.indexOf(changes[i]) > -1) {
      rerender = true;
      break;
    }
  }

  if (rerender) {
    hooks.unrender.fire(this);
    this.fragment.resetTemplate(this.template);
    hooks.render.fire(this);
    hooks.complete.fire(this);
  }

  runloop.end();

  hooks.reset.fire(this, data);

  return promise;
}

function collect$1(source, name, attr, dest) {
  source.forEach(function (item) {
    // queue to rerender if the item is a partial and the current name matches
    if (item.type === PARTIAL && (item.refName === name || item.name === name)) {
      item.inAttribute = attr;
      dest.push(item);
      return; // go no further
    }

    // if it has a fragment, process its items
    if (item.fragment) {
      collect$1(item.fragment.iterations || item.fragment.items, name, attr, dest);
    } else if (isArray(item.items)) {
      // or if it is itself a fragment, process its items
      collect$1(item.items, name, attr, dest);
    } else if (item.type === COMPONENT && item.instance) {
      // or if it is a component, step in and process its items
      // ...unless the partial is shadowed
      if (item.instance.partials[name]) { return; }
      collect$1(item.instance.fragment.items, name, attr, dest);
    }

    // if the item is an element, process its attributes too
    if (item.type === ELEMENT) {
      if (isArray(item.attributes)) {
        collect$1(item.attributes, name, true, dest);
      }
    }
  });
}

function resetPartial(name, partial) {
  var collection = [];
  collect$1(this.fragment.items, name, false, collection);

  var promise = runloop.start();

  this.partials[name] = partial;
  collection.forEach(handleChange);

  runloop.end();

  return promise;
}

// TODO should resetTemplate be asynchronous? i.e. should it be a case
// of outro, update template, intro? I reckon probably not, since that
// could be achieved with unrender-resetTemplate-render. Also, it should
// conceptually be similar to resetPartial, which couldn't be async

function Ractive$resetTemplate(template) {
  templateConfigurator.init(null, this, { template: template });

  var transitionsEnabled = this.transitionsEnabled;
  this.transitionsEnabled = false;

  // Is this is a component, we need to set the `shouldDestroy`
  // flag, otherwise it will assume by default that a parent node
  // will be detached, and therefore it doesn't need to bother
  // detaching its own nodes
  var component = this.component;
  if (component) { component.shouldDestroy = true; }
  this.unrender();
  if (component) { component.shouldDestroy = false; }

  var promise = runloop.start();

  // remove existing fragment and create new one
  this.fragment.unbind().unrender(true);

  this.fragment = new Fragment({
    template: this.template,
    root: this,
    owner: this
  });

  var docFrag = createDocumentFragment();
  this.fragment.bind(this.viewmodel).render(docFrag);

  // if this is a component, its el may not be valid, so find a
  // target based on the component container
  if (component && !component.external) {
    this.fragment.findParentNode().insertBefore(docFrag, component.findNextNode());
  } else {
    this.el.insertBefore(docFrag, this.anchor);
  }

  runloop.end();

  this.transitionsEnabled = transitionsEnabled;

  return promise;
}

var reverse = makeArrayMethod('reverse').path;

function Ractive$set(keypath, value, options) {
  var ractive = this;

  var opts = isObjectType(keypath) ? value : options;

  return set(build(ractive, keypath, value, opts && opts.isolated), opts);
}

var shift = makeArrayMethod('shift').path;

var sort = makeArrayMethod('sort').path;

var splice = makeArrayMethod('splice').path;

function Ractive$subtract(keypath, d, options) {
  var num = isNumber(d) ? -d : -1;
  var opts = isObjectType(d) ? d : options;
  return add(this, keypath, num, opts);
}

function Ractive$toggle(keypath, options) {
  if (!isString(keypath)) {
    throw new TypeError(badArguments);
  }

  return set(
    gather(this, keypath, null, options && options.isolated).map(function (m) { return [m, !m.get()]; }),
    options
  );
}

function Ractive$toCSS() {
  var cssIds = [this.cssId ].concat( this.findAllComponents().map(function (c) { return c.cssId; }));
  var uniqueCssIds = keys(cssIds.reduce(function (ids, id) { return (ids[id] = true, ids); }, {}));
  return getCSS(uniqueCssIds);
}

function Ractive$toHTML() {
  return this.fragment.toString(true);
}

function toText() {
  return this.fragment.toString(false);
}

function Ractive$transition(name, node, params) {
  if (node instanceof HTMLElement) {
    // good to go
  } else if (isObject(node)) {
    // omitted, use event node
    params = node;
  }

  // if we allow query selector, then it won't work
  // simple params like "fast"

  // else if ( typeof node === 'string' ) {
  // 	// query selector
  // 	node = this.find( node )
  // }

  node = node || this.event.node;

  if (!node || !node._ractive) {
    fatal(("No node was supplied for transition " + name));
  }

  params = params || {};
  var owner = node._ractive.proxy;
  var transition = new Transition({ owner: owner, up: owner.up, name: name, params: params });
  transition.bind();

  var promise = runloop.start();
  runloop.registerTransition(transition);
  runloop.end();

  promise.then(function () { return transition.unbind(); });
  return promise;
}

function unlink(here) {
  var promise = runloop.start();
  this.viewmodel.joinAll(splitKeypath(here), { lastLink: false }).unlink();
  runloop.end();
  return promise;
}

function Ractive$unrender() {
  if (!this.fragment.rendered) {
    warnIfDebug('ractive.unrender() was called on a Ractive instance that was not rendered');
    return Promise.resolve();
  }

  this.unrendering = true;
  var promise = runloop.start();

  hooks.unrendering.fire(this);

  // If this is a component, and the component isn't marked for destruction,
  // don't detach nodes from the DOM unnecessarily
  var shouldDestroy =
    !this.component ||
    (this.component.anchor || {}).shouldDestroy ||
    this.component.shouldDestroy ||
    this.shouldDestroy;
  this.fragment.unrender(shouldDestroy);
  if (shouldDestroy) { this.destroyed = true; }

  removeFromArray(this.el.__ractive_instances__, this);

  hooks.unrender.fire(this);

  runloop.end();
  this.unrendering = false;

  return promise;
}

var unshift = makeArrayMethod('unshift').path;

function Ractive$updateModel(keypath, cascade) {
  var promise = runloop.start();

  if (!keypath) {
    this.viewmodel.updateFromBindings(true);
  } else {
    this.viewmodel.joinAll(splitKeypath(keypath)).updateFromBindings(cascade !== false);
  }

  runloop.end();

  return promise;
}

function use() {
  var this$1 = this;
  var plugins = [], len = arguments.length;
  while ( len-- ) plugins[ len ] = arguments[ len ];

  plugins.forEach(function (p) {
    p({
      proto: this$1,
      Ractive: this$1.constructor.Ractive,
      instance: this$1
    });
  });
  return this;
}

var proto$9 = {
  add: Ractive$add,
  animate: Ractive$animate,
  attachChild: attachChild,
  compute: Ractive$compute,
  detach: Ractive$detach,
  detachChild: detachChild,
  find: Ractive$find,
  findAll: Ractive$findAll,
  findAllComponents: Ractive$findAllComponents,
  findComponent: Ractive$findComponent,
  findContainer: Ractive$findContainer,
  findParent: Ractive$findParent,
  fire: Ractive$fire,
  get: Ractive$get,
  getContext: getContext$2,
  insert: Ractive$insert,
  link: link,
  observe: observe,
  observeOnce: observeOnce,
  off: Ractive$off,
  on: Ractive$on,
  once: Ractive$once,
  pop: pop,
  push: push,
  readLink: readLink,
  render: Ractive$render,
  reset: Ractive$reset,
  resetPartial: resetPartial,
  resetTemplate: Ractive$resetTemplate,
  reverse: reverse,
  set: Ractive$set,
  shift: shift,
  sort: sort,
  splice: splice,
  subtract: Ractive$subtract,
  teardown: Ractive$teardown,
  toggle: Ractive$toggle,
  toCSS: Ractive$toCSS,
  toCss: Ractive$toCSS,
  toHTML: Ractive$toHTML,
  toHtml: Ractive$toHTML,
  toText: toText,
  transition: Ractive$transition,
  unlink: unlink,
  unrender: Ractive$unrender,
  unshift: unshift,
  update: Ractive$update,
  updateModel: Ractive$updateModel,
  use: use
};

function isInstance(object) {
  return object && object instanceof this;
}

function styleGet(keypath, opts) {
  return this._cssModel.joinAll(splitKeypath(keypath)).get(true, opts);
}

var styles = [];

function addStyle(id, css) {
  if (styles.find(function (s) { return s.id === id; }))
    { throw new Error(("Extra styles with the id '" + id + "' have already been added.")); }
  styles.push({ id: id, css: css });

  if (!this.css) {
    Object.defineProperty(this, 'css', { configurable: false, writable: false, value: buildCSS });
  }

  if (!this._cssDef) {
    Object.defineProperty(this, '_cssDef', {
      configurable: true,
      writable: false,
      value: {
        transform: false,
        id: 'Ractive.addStyle'
      }
    });

    addCSS(this._cssDef);
  }

  recomputeCSS(this);
  applyCSS(true);
}

function buildCSS(data) {
  return styles
    .map(function (s) { return "\n/* ---- extra style " + (s.id) + " */\n" + (isFunction(s.css) ? s.css(data) : s.css); })
    .join('');
}

function hasStyle(id) {
  return !!styles.find(function (s) { return s.id === id; });
}

function sharedSet(keypath, value, options) {
  var opts = isObjectType(keypath) ? value : options;
  var model = SharedModel$1;

  return set(build({ viewmodel: model }, keypath, value, true), opts);
}

function sharedGet(keypath, opts) {
  return SharedModel$1.joinAll(splitKeypath(keypath)).get(true, opts);
}

function use$1() {
  var this$1 = this;
  var plugins = [], len = arguments.length;
  while ( len-- ) plugins[ len ] = arguments[ len ];

  plugins.forEach(function (p) {
    isFunction(p) &&
      p({
        proto: this$1.prototype,
        Ractive: this$1.Ractive,
        instance: this$1
      });
  });
  return this;
}

var callsSuper = /super\s*\(|\.call\s*\(\s*this/;

function extend() {
  var options = [], len = arguments.length;
  while ( len-- ) options[ len ] = arguments[ len ];

  if (!options.length) {
    return extendOne(this);
  } else {
    return options.reduce(extendOne, this);
  }
}

function extendWith(Class, options) {
  if ( options === void 0 ) options = {};

  return extendOne(this, options, Class);
}

function extendOne(Parent, options, Target) {
  if ( options === void 0 ) options = {};

  var proto;
  var Child = isFunction(Target) && Target;

  if (options.prototype instanceof Ractive) {
    throw new Error("Ractive no longer supports multiple inheritance.");
  }

  if (Child) {
    if (!(Child.prototype instanceof Parent)) {
      throw new Error(
        "Only classes that inherit the appropriate prototype may be used with extend"
      );
    }
    if (!callsSuper.test(Child.toString())) {
      throw new Error("Only classes that call super in their constructor may be used with extend");
    }

    proto = Child.prototype;
  } else {
    Child = function(options) {
      if (!(this instanceof Child)) { return new Child(options); }

      construct(this, options || {});
      initialise(this, options || {}, {});
    };

    proto = create(Parent.prototype);
    proto.constructor = Child;

    Child.prototype = proto;
  }

  // Static properties
  defineProperties(Child, {
    // alias prototype as defaults
    defaults: { value: proto },

    extend: { value: extend, writable: true, configurable: true },
    extendWith: { value: extendWith, writable: true, configurable: true },
    extensions: { value: [] },
    use: { value: use$1 },

    isInstance: { value: isInstance },

    Parent: { value: Parent },
    Ractive: { value: Ractive },

    styleGet: { value: styleGet.bind(Child), configurable: true },
    styleSet: { value: setCSSData.bind(Child), configurable: true }
  });

  // extend configuration
  config.extend(Parent, proto, options, Child);

  // store event and observer registries on the constructor when extending
  Child._on = (Parent._on || []).concat(toPairs(options.on));
  Child._observe = (Parent._observe || []).concat(toPairs(options.observe));

  Parent.extensions.push(Child);

  // attribute defs are not inherited, but they need to be stored
  if (options.attributes) {
    var attrs;

    // allow an array of optional props or an object with arrays for optional and required props
    if (isArray(options.attributes)) {
      attrs = { optional: options.attributes, required: [] };
    } else {
      attrs = options.attributes;
    }

    // make sure the requisite keys actually store arrays
    if (!isArray(attrs.required)) { attrs.required = []; }
    if (!isArray(attrs.optional)) { attrs.optional = []; }

    Child.attributes = attrs;
  }

  dataConfigurator.extend(Parent, proto, options, Child);

  defineProperty(Child, 'helpers', { writable: true, value: proto.helpers });

  if (isArray(options.use)) { Child.use.apply(Child, options.use); }

  return Child;
}

defineProperties(Ractive, {
  sharedGet: { value: sharedGet },
  sharedSet: { value: sharedSet },
  styleGet: { configurable: true, value: styleGet.bind(Ractive) },
  styleSet: { configurable: true, value: setCSSData.bind(Ractive) },
  addCSS: { configurable: false, value: addStyle.bind(Ractive) },
  hasCSS: { configurable: false, value: hasStyle.bind(Ractive) }
});

function macro(fn, opts) {
  if (!isFunction(fn)) { throw new Error("The macro must be a function"); }

  assign(fn, opts);

  defineProperties(fn, {
    extensions: { value: [] },
    _cssIds: { value: [] },
    cssData: { value: assign(create(this.cssData), fn.cssData || {}) },

    styleGet: { value: styleGet.bind(fn) },
    styleSet: { value: setCSSData.bind(fn) }
  });

  defineProperty(fn, '_cssModel', { value: new CSSModel(fn) });

  if (fn.css) { initCSS(fn, fn, fn); }

  this.extensions.push(fn);

  return fn;
}

function joinKeys() {
  var keys = [], len = arguments.length;
  while ( len-- ) keys[ len ] = arguments[ len ];

  return keys.map(escapeKey).join('.');
}

function splitKeypath$1(keypath) {
  return splitKeypath(keypath).map(unescapeKey);
}

function findPlugin(name, type, instance) {
  return findInViewHierarchy(type, instance, name);
}

function Ractive(options) {
  if (!(this instanceof Ractive)) { return new Ractive(options); }

  construct(this, options || {});
  initialise(this, options || {}, {});
}

// check to see if we're being asked to force Ractive as a global for some weird environments
if (win && !win.Ractive) {
  var opts$1 = '';
  var script =
    document.currentScript ||
    /* istanbul ignore next */ document.querySelector('script[data-ractive-options]');

  if (script) { opts$1 = script.getAttribute('data-ractive-options') || ''; }

  /* istanbul ignore next */
  if (~opts$1.indexOf('ForceGlobal')) { win.Ractive = Ractive; }
} else if (win) {
  warn("Ractive already appears to be loaded while loading 1.3.8.");
}

assign(Ractive.prototype, proto$9, defaults);
Ractive.prototype.constructor = Ractive;

// alias prototype as `defaults`
Ractive.defaults = Ractive.prototype;

// share defaults with the parser
shared.defaults = Ractive.defaults;
shared.Ractive = Ractive;

// static properties
defineProperties(Ractive, {
  // debug flag
  DEBUG: { writable: true, value: true },
  DEBUG_PROMISES: { writable: true, value: true },

  // static methods:
  extend: { value: extend },
  extendWith: { value: extendWith },
  escapeKey: { value: escapeKey },
  evalObjectString: { value: parseJSON },
  findPlugin: { value: findPlugin },
  getContext: { value: getContext$1 },
  getCSS: { value: getCSS },
  isInstance: { value: isInstance },
  joinKeys: { value: joinKeys },
  macro: { value: macro },
  normaliseKeypath: { value: normalise },
  parse: { value: parse },
  splitKeypath: { value: splitKeypath$1 },
  // sharedSet and styleSet are in _extend because circular refs
  unescapeKey: { value: unescapeKey },
  use: { value: use$1 },

  // support
  enhance: { writable: true, value: false },
  svg: { value: svg },
  tick: {
    get: function get() {
      return batch && batch.promise;
    }
  },

  // version
  VERSION: { value: '1.3.8' },

  // plugins
  adaptors: { writable: true, value: {} },
  components: { writable: true, value: {} },
  decorators: { writable: true, value: {} },
  easing: { writable: true, value: easing },
  events: { writable: true, value: {} },
  extensions: { value: [] },
  helpers: { writable: true, value: defaults.helpers },
  interpolators: { writable: true, value: interpolators },
  partials: { writable: true, value: {} },
  transitions: { writable: true, value: {} },

  // CSS variables
  cssData: { configurable: true, value: {} },

  // access to @shared without an instance
  sharedData: { value: data },

  // for getting the source Ractive lib from a constructor
  Ractive: { value: Ractive },

  // to allow extending contexts
  Context: { value: extern.Context.prototype }
});

// cssData must already be in place
defineProperty(Ractive, '_cssModel', {
  configurable: true,
  value: new CSSModel(Ractive)
});

defineProperty(Ractive.prototype, 'rendered', {
  get: function get() {
    return this.fragment && this.fragment.rendered;
  }
});

/* harmony default export */ __webpack_exports__["default"] = (Ractive);
//# sourceMappingURL=/home/travis/build/ractivejs/ractive/.gobble-build/10-transpile/.cache/ractive.mjs.map


/***/ }),

/***/ "./node_modules/underscore/underscore.js":
/*!***********************************************!*\
  !*** ./node_modules/underscore/underscore.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if ( true && !exports.nodeType) {
    if ( true && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if ( true && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}());

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })

}]);
//# sourceMappingURL=vendor.js.map