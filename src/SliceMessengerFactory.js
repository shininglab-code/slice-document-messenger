/**
  * Slice Document Messenger
  * Copyright 2020 shininglab (https://github.com/shininglab-code)
  * Licensed under MIT
  */

/* import start */
import SliceMessageTransport from './SliceMessageTransport.js'
import SliceMessenger from './SliceMessenger.js'
/* import end */

/**
 * Slice messenger factory.
 */
class SliceMessengerFactory {
    /**
     * Messages transports
     * @static
     */
    static transports = []

    /**
     * Add transport
     * @param {SliceMessageTransport} transport SliceMessageTransport instance.
     * @return {void}
     * @static
     */
    static addTransport(transport) {
        if (transport instanceof SliceMessageTransport) {
            if (SliceMessengerFactory.transports.indexOf(transport) < 0) {
                SliceMessengerFactory.transports.push(transport)
            }
        }
    }

    /**
     * Get messenger id from URL
     * @param {string} searchURL URL to get messenger id from.
     * @return {void}
     * @static
     */
    static getIdFromURL(searchURL) {
        let id = null
        const prop = 'messengerId'
        const queryStart = searchURL.indexOf("?") + 1
        const queryEnd = searchURL.indexOf("#") + 1 || searchURL.length + 1
        const query = searchURL.slice(queryStart, queryEnd - 1)
        if (URLSearchParams) {
            const params = new URLSearchParams(`?${query}`)
            if (params.has(prop)) {
                id = params.get(prop)
            }
        } else {
            const parseQuery = (value) => {
                let params = {}
                if (value === "") {
                    return params
                }

                const pairs = value.replace(/\+/g, " ").split("&")
                for (let i = 0; i < pairs.length; i++) {
                    const nv = pairs[i].split("=", 2)
                    const n = decodeURIComponent(nv[0])
                    const v = decodeURIComponent(nv[1])

                    if (!params.hasOwnProperty(n)) {
                        params[n] = []
                    }
                    params[n].push(nv.length === 2 ? v : null)
                }
                return params
            }
            const params = parseQuery(query)
            if (params.hasOwnProperty(prop)) {
                id = params[prop]
            }
        }
        return id
    }

    /**
     * Get available transport
     * @param {string} id SliceMessage id.
     * @param {SliceMessageTransport} transport SliceMessageTransport instance.
     * @return {SliceMessenger} created SliceMessenger instance
     * @public
     */
    static getAvailableTransport() {
        let transport = null
        if (SliceMessengerFactory.transports.length) {
            SliceMessengerFactory.transports.some((item) => {
                if (item.isAvailable()) {
                    transport = item
                    return true
                }
                return false
            })
        }
        return transport
    }

    /**
     * Create messenger
     * @param {string} id SliceMessage id.
     * @param {SliceMessageTransport} transport SliceMessageTransport instance.
     * @return {SliceMessenger} created SliceMessenger instance
     * @public
     */
    static createMessenger(id = SliceMessengerFactory.getIdFromURL(location.search), transport = SliceMessengerFactory.getAvailableTransport()) {
        return new SliceMessenger(id, transport)
    }
}

/* export start */
export default SliceMessengerFactory
/* export end */
