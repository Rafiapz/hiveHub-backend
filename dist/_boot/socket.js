"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPeerId = exports.initializeSocketIO = exports.getSocketServer = exports.getUser = exports.removeUser = exports.getOnlineUsers = void 0;
const socket_io_1 = require("socket.io");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
let ioInstance = null;
const uploadsDir = './public/posts';
let users = new Map();
let peers = new Map();
const getOnlineUsers = () => {
    return users;
};
exports.getOnlineUsers = getOnlineUsers;
const addUser = (userId, socketId) => {
    users.set(userId, socketId);
};
const removeUser = (userId) => {
    users.delete(userId);
};
exports.removeUser = removeUser;
const getUser = (userId) => {
    return users.get(userId);
};
exports.getUser = getUser;
const getSocketServer = () => {
    return ioInstance;
};
exports.getSocketServer = getSocketServer;
const initializeSocketIO = (server) => {
    var _a;
    try {
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.FRONT_END_URL,
                methods: ['GET', 'POST'],
                credentials: true
            },
            path: '/socket.io'
        });
        ioInstance = io;
        io.on('connection', (socket) => {
            socket.on("addUser", (userId) => {
                console.log('user added', socket.id);
                if (userId) {
                    addUser(userId, socket.id);
                    io.emit("getUsers", users);
                }
            });
            let fileData = [];
            let fileName;
            socket.on('video-chunk', (data) => {
                fileData[data.offset] = data.chunk;
            });
            socket.on('video-transfer-complete', ({ senderId, receiverId, conversationId }) => {
                const filteredFileData = fileData.filter((chunk) => chunk !== undefined);
                const fileBuffer = Buffer.concat(filteredFileData);
                const timestamp = Date.now();
                fileName = `video-${timestamp}.mp4`;
                const filePath = path_1.default.join(uploadsDir, fileName);
                fs_1.default.writeFile(filePath, fileBuffer, (err) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        console.error('Error saving video file:', err);
                        socket.emit('video-upload-error', 'Error saving video file');
                    }
                    else {
                        console.log('Video file saved successfully');
                        try {
                            const form = new FormData();
                            form.append('fileName', fileName || '');
                            form.append('senderId', senderId);
                            form.append('conversationId', conversationId);
                            form.append('from', 'socket');
                            yield axios_1.default.post(`${process === null || process === void 0 ? void 0 : process.env.BACK_END_URL}/api/chats/send-video/video`, form, {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            io.emit('upload-comepleted', { conversationId });
                        }
                        catch (error) {
                            const sender = (0, exports.getUser)(senderId);
                            io.to(sender).emit('failed to upload');
                            return;
                        }
                        const user = (0, exports.getUser)(receiverId);
                        if (user) {
                            io.to(user).emit('video-upload-success', { fileName, senderId });
                        }
                    }
                }));
            });
            socket.on('sendMessage', ({ senderId, receiverId, message }) => {
                const user = (0, exports.getUser)(receiverId);
                console.log(users);
                if (user) {
                    io.to(user).emit("recieveMessage", {
                        senderId,
                        message,
                    });
                }
                else {
                }
            });
            socket.on('typing', (data) => {
                const user = (0, exports.getUser)(data === null || data === void 0 ? void 0 : data.receiverId);
                if (user) {
                    io.to(user).emit('typing', { data: 'Typing...', senderId: data === null || data === void 0 ? void 0 : data.senderId });
                }
            });
            socket.on('image', (data) => {
                console.log('image called');
                const user = (0, exports.getUser)(data === null || data === void 0 ? void 0 : data.receiverId);
                if (user) {
                    io.emit('image', { data: data === null || data === void 0 ? void 0 : data.data, senderId: data === null || data === void 0 ? void 0 : data.senderId });
                }
                else {
                    // console.log('user not found');
                }
            });
            socket.on('video', (data) => {
                const user = (0, exports.getUser)(data === null || data === void 0 ? void 0 : data.receiverId);
                if (user) {
                    io.to(user).emit('video', data);
                }
            });
            socket.on('sendNotification', (data) => {
                const user = (0, exports.getUser)(data === null || data === void 0 ? void 0 : data.receiverId);
                console.log(user, 'not');
                if (user) {
                    console.log('emmited');
                    io.to(user).emit('getNotifiation', data);
                }
            });
            socket.on('sendNotificationtoAll', (data) => {
                io.emit('getNotifiation', data);
            });
            socket.on("disconnect", () => {
                console.log('disconnected');
                (0, exports.removeUser)(socket.id);
                io.emit("getUsers", users);
            });
            socket.on('peer-connection', ({ id, userId }) => {
                if (userId) {
                    peers.set(userId, id);
                    console.log('peer added');
                }
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.initializeSocketIO = initializeSocketIO;
const fetchPeerId = (req, res) => {
    var _a;
    try {
        console.log('perr okk');
        const peerId = peers.get((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
        console.log(peerId);
        res.status(200).json({ status: 'ok', data: { peerId } });
    }
    catch (error) {
        console.log(error);
        res.status(400);
    }
};
exports.fetchPeerId = fetchPeerId;
