/* eslint-disable no-unused-vars */
const express = require('express');

const Hubs = require('./hubs-model.js');
const { checkHubId, checkNewHub, checkNewMessageHub } = require('./hubs-middleware.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

router.get('/', (req, res, next) => {
    Hubs.find(req.query)
        .then(hubs => {
            res.status(200).json(hubs);
        })
        .catch(() => {
            next({ status: 500, message: 'Error retrieving the app names' });
        });
});

router.get('/:id', checkHubId, (req, res) => {
    res.json(req.data);
});

router.post('/', checkNewHub, (req, res, next) => {
        Hubs.add(req.body)
            .then(hub => {
                res.status(201).json(hub);
            })
            .catch(() => {
                next({ status: 400, message: `Name already exists` });
            });
    
});

router.delete('/:id', checkHubId, (req, res, next) => {

    const { id } = req.params;

    Hubs.remove(id)
        .then(hub => {
            res.status(201).json(hub);
        })
        .catch(() => {
            next({ status: 500, message: 'Error deleting message to the hub' });
        });
});

router.put('/:id', checkHubId, checkNewHub, (req, res, next) => {
    const { id } = req.params;
    Hubs.update(id, req.body)
        .then(hub => {
            res.status(200).json(hub);
        })
        .catch(() => {
            next({ status: 500, message: 'Name already exists' });
        });
});

router.get('/:id/messages', checkHubId, (req, res, next) => {
    Hubs.findHubMessages(req.params.id)
        .then(messages => {
            res.status(200).json(messages);
        })
        .catch(() => {
            next({ status: 500, message: 'Error getting message to the hub' });
        });
});

router.post('/:id/messages', checkHubId, checkNewMessageHub, (req, res, next) => {
    const messageInfo = { ...req.body, hub_id: req.params.id };

    Messages.add(messageInfo)
        .then(message => {
            res.status(210).json(message);
        })
        .catch(() => {
            next({ status: 500, message: 'Error posting message to the hub' });
        });
});



router.use((err, req, res, next) => { 
    res.status(err.status || 500).json({
        message: err.message,
    });

});

module.exports = router;
