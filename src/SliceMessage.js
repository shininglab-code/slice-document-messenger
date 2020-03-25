/**
  * Slice Document Messenger
  * Copyright 2020 shininglab (https://github.com/shininglab-code)
  * Licensed under MIT
  */

/**
 * Message.
 */
class SliceMessage {
    /**
     * @constructor
     * @param {string} name Message name
     * @param {object} data Message data
     */
    constructor(name, data) {
        this.name = name || null
        this.data = data || {}
    }
    /**
     * Create SliceMessage
     * @param {string} name Message name
     * @param {object} data Message data
     * @return {SliceMessage} new SliceMessage
     * @static
     */
    static create(name, data) {
        return new SliceMessage(name, data)
    }
    /**
     * Create SliceMessage from JSON string
     * @param {string} str JSON string
     * @return {SliceMessage} new SliceMessage
     * @static
     */
    static fromJSON(str) {
        let name = null
        let data = {}
        try {
            const parsed = JSON.parse(str)
            if (typeof parsed === 'object') {
                if (parsed.hasOwnProperty('name')) {
                    name = parsed.name
                }
                if (parsed.hasOwnProperty('data') && typeof parsed.data === 'object') {
                    data = parsed.data
                }
            }
        } catch (e) {
            /* WHOOPS */
            name = 'MessageParseError'
            data = {
                error: e,
                raw: str
            }
        }
        return new SliceMessage(name, data)
    }
    /**
     * Transfrom to JSON string
     * @return {string} JSON string
     */
    toString() {
        return JSON.stringify({
            name: this.name,
            data: this.data
        })
    }
}

/* export start */
export default SliceMessage
/* export end */
