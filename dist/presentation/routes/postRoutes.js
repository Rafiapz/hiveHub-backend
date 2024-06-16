"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = require("express");
const posts_1 = require("../controllers/posts/");
const multer_1 = require("../../_lib/multer");
const currentUser_1 = require("../middlewares/currentUser");
const isUserBlocked_1 = require("../middlewares/isUserBlocked");
const postRoutes = (dependencies) => {
    const { createPost, fetchAllPosts, deletePost, editPost, findUsersPost, repost } = (0, posts_1.controllers)(dependencies);
    const router = (0, express_1.Router)();
    router.route('/create-post/:type').post(currentUser_1.currentUser, multer_1.uploadSingleFile, createPost);
    router.route('/fetch-all-posts').get(currentUser_1.currentUser, fetchAllPosts);
    router.route('/delete-post').delete(currentUser_1.currentUser, deletePost);
    router.route('/edit-post/:type').put(currentUser_1.currentUser, multer_1.uploadSingleFile, editPost);
    router.route('/fetch-users-post/:id').get(currentUser_1.currentUser, isUserBlocked_1.isUserBlocked, findUsersPost);
    router.route('/repost-post').post(currentUser_1.currentUser, repost);
    return router;
};
exports.postRoutes = postRoutes;
