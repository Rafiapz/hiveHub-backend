"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnlineUsersController = void 0;
const socket_1 = require("../../../_boot/socket");
const getOnlineUsersController = (req, res) => {
    try {
        const users = (0, socket_1.getOnlineUsers)();
        let onlineUsers = [];
        for (let [key] of users) {
            onlineUsers.push(key);
        }
        res.status(200).json({ status: 'ok', data: onlineUsers });
    }
    catch (error) {
        res.status(error.status || 500).json({ status: 'failed', message: error.message });
    }
};
exports.getOnlineUsersController = getOnlineUsersController;
