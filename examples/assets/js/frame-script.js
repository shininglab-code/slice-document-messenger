/**
 * This is just an example of SliceMessenger usage
 * and is not meant to be used on production sites.
 */

;(function() {
    "use strict";
    // blocks container id
    var containerId = 'frame-blocks-container';
    // create messenger automaticaly, will take id from get parameters messageId
    var messenger = SliceMessengerFactory.createMessenger();
    // create DOM element
    function createElementAt(parentElement, tag, classes, text, attributes) {
        var element = document.createElement(tag);
        if (classes) {
            var classesList = Array.isArray(classes) ? classes.join() : classes;
            element.className = classesList;
        }
        if (text) {
            element.textContent = text;
        }
        if (attributes) {
            for (var attribute in attributes) {
                if (attributes.hasOwnProperty(attribute)) {
                    element.setAttribute(attribute, attributes[attribute]);
                }
            }
        }
        parentElement.appendChild(element);
        return element;
    }
    // remove block
    function removeBlock(id) {
        if (id) {
            var elements = document.getElementById(containerId).querySelectorAll('[data-id="' + id + '"]');
            [].forEach.call(elements, function(element, index, list) {
                element.parentElement.removeChild(element);
            });
        }
    }
    // remove block link event listener
    function removeBlockListener(e) {
        e.preventDefault();
        var id = this.parentElement.getAttribute('data-id');
        removeBlock(id);
        // send message to remove block
        messenger.send('removeBlock', {
            id: id
        });
    }
    // block id index
    var indexing = 1;
    // create block
    function createBlock(data) {
        // organize block data
        var blockData = {
            id: null,
            title: 'Anonimous',
            type: 'default',
            text: 'Whoooopie!!!'
        };
        if (typeof data === 'object'){
            for (var prop in blockData) {
                if (data.hasOwnProperty(prop)) {
                    blockData[prop] = data[prop];
                }
            }
        }
        // if there is no block id, than create it
        if (!blockData.id) {
            var idBase = 'block-';
            blockData.id = idBase + indexing;
            while(document.querySelectorAll('[data-id="' + blockData.id + '"]').length) {
                ++indexing;
                blockData.id = idBase + indexing;
            }
        }
        // don't create if there is already block with such id
        if (document.querySelectorAll('[data-id="' + blockData.id + '"]').length) {
            return;
        }
        // create block structure
        var parent = document.getElementById(containerId);
        var block = createElementAt(parent, 'div', 'list-group-item list-group-item-' + blockData.type, null, {
            'data-id': blockData.id,
            'data-type': blockData.type
        });
        createElementAt(block, 'h5', 'mb-1', blockData.title);
        createElementAt(block, 'p', 'mb-2', blockData.text);
        createElementAt(block, 'a', 'remove-block', 'remove', {
                href: '#'
            })
            .addEventListener('click', removeBlockListener);
    }

    // example of message box, to handle multiple messages
    var messageBoxSettings = {
        // message handlers
        handlers: {
            // handle message 'removeBlock' with 'removeBlock' method
            removeBlock: 'removeBlock',
            // this is equal to => createBlock: 'createBlock'
            createBlock: {
                /**
                 * if 'self' is set to true, message will be handled by SliceMessageBox
                 * so you can extend SliceMessageBox and add message recievers methods in it
                */
                self: false,
                handler: 'createBlock'
            },
            // handle message 'blocks' with 'syncBlocks' method
            blocks: 'syncBlocks'
        }
    };
    var messageBox = new SliceMessageBox({
        removeBlock: function(message) {
            if (message.data && message.data.id) {
                removeBlock(message.data.id);
            }
        },
        createBlock: function(message) {
            if (message.data) {
                createBlock(message.data);
            }
        },
        syncBlocks: function(message) {
            var container = document.getElementById(containerId);
            while (container.firstChild) {
                container.removeChild(container.lastChild);
            }
            if (message.data && Array.isArray(message.data)) {
                message.data.forEach(function(block) {
                    createBlock(block);
                });
            }
        }
    }, messageBoxSettings);
    messenger.addBox(messageBox);

    /**
     * You can also send messages from message box
     * if you provided it with messenger
     */
    messageBox.setMessenger(messenger);
    messageBox.send('requestBlocks');
})();