/* import start */
import SliceMessage from '../messenger/SliceMessage.js'
import SliceMessageTransport from '../messenger/SliceMessageTransport.js'
import SliceLocalStorageTransport from '../messenger/SliceLocalStorageTransport.js'
import SliceMessenger from '../messenger/SliceMessenger.js'
import SliceMessageBox from '../messenger/SliceMessageBox.js'
import SliceMessengerFactory from '../messenger/SliceMessengerFactory.js'
/* import end */

SliceMessengerFactory.addTransport(new SliceLocalStorageTransport())

window.SliceMessage = SliceMessage
window.SliceMessageTransport = SliceMessageTransport
window.SliceLocalStorageTransport = SliceLocalStorageTransport
window.SliceMessenger = SliceMessenger
window.SliceMessageBox = SliceMessageBox
window.SliceMessengerFactory = SliceMessengerFactory
