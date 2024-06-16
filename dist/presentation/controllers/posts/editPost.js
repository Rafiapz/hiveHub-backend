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
exports.editPostController = void 0;
const jwt_1 = require("../../../_lib/jwt");
const editPostController = (dependencies) => {
    const { postUseCases: { updatePostUseCase } } = dependencies;
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const token = req.cookies.userToken;
            if (token) {
                const decoded = (0, jwt_1.getTokenPayloads)(token);
                let path = `${process === null || process === void 0 ? void 0 : process.env.BACK_END_URL}/api/image/posts/${(_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename}`;
                if (decoded && typeof ((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.postId) === 'string') {
                    let mediaType = (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.type;
                    const formData = req === null || req === void 0 ? void 0 : req.body;
                    let media;
                    if (formData === null || formData === void 0 ? void 0 : formData.media) {
                        media = JSON.parse(formData === null || formData === void 0 ? void 0 : formData.media);
                        path = media.url;
                        mediaType = media.type;
                    }
                    const postIdString = (_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.postId;
                    const postId = Object(postIdString);
                    const data = {
                        _id: postId,
                        userId: decoded.id,
                        media: { path: path, type: mediaType },
                        content: formData === null || formData === void 0 ? void 0 : formData.content
                    };
                    const updatedPost = yield updatePostUseCase(dependencies).execute(data);
                    if (updatedPost) {
                        res.json({ status: 'ok', postData: updatedPost, message: 'Your post has been successfully updated!' });
                    }
                    else {
                        throw new Error('Failed to update post');
                    }
                }
                else {
                    throw new Error('Something went wrong');
                }
            }
            else {
                throw new Error('Please login and try again');
            }
        }
        catch (error) {
            console.log(error);
            res.json({ status: 'failed', message: error.message }).status(400);
        }
    });
};
exports.editPostController = editPostController;
