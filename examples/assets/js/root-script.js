/**
 * This is just an example of SliceMessenger usage
 * and is not meant to be used on production sites.
 */

;(function() {
    "use strict";
    // blocks container id
    var containerId = 'root-blocks-container';
    // get id for messenger
    var messengerId = SliceMessengerFactory.getIdFromURL(document.getElementById('frame-window').getAttribute('src'));
    // create messenger
    var messenger = SliceMessengerFactory.createMessenger(messengerId);
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
                var row = element.parentElement;
                row.parentElement.removeChild(row);
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
        var block = createElementAt(parent, 'div', 'col-sm-6 col-lg-4');
        block = createElementAt(block, 'div', 'alert alert-' + blockData.type + ' mb-3', null, {
            'data-id': blockData.id,
            'data-type': blockData.type
        });
        createElementAt(block, 'h5', 'alert-heading', blockData.title);
        createElementAt(block, 'p', 'alert-text', blockData.text);
        createElementAt(block, 'hr');
        createElementAt(block, 'a', 'alert-link remove-block', 'remove', {
                href: '#'
            })
            .addEventListener('click', removeBlockListener);
        // send message to create block
        messenger.send('createBlock', blockData);
    }

    // create block with form data on form submit
    var blocksForm = document.getElementById('root-blocks-form')
    blocksForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        createBlock({
            title: formData.get('messageTitle'),
            type: formData.get('messageType'),
            text: formData.get('messageText')
        });
        this.reset();
    });

    // get block element text, by element class
    function getBlockElementText(block, className) {
        var elements = block.getElementsByClassName(className);
        return elements.length ? elements[0].textContent : '';
    }

    // handle exsisting blocks
    var blocks = document.getElementById(containerId).querySelectorAll('[data-id]');

    [].forEach.call(blocks, function(block, index, list) {
        var removeLinks = block.getElementsByClassName('remove-block');
        [].forEach.call(removeLinks, function(element, index, list) {
            element.addEventListener('click', removeBlockListener);
        });
    });

    function sendBlocks() {
        var blocks = document.getElementById(containerId).querySelectorAll('[data-id]');
        var blocksData = [];
        [].forEach.call(blocks, function(block, index, list) {
            var removeLinks = block.getElementsByClassName('remove-block');
            [].forEach.call(removeLinks, function(element, index, list) {
                element.addEventListener('click', removeBlockListener);
            });
            blocksData.push({
                id: block.getAttribute('data-id'),
                type: block.getAttribute('data-type'),
                title: getBlockElementText(block, 'alert-heading'),
                text: getBlockElementText(block, 'alert-text')
            });
        });
        messenger.send('blocks', blocksData);
    }

    /* Messages recievers */
    // add reciever, to handle remove block message
    messenger.addReceiver('removeBlock', function(message) {
        if (message.data && message.data.id) {
            removeBlock(message.data.id);
        }
    });
    // add reciever, to handle request blocks message
    messenger.addReceiver('requestBlocks', function(message) {
        // when blocks are requested, send existing blocks
        sendBlocks();
    });
    // send blocks to existing frames
    sendBlocks();
})();