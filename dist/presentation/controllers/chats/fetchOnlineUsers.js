"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOnlineUsersController = void 0;
const socket_1 = require("../../../_boot/socket");
const fetchOnlineUsersController = (req, res) => {
    try {
        const users = (0, socket_1.getOnlineUsers)();
        let onlineUsers = [];
        for (let [key] of users) {
            onlineUsers.push(key);
        }
        res.status(200).json({ status: 'ok', data: onlineUsers });
    }
    catch (error) {
        res.status(400).json({ status: 'ok', message: error === null || error === void 0 ? void 0 : error.message });
    }
};
exports.fetchOnlineUsersController = fetchOnlineUsersController;
