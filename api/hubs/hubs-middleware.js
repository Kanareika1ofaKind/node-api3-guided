const Hubs = require('./hubs-model.js');

async function checkHubId(req, res, next) {
    const { id } = req.params;
    try {
        const data = await Hubs.findById(id);
        if (data) {
            req.data = data;
            next();
        }
        else {
            next({ status: 404, message: `user ${id} is not found!` });
        }
    } catch (err) {
        next(err);
    }
}

function checkNewHub(req, res, next) {
    const { name } = req.body;
    if (
        name !== undefined &&
        typeof name === 'string' &&
        name.length &&
        name.trim().length
    ) {
        next();
    } else {
        next({ status: 422, message: 'error adding name!' });
    }
}

function checkNewMessageHub(req, res, next) {
    const { sender, text } = req.body;
    if (
        sender !== undefined &&
        typeof sender === 'string' &&
        sender.length &&
        sender.trim().length &&
        text !== undefined &&
        typeof text === 'string' &&
        text.length &&
        text.trim().length) {
        next();
    } else {
        next({ status: 422, message: 'requires sender and text' });
    }
}









module.exports = { checkHubId, checkNewHub, checkNewMessageHub };