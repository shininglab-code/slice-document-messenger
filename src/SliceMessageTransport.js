/**
  * Slice Document Messenger
  * Copyright 2020 shininglab (https://github.com/shininglab-code)
  * Licensed under MIT
  */

/**
 * Message transport.
 */
class SliceMessageTransport {
    /**
     * @constructor
     */
    constructor() {
        this.receivers = {}
    }
    /**
     * Get transport address
     * @param {string} address Receiver address.
     * @return {string} transport address
     * @static
     */
    static getAddress(address) {
        return `transport-${address}`
    }
    /**
     * Check if transportation is available
     * @return {boolean} transportation available
     * @static
     */
    static isAvailable() {
        return true
    }
    /**
     * Check if transport is available
     * @return {boolean} transport available
     * @static
     */
    isAvailable() {
        return this.constructor.isAvailable()
    }
    /**
     * Add receiver
     * @param {string} address Receiver address.
     * @param {function} receiver Receiver function.
     * @return {SliceMessageTransport} current SliceMessageTransport
     * @public
     */
    addReceiver(address, receiver) {
        const transportAddress = this.constructor.getAddress(address)
        if (!this.receivers.hasOwnProperty(transportAddress)) {
            this.receivers[transportAddress] = []
        }
        this.receivers[transportAddress].push(receiver)
        return this
    }
    /**
     * Remove receiver
     * @param {string} address SliceMessage address.
     * @param {function} receiver Receiver function.
     * @return {SliceMessageTransport} current SliceMessageTransport
     * @public
     */
    removeReceiver(address, receiver) {
        const transportAddress = this.constructor.getAddress(address)
        if (this.receivers.hasOwnProperty(transportAddress)) {
            const index = this.receivers[transportAddress].indexOf(receiver)
            if (index > -1) {
                this.receivers[transportAddress].splice(index, 1)
            }
        }
        return this
    }
    /**
     * Has any reciever with such address
     * @param {string} address Recievers address.
     * @param {boolean} isTransport Is transport address.
     * @return {boolean} true|false
     * @public
     */
    hasAddress(address, isTransport) {
        const transportAddress = isTransport ? address : this.constructor.getAddress(address)
        return this.receivers.hasOwnProperty(transportAddress) && this.receivers[transportAddress].length
    }
    /**
     * Recieve message
     * @param {string} address Transport address.
     * @param {SliceMessage} message SliceMessage instance.
     * @param {boolean} isTransport Is transport address.
     * @return {SliceMessenger} current SliceMessenger
     * @public
     */
    receive(address, message, isTransport) {
        const transportAddress = isTransport ? address : this.constructor.getAddress(address)
        if (this.receivers.hasOwnProperty(transportAddress)) {
            this.receivers[transportAddress].map((receiver) => {
                receiver(message)
            })
        }
        return this
    }
    /**
     * Send message
     * @param {string} address Messange address.
     * @param {SliceMessage} message SliceMessage instance.
     * @return {SliceMessageTransport} current SliceMessageTransport
     * @public
     */
    send(address, message) {
        if (window.console) {
            console.log(`${this.constructor.getAddress(address)}: ${message.toString()}`)
        }
        return this
    }
    /**
     * Remove
     * @return {void}
     * @public
     */
    remove() {
        this.receivers = {}
    }
}

/* export start */
export default SliceMessageTransport
/* export end */
