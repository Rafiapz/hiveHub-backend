import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import fs from "fs";
import path from "path";
import axios from "axios";
import { Request, Response } from "express";

interface VideoChunkData {
  chunk: Uint8Array;
  offset: number;
}

let ioInstance: any = null;

const uploadsDir = "./public/posts";

let users = new Map();

let peers = new Map();

export const getOnlineUsers = () => {
  return users;
};

const addUser = (userId: any, socketId: any) => {
  users.set(userId, socketId);
};

export const removeUser = (userId: any) => {
  users.delete(userId);
};

export const getUser = (userId: any) => {
  return users.get(userId);
};

export const getSocketServer = () => {
  return ioInstance;
};

export const getKeyByValue = (peers: any, value: any) => {
  for (let [key, val] of peers.entries()) {
    if (val == value) {
      return key;
    }
  }

  return null;
};
export const initializeSocketIO = (server: Server) => {
  try {
    const io = new SocketIOServer(server, {
      cors: {
        origin: process?.env?.FRONT_END_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
      path: "/socket.io",
    });

    ioInstance = io;

    io.on("connection", (socket: Socket) => {
      socket.on("addUser", (userId: any) => {
        if (userId) {
          addUser(userId, socket.id);
          io.emit("getUsers", Array.from(users.keys()));
        }
      });

      let fileData: Uint8Array[] = [];
      let fileName: string | undefined;

      socket.on("video-chunk", (data: VideoChunkData) => {
        fileData[data.offset] = data.chunk;
      });

      socket.on(
        "video-transfer-complete",
        ({ senderId, receiverId, conversationId }: any) => {
          const filteredFileData = fileData.filter(
            (chunk): chunk is Uint8Array => chunk !== undefined,
          );
          const fileBuffer = Buffer.concat(filteredFileData);
          const timestamp = Date.now();
          fileName = `video-${timestamp}.mp4`;
          const filePath = path.join(uploadsDir, fileName);

          fs.writeFile(filePath, fileBuffer, async (err) => {
            if (err) {
              console.error("Error saving video file:", err);
              socket.emit("video-upload-error", "Error saving video file");
            } else {
              try {
                const form = new FormData();

                form.append("fileName", fileName || "");
                form.append("senderId", senderId);
                form.append("conversationId", conversationId);
                form.append("from", "socket");

                await axios.post(
                  `${process?.env.BACK_END_URL}/api/chats/send-video/video`,
                  form,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                );
                io.emit("upload-comepleted", { conversationId });
              } catch (error) {
                const sender = getUser(senderId);
                io.to(sender).emit("failed to upload");
                return;
              }
              const user = getUser(receiverId);

              if (user) {
                io.to(user).emit("video-upload-success", {
                  fileName,
                  senderId,
                });
              }
            }
          });
        },
      );

      socket.on("sendMessage", ({ senderId, receiverId, message }: any) => {
        const user = getUser(receiverId);
        if (user) {
          io.to(user).emit("recieveMessage", {
            senderId,
            message,
          });
        } else {
        }
      });

      socket.on("typing", (data: any) => {
        const user = getUser(data?.receiverId);
        if (user) {
          io.to(user).emit("typing", {
            data: "Typing...",
            senderId: data?.senderId,
          });
        }
      });

      socket.on("image", (data: any) => {
        const user = getUser(data?.receiverId);
        if (user) {
          io.emit("image", { data: data?.data, senderId: data?.senderId });
        } else {
        }
      });
      socket.on("video", (data) => {
        const user = getUser(data?.receiverId);

        if (user) {
          io.to(user).emit("video", data);
        }
      });

      socket.on("sendNotification", (data) => {
        const user = getUser(data?.receiverId);

        if (user) {
          io.to(user).emit("getNotifiation", data);
        }
      });

      socket.on("sendNotificationtoAll", (data) => {
        io.emit("getNotifiation", data);
      });

      socket.on("removeUser", (userId: any) => {
        if (userId) {
          removeUser(userId);
          io.emit("getUsers", Array.from(users.keys()));
        }
      });

      socket.on("disconnect", () => {
        let disconnectedUserId: any = null;
        for (let [userId, socketId] of users.entries()) {
          if (socketId === socket.id) {
            disconnectedUserId = userId;
            break;
          }
        }
        if (disconnectedUserId) {
          removeUser(disconnectedUserId);
          peers.delete(disconnectedUserId);
        }
        io.emit("getUsers", Array.from(users.keys()));
      });

      socket.on("peer-connection", ({ id, userId }) => {
        if (userId && id) {
          peers.set(userId, id);
        }
      });

      socket.on("reject-call", (data: any) => {
        const peerId = typeof data === "object" ? data?.peerId : data;
        const callerId = typeof data === "object" ? data?.callerId : null;
        const targetUserId = callerId || (peerId ? getKeyByValue(peers, peerId) : null);

        if (targetUserId) {
          const user = getUser(targetUserId);
          if (user) {
            io.to(user).emit("call-rejected", targetUserId);
          }
        }
      });

      socket.on("end-call", (data: any) => {
        const peerId = typeof data === "object" ? data?.peerId : data;
        const targetUserId = typeof data === "object" ? data?.targetUserId : null;
        const userId = targetUserId || (peerId ? getKeyByValue(peers, peerId) : null);

        if (userId) {
          const user = getUser(userId);
          if (user) {
            io.to(user).emit("call-ended", userId);
          }
        }
      });

      socket.on("cancel-call", (data: any) => {
        const peerId = typeof data === "object" ? data?.peerId : data;
        const targetUserId = typeof data === "object" ? data?.targetUserId : null;
        const userId = targetUserId || (peerId ? getKeyByValue(peers, peerId) : null);

        if (userId) {
          const user = getUser(userId);
          if (user) {
            io.to(user).emit("call-cancelled", userId);
          }
        }
      });
    });
  } catch (error: any) {
    console.error("Socket error:", error);
  }
};

export const fetchPeerId = (req: Request, res: Response) => {
  try {
    const peerId = peers.get(req?.params?.id);

    res.status(200).json({ status: "ok", data: { peerId: peerId || null } });
  } catch (error) {
    res.status(400).json({ status: "error", message: "Failed to fetch peerId" });
  }
};
