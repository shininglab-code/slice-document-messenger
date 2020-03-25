/**
  * Slice Document Messenger
  * Copyright 2020 shininglab (https://github.com/shininglab-code)
  * Licensed under MIT
  */

/* import start */
import SliceMessage from './SliceMessage.js'
import SliceMessageBox from './SliceMessageBox.js'
import SliceMessageTransport from './SliceMessageTransport.js'
/* import end */

/**
 * Send and recieve messages throught browser.
 */
class SliceMessenger {
    /**
     * @constructor
     * @param {string} id SliceMessenger id, should be unique per messenger
     * @param {SliceMessageTransport} transport SliceMessageTransport instance
     */
    constructor(id, transport) {
        if (!id) {
            throw new Error('Can\'t create messenger without id.')
        }
        if (!(transport instanceof SliceMessageTransport)) {
            throw new TypeError('Messenger transport should be instance of SliceMessageTransport.')
        }
        this.timeouts = {
            out: {},
            current: {},
            self: {}
        }
        this.id = id
        this.receivers = {}
        this.boxes = []
        this.receive = this.receive.bind(this)
        this.transport = transport
        transport.addReceiver(this.id, this.receive)
    }

    /**
     * Recieve message
     * @param {SliceMessage} message SliceMessage instance.
     * @return {SliceMessenger} current SliceMessenger
     * @public
     */
    receive(message) {
        if (this.boxes.length) {
            this.boxes.map((box) => {
                box.receive(message)
            })
        }
        if (message.name && this.receivers.hasOwnProperty(message.name)) {
            const receivers = this.receivers[message.name]
            receivers.map((receiver) => {
                receiver(message)
            })
        }
        return this
    }
    /**
     * Send message to outer recievers
     * @param {string} name SliceMessage name.
     * @param {object} data SliceMessage data.
     * @param {variable} timeout SliceMessage timeout.
     * @return {SliceMessenger} current SliceMessenger
     * @private
     */
    send(name, data, timeout) {
        const timeouts = this.timeouts.out
        if (timeouts.hasOwnProperty(name) && timeouts[name]) {
            clearTimeout(timeouts[name])
            delete timeouts[name]
        }
        if (timeout) {
            timeouts[name] = setTimeout(() => {
                delete timeouts[name]
                this.send(name, data)
            }, timeout === true ? 0 : timeout)
        } else {
            const message = SliceMessage.create(name, data)
            this.transport.send(this.id, message)
        }
        return this
    }
    /**
     * Send message to the current messenger only.
     * @param {string} name SliceMessage name.
     * @param {object} data SliceMessage data.
     * @param {variable} timeout SliceMessage timeout.
     * @return {SliceMessageBox} current SliceMessageBox
     * @private
     */
    sendSelf(name, data, timeout) {
        const timeouts = this.timeouts.self
        if (timeouts.hasOwnProperty(name) && timeouts[name]) {
            clearTimeout(timeouts[name])
            delete timeouts[name]
        }
        if (timeout) {
            timeouts[name] = setTimeout(() => {
                delete timeouts[name]
                this.sendSelf(name, data)
            }, timeout === true ? 0 : timeout)
        } else {
            const message = SliceMessage.create(name, data)
            this.receive(message)
        }
        return this
    }
    /**
     * Send message to the current window/frame.
     * @param {string} name SliceMessage name.
     * @param {object} data SliceMessage data.
     * @param {variable} timeout SliceMessage timeout.
     * @return {SliceMessageBox} current SliceMessageBox
     * @private
     */
    sendCurrent(name, data, timeout) {
        const timeouts = this.timeouts.current
        if (timeouts.hasOwnProperty(name) && timeouts[name]) {
            clearTimeout(timeouts[name])
            delete timeouts[name]
        }
        if (timeout) {
            timeouts[name] = setTimeout(() => {
                delete timeouts[name]
                this.sendCurrent(name, data)
            }, timeout === true ? 0 : timeout)
        } else {
            const message = SliceMessage.create(name, data)
            this.transport.recieve(this.id, message)
        }
        return this
    }
    /**
     * Send message to the current window/frame and outer recievers.
     * @param {string} name SliceMessage name.
     * @param {object} data SliceMessage data.
     * @param {variable} timeout SliceMessage timeout.
     * @return {SliceMessageBox} current SliceMessageBox
     * @private
     */
    sendEveryone(name, data, timeout) {
        this.sendCurrent(name, data, timeout)
        this.send(name, data, timeout)
        return this
    }
    /**
     * Add receiver box
     * @param {SliceMessageBox} box SliceMessageBox instance.
     * @return {SliceMessenger} current SliceMessenger
     * @private
     */
    addBox(box) {
        if (box instanceof SliceMessageBox) {
            this.boxes.push(box)
        }
        return this
    }
    /**
     * Remove receiver box
     * @param {SliceMessageBox} box SliceMessageBox instance.
     * @return {SliceMessenger} current SliceMessenger
     * @private
     */
    removeBox(box) {
        const index = this.boxes.indexOf(box)
        if (index > -1) {
            this.boxes.splice(index, 1)
        }
        return this
    }
    /**
     * Add receiver
     * @param {string} name SliceMessage name.
     * @param {function} receiver Receiver function.
     * @return {SliceMessenger} current SliceMessenger
     * @private
     */
    addReceiver(name, receiver) {
        if (!this.receivers.hasOwnProperty(name)) {
            this.receivers[name] = []
        }
        this.receivers[name].push(receiver)
        return this
    }
    /**
     * Remove receiver
     * @param {string} name SliceMessage name.
     * @param {function} receiver Receiver function.
     * @return {SliceMessenger} current SliceMessenger
     * @private
     */
    removeReceiver(name, receiver) {
        if (this.receivers.hasOwnProperty(name)) {
            const index = this.receivers[name].indexOf(receiver)
            if (index > -1) {
                this.receivers[name].splice(index, 1)
            }
        }
        return this
    }
    /**
     * Remove
     * @return {void}
     * @private
     */
    remove() {
        for (let name in this.timeouts) {
            if (this.timeouts.hasOwnProperty(name)) {
                const timeouts = this.timeouts[name]
                for (let timeout in timeouts) {
                    if (timeouts.hasOwnProperty(timeout)) {
                        clearTimeout(timeouts[timeout])
                        delete timeouts[timeout]
                    }
                }
            }
        }
        this.transport.removeReceiver(this.id, this.receive)
    }
}

/* export start */
export default SliceMessenger
/* export end */
