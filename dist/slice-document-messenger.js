/*!
  * Slice document messenger.1.0.0 (https://github.com/shininglab-code/slice-document-messenger)
  * Copyright 2020 shininglab (https://github.com/shininglab-code)
  * Licensed under MIT
  */

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.sliceDocumentMessenger = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var SliceMessage = /*#__PURE__*/function () {
    function SliceMessage(name, data) {
      this.name = name || null;
      this.data = data || {};
    }

    SliceMessage.create = function create(name, data) {
      return new SliceMessage(name, data);
    };

    SliceMessage.fromJSON = function fromJSON(str) {
      var name = null;
      var data = {};

      try {
        var parsed = JSON.parse(str);

        if (typeof parsed === 'object') {
          if (parsed.hasOwnProperty('name')) {
            name = parsed.name;
          }

          if (parsed.hasOwnProperty('data') && typeof parsed.data === 'object') {
            data = parsed.data;
          }
        }
      } catch (e) {
        name = 'MessageParseError';
        data = {
          error: e,
          raw: str
        };
      }

      return new SliceMessage(name, data);
    };

    var _proto = SliceMessage.prototype;

    _proto.toString = function toString() {
      return JSON.stringify({
        name: this.name,
        data: this.data
      });
    };

    return SliceMessage;
  }();

  var SliceMessageTransport = /*#__PURE__*/function () {
    function SliceMessageTransport() {
      this.receivers = {};
    }

    SliceMessageTransport.getAddress = function getAddress(address) {
      return "transport-" + address;
    };

    SliceMessageTransport.isAvailable = function isAvailable() {
      return true;
    };

    var _proto2 = SliceMessageTransport.prototype;

    _proto2.isAvailable = function isAvailable() {
      return this.constructor.isAvailable();
    };

    _proto2.addReceiver = function addReceiver(address, receiver) {
      var transportAddress = this.constructor.getAddress(address);

      if (!this.receivers.hasOwnProperty(transportAddress)) {
        this.receivers[transportAddress] = [];
      }

      this.receivers[transportAddress].push(receiver);
      return this;
    };

    _proto2.removeReceiver = function removeReceiver(address, receiver) {
      var transportAddress = this.constructor.getAddress(address);

      if (this.receivers.hasOwnProperty(transportAddress)) {
        var index = this.receivers[transportAddress].indexOf(receiver);

        if (index > -1) {
          this.receivers[transportAddress].splice(index, 1);
        }
      }

      return this;
    };

    _proto2.hasAddress = function hasAddress(address, isTransport) {
      var transportAddress = isTransport ? address : this.constructor.getAddress(address);
      return this.receivers.hasOwnProperty(transportAddress) && this.receivers[transportAddress].length;
    };

    _proto2.receive = function receive(address, message, isTransport) {
      var transportAddress = isTransport ? address : this.constructor.getAddress(address);

      if (this.receivers.hasOwnProperty(transportAddress)) {
        this.receivers[transportAddress].map(function (receiver) {
          receiver(message);
        });
      }

      return this;
    };

    _proto2.send = function send(address, message) {
      if (window.console) {
        console.log(this.constructor.getAddress(address) + ": " + message.toString());
      }

      return this;
    };

    _proto2.remove = function remove() {
      this.receivers = {};
    };

    return SliceMessageTransport;
  }();

  var SliceLocalStorageTransport = /*#__PURE__*/function (_SliceMessageTranspor) {
    _inheritsLoose(SliceLocalStorageTransport, _SliceMessageTranspor);

    function SliceLocalStorageTransport() {
      var _this;

      _this = _SliceMessageTranspor.call(this) || this;
      _this.handle = _this.handle.bind(_assertThisInitialized(_this));
      window.addEventListener('storage', _this.handle);
      return _this;
    }

    var _proto3 = SliceLocalStorageTransport.prototype;

    _proto3.handle = function handle(e) {
      if (!this.hasAddress(e.key, true) || e.newValue === null) {
        return null;
      }

      var message = SliceMessage.fromJSON(e.newValue);
      return this.receive(e.key, message, true);
    };

    _proto3.send = function send(address, message) {
      var transportAddress = this.constructor.getAddress(address);
      localStorage.setItem(transportAddress, message.toString());
      localStorage.removeItem(transportAddress);
      return this;
    };

    _proto3.remove = function remove() {
      window.removeEventListener('storage', this.handle);

      _SliceMessageTranspor.prototype.remove.call(this);
    };

    return SliceLocalStorageTransport;
  }(SliceMessageTransport);

  var SliceMessageBox = /*#__PURE__*/function () {
    function SliceMessageBox(owner, settings, messenger, subscribe) {
      if (owner === void 0) {
        owner = {};
      }

      if (settings === void 0) {
        settings = {};
      }

      this.settings = settings;
      this.owner = owner;

      if (messenger) {
        this.setMessenger(messenger, subscribe);
      }
    }

    var _proto4 = SliceMessageBox.prototype;

    _proto4.setMessenger = function setMessenger(messenger, subscribe, unsubscribe) {
      if (this.messenger && unsubscribe) {
        this.messenger.removeBox(this);
      }

      if (messenger instanceof SliceMessenger) {
        this.messenger = messenger;

        if (subscribe) {
          this.messenger.addBox(this);
        }
      }

      return this;
    };

    _proto4.receive = function receive(message) {
      if (message.name) {
        var settings = this.settings;
        var handler = null;
        var handlerSettings = settings.handlers && settings.handlers.hasOwnProperty(message.name) ? settings.handlers[message.name] : settings.defaultHandler || null;

        if (handlerSettings) {
          if (typeof handlerSettings === 'string') {
            handlerSettings = {
              self: false,
              handler: handlerSettings
            };
          }

          if (handlerSettings.self) {
            if (this[handlerSettings.handler]) {
              handler = this[handlerSettings.handler];
              this[handlerSettings.handler](message);
            }
          } else if (this.owner[handlerSettings.handler]) {
            handler = this.owner[handlerSettings.handler];
          }
        }

        if (handler) {
          handler(message);
        } else if (handlerSettings) {
          throw new Error("Can't handle message " + message.name + ".");
        }
      }

      return this;
    };

    _proto4.send = function send(name, data, timeout) {
      if (this.messenger) {
        this.messenger.send(name, data, timeout);
      } else {
        throw new Error("Can't send message: no messenger provided.");
      }

      return this;
    };

    _proto4.sendSelf = function sendSelf(name, data, timeout) {
      if (this.messenger) {
        this.messenger.sendSelf(name, data, timeout);
      } else {
        throw new Error("Can't send message: no messenger provided.");
      }

      return this;
    };

    _proto4.sendCurrent = function sendCurrent(name, data, timeout) {
      if (this.messenger) {
        this.messenger.sendCurrent(name, data, timeout);
      } else {
        throw new Error("Can't send message: no messenger provided.");
      }

      return this;
    };

    _proto4.sendEveryone = function sendEveryone(name, data, timeout) {
      if (this.messenger) {
        this.messenger.sendEveryone(name, data, timeout);
      } else {
        throw new Error("Can't send message: no messenger provided.");
      }

      return this;
    };

    return SliceMessageBox;
  }();

  var SliceMessenger = /*#__PURE__*/function () {
    function SliceMessenger(id, transport) {
      if (!id) {
        throw new Error('Can\'t create messenger without id.');
      }

      if (!(transport instanceof SliceMessageTransport)) {
        throw new TypeError('Messenger transport should be instance of SliceMessageTransport.');
      }

      this.timeouts = {
        out: {},
        current: {},
        self: {}
      };
      this.id = id;
      this.receivers = {};
      this.boxes = [];
      this.receive = this.receive.bind(this);
      this.transport = transport;
      transport.addReceiver(this.id, this.receive);
    }

    var _proto5 = SliceMessenger.prototype;

    _proto5.receive = function receive(message) {
      if (this.boxes.length) {
        this.boxes.map(function (box) {
          box.receive(message);
        });
      }

      if (message.name && this.receivers.hasOwnProperty(message.name)) {
        var receivers = this.receivers[message.name];
        receivers.map(function (receiver) {
          receiver(message);
        });
      }

      return this;
    };

    _proto5.send = function send(name, data, timeout) {
      var _this2 = this;

      var timeouts = this.timeouts.out;

      if (timeouts.hasOwnProperty(name) && timeouts[name]) {
        clearTimeout(timeouts[name]);
        delete timeouts[name];
      }

      if (timeout) {
        timeouts[name] = setTimeout(function () {
          delete timeouts[name];

          _this2.send(name, data);
        }, timeout === true ? 0 : timeout);
      } else {
        var message = SliceMessage.create(name, data);
        this.transport.send(this.id, message);
      }

      return this;
    };

    _proto5.sendSelf = function sendSelf(name, data, timeout) {
      var _this3 = this;

      var timeouts = this.timeouts.self;

      if (timeouts.hasOwnProperty(name) && timeouts[name]) {
        clearTimeout(timeouts[name]);
        delete timeouts[name];
      }

      if (timeout) {
        timeouts[name] = setTimeout(function () {
          delete timeouts[name];

          _this3.sendSelf(name, data);
        }, timeout === true ? 0 : timeout);
      } else {
        var message = SliceMessage.create(name, data);
        this.receive(message);
      }

      return this;
    };

    _proto5.sendCurrent = function sendCurrent(name, data, timeout) {
      var _this4 = this;

      var timeouts = this.timeouts.current;

      if (timeouts.hasOwnProperty(name) && timeouts[name]) {
        clearTimeout(timeouts[name]);
        delete timeouts[name];
      }

      if (timeout) {
        timeouts[name] = setTimeout(function () {
          delete timeouts[name];

          _this4.sendCurrent(name, data);
        }, timeout === true ? 0 : timeout);
      } else {
        var message = SliceMessage.create(name, data);
        this.transport.receive(this.id, message);
      }

      return this;
    };

    _proto5.sendEveryone = function sendEveryone(name, data, timeout) {
      this.sendCurrent(name, data, timeout);
      this.send(name, data, timeout);
      return this;
    };

    _proto5.addBox = function addBox(box) {
      if (box instanceof SliceMessageBox) {
        this.boxes.push(box);
      }

      return this;
    };

    _proto5.removeBox = function removeBox(box) {
      var index = this.boxes.indexOf(box);

      if (index > -1) {
        this.boxes.splice(index, 1);
      }

      return this;
    };

    _proto5.addReceiver = function addReceiver(name, receiver) {
      if (!this.receivers.hasOwnProperty(name)) {
        this.receivers[name] = [];
      }

      this.receivers[name].push(receiver);
      return this;
    };

    _proto5.removeReceiver = function removeReceiver(name, receiver) {
      if (this.receivers.hasOwnProperty(name)) {
        var index = this.receivers[name].indexOf(receiver);

        if (index > -1) {
          this.receivers[name].splice(index, 1);
        }
      }

      return this;
    };

    _proto5.remove = function remove() {
      for (var name in this.timeouts) {
        if (this.timeouts.hasOwnProperty(name)) {
          var timeouts = this.timeouts[name];

          for (var timeout in timeouts) {
            if (timeouts.hasOwnProperty(timeout)) {
              clearTimeout(timeouts[timeout]);
              delete timeouts[timeout];
            }
          }
        }
      }

      this.transport.removeReceiver(this.id, this.receive);
    };

    return SliceMessenger;
  }();

  var SliceMessengerFactory = /*#__PURE__*/function () {
    function SliceMessengerFactory() {}

    SliceMessengerFactory.addTransport = function addTransport(transport) {
      if (transport instanceof SliceMessageTransport) {
        if (SliceMessengerFactory.transports.indexOf(transport) < 0) {
          SliceMessengerFactory.transports.push(transport);
        }
      }
    };

    SliceMessengerFactory.getIdFromURL = function getIdFromURL(searchURL) {
      var id = null;
      var prop = 'messengerId';
      var queryStart = searchURL.indexOf("?") + 1;
      var queryEnd = searchURL.indexOf("#") + 1 || searchURL.length + 1;
      var query = searchURL.slice(queryStart, queryEnd - 1);

      if (URLSearchParams) {
        var params = new URLSearchParams("?" + query);

        if (params.has(prop)) {
          id = params.get(prop);
        }
      } else {
        var parseQuery = function parseQuery(value) {
          var params = {};

          if (value === "") {
            return params;
          }

          var pairs = value.replace(/\+/g, " ").split("&");

          for (var i = 0; i < pairs.length; i++) {
            var nv = pairs[i].split("=", 2);
            var n = decodeURIComponent(nv[0]);
            var v = decodeURIComponent(nv[1]);

            if (!params.hasOwnProperty(n)) {
              params[n] = [];
            }

            params[n].push(nv.length === 2 ? v : null);
          }

          return params;
        };

        var _params = parseQuery(query);

        if (_params.hasOwnProperty(prop)) {
          id = _params[prop];
        }
      }

      return id;
    };

    SliceMessengerFactory.getAvailableTransport = function getAvailableTransport() {
      var transport = null;

      if (SliceMessengerFactory.transports.length) {
        SliceMessengerFactory.transports.some(function (item) {
          if (item.isAvailable()) {
            transport = item;
            return true;
          }

          return false;
        });
      }

      return transport;
    };

    SliceMessengerFactory.createMessenger = function createMessenger(id, transport) {
      if (id === void 0) {
        id = SliceMessengerFactory.getIdFromURL(location.search);
      }

      if (transport === void 0) {
        transport = SliceMessengerFactory.getAvailableTransport();
      }

      return new SliceMessenger(id, transport);
    };

    return SliceMessengerFactory;
  }();

  _defineProperty(SliceMessengerFactory, "transports", []);

  SliceMessengerFactory.addTransport(new SliceLocalStorageTransport());
  window.SliceMessage = SliceMessage;
  window.SliceMessageTransport = SliceMessageTransport;
  window.SliceLocalStorageTransport = SliceLocalStorageTransport;
  window.SliceMessenger = SliceMessenger;
  window.SliceMessageBox = SliceMessageBox;
  window.SliceMessengerFactory = SliceMessengerFactory;
});
//# sourceMappingURL=slice-document-messenger.js.map
