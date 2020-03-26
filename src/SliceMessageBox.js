/**
  * Slice Document Messenger
  * Copyright 2020 shininglab (https://github.com/shininglab-code)
  * Licensed under MIT
  */

/* import start */
import SliceMessenger from './SliceMessenger.js'
/* import end */

/**
 * Message box.
 * Used for quick messages handling.
 * Messages can be handled by itself or by its this.owner.
 */
class SliceMessageBox {
    /**
     * @constructor
     * @param {object} owner Message box owner
     * @param {object} settings Message box settings
     * @param {SliceMessenger} messenger SliceMessenger instance
     * @param {boolean} subscribe Subscribe to provided SliceMessenger
     */
    constructor(owner = {}, settings = {}, messenger, subscribe) {
        this.settings = settings
        this.owner = owner
        if (messenger) {
            this.setMessenger(messenger, subscribe)
        }
    }
    /**
     * Set messenger
     * @param {SliceMessenger} messenger SliceMessenger instance.
     * @param {boolean} subscribe Subscribe to provided SliceMessenger
     * @param {boolean} unsubscribe Un-subscribe from previous SliceMessenger
     * @return {SliceMessageBox} current SliceMessageBox
     * @public
     */
    setMessenger(messenger, subscribe, unsubscribe) {
        if (this.messenger && unsubscribe) {
            this.messenger.removeBox(this)
        }
        if (messenger instanceof SliceMessenger) {
            this.messenger = messenger
            if (subscribe) {
                this.messenger.addBox(this)
            }
        }
        return this
    }
    /**
     * Recieve message
     * @param {SliceMessage} message SliceMessage instance.
     * @return {SliceMessageBox} current SliceMessageBox
     * @public
     */
    receive(message) {
        if (message.name) {
            const settings = this.settings
            let handler = null
            let handlerSettings = settings.handlers && settings.handlers.hasOwnProperty(message.name) ?
                settings.handlers[message.name] : settings.defaultHandler || null
            if (handlerSettings) {
                if (typeof handlerSettings === 'string') {
                    handlerSettings = {
                        self: false,
                        handler: handlerSettings
                    }
                }
                if (handlerSettings.self) {
                    if (this[handlerSettings.handler]) {
                        handler = this[handlerSettings.handler]
                        this[handlerSettings.handler](message)
                    }
                } else if (this.owner[handlerSettings.handler]) {
                    handler = this.owner[handlerSettings.handler]
                }
            }

            if (handler) {
                handler(message)
            } else if (handlerSettings) {
                throw new Error(`Can't handle message ${message.name}.`)
            }
        }
        return this
    }
    /**
     * Send message
     * @param {string} name SliceMessage name.
     * @param {object} data SliceMessage data.
     * @param {variable} timeout SliceMessage timeout.
     * @return {SliceMessageBox} current SliceMessageBox
     * @public
     */
    send(name, data, timeout) {
        if (this.messenger) {
            this.messenger.send(name, data, timeout)
        } else {
            throw new Error("Can't send message: no messenger provided.")
        }
        return this
    }
    /**
     * Send message to the current messenger only.
     * @param {string} name SliceMessage name.
     * @param {object} data SliceMessage data.
     * @param {variable} timeout SliceMessage timeout.
     * @return {SliceMessageBox} current SliceMessageBox
     * @public
     */
    sendSelf(name, data, timeout) {
        if (this.messenger) {
            this.messenger.sendSelf(name, data, timeout)
        } else {
            throw new Error("Can't send message: no messenger provided.")
        }
        return this
    }
    /**
     * Send message to the current window/frame.
     * @param {string} name SliceMessage name.
     * @param {object} data SliceMessage data.
     * @param {variable} timeout SliceMessage timeout.
     * @return {SliceMessageBox} current SliceMessageBox
     * @public
     */
    sendCurrent(name, data, timeout) {
        if (this.messenger) {
            this.messenger.sendCurrent(name, data, timeout)
        } else {
            throw new Error("Can't send message: no messenger provided.")
        }
        return this
    }
    /**
     * Send message to the current window/frame and outer receivers.
     * @param {string} name SliceMessage name.
     * @param {object} data SliceMessage data.
     * @param {variable} timeout SliceMessage timeout.
     * @return {SliceMessageBox} current SliceMessageBox
     * @public
     */
    sendEveryone(name, data, timeout) {
        if (this.messenger) {
            this.messenger.sendEveryone(name, data, timeout)
        } else {
            throw new Error("Can't send message: no messenger provided.")
        }
        return this
    }
}

/* export start */
export default SliceMessageBox
/* export end */
