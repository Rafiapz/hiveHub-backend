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
exports.deleteComment = void 0;
const commentsModel_1 = __importDefault(require("../../models/commentsModel"));
const models_1 = require("../../models");
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postIdData = yield commentsModel_1.default.findOne({ _id: commentId });
        const status = yield commentsModel_1.default.deleteOne({ _id: commentId });
        yield models_1.Posts.updateOne({ _id: postIdData === null || postIdData === void 0 ? void 0 : postIdData.postId }, { $inc: { comments: -1 } });
        return status;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.deleteComment = deleteComment;
