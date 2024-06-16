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
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockUserByUser = exports.blockUserByUser = void 0;
const models_1 = require("../../models");
const blockUserByUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOneAndUpdate({ _id: data.userId }, { $addToSet: { blockedUsers: data.targetUserId } }, { new: true });
        return user;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.blockUserByUser = blockUserByUser;
const unblockUserByUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOneAndUpdate({ _id: data === null || data === void 0 ? void 0 : data.userId }, { $pull: { blockedUsers: data.targetUserId } }, { new: true });
        return user;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.unblockUserByUser = unblockUserByUser;
