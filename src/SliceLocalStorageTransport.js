/**
  * Slice Document Messenger
  * Copyright 2020 shininglab (https://github.com/shininglab-code)
  * Licensed under MIT
  */

/* import start */
import SliceMessage from './SliceMessage.js'
import SliceMessageTransport from './SliceMessageTransport.js'
/* import end */

/**
 * Message transport.
 */
class SliceLocalStorageTransport extends SliceMessageTransport {
    /**
     * @constructor
     */
    constructor() {
        super()
        this.handle = this.handle.bind(this)
        window.addEventListener('storage', this.handle)
    }
    /**
     * Handle storage event
     * @param {object} e Local storage event.
     * @return {SliceLocalStorageTransport} current SliceLocalStorageTransport
     * @private
     */
    handle(e) {
        if (!this.hasAddress(e.key, true) || e.newValue === null) {
            return null
        }
        const message = SliceMessage.fromJSON(e.newValue)
        return this.receive(e.key, message, true)
    }
    /**
     * @inheritdoc
     */
    send(address, message) {
        const transportAddress = this.constructor.getAddress(address)
        localStorage.setItem(transportAddress, message.toString())
        localStorage.removeItem(transportAddress)
        return this
    }
    /**
     * @inheritdoc
     */
    remove() {
        window.removeEventListener('storage', this.handle)
        super.remove()
    }
}

/* export start */
export default SliceLocalStorageTransport
/* export end */
