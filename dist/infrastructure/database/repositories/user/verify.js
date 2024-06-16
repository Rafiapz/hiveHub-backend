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
exports.verify = void 0;
const models_1 = require("../../models");
const verify = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userData = yield models_1.User.findOne({ email: data.email }, { otp: 1, createdAt: 1 });
        if ((_a = userData === null || userData === void 0 ? void 0 : userData.otp) === null || _a === void 0 ? void 0 : _a.createdAt) {
            const currentTime = new Date().getTime();
            const createdAt = new Date(userData.otp.createdAt).getTime();
            const difference = currentTime - createdAt;
            if (difference > 2 * 60 * 1000) {
                throw new Error('Your otp has expired . Please request a new one');
            }
        }
        else {
            throw new Error('Something went wrong');
        }
        if (((_b = userData === null || userData === void 0 ? void 0 : userData.otp) === null || _b === void 0 ? void 0 : _b.otp) !== data.otp) {
            throw new Error('Incorrect otp');
        }
        const user = yield models_1.User.findOneAndUpdate({ email: data.email, 'otp.otp': data.otp }, { isVerified: true, 'otp.otp': '' });
        if (!user) {
            throw new Error('User updation failed');
        }
        const status = yield models_1.User.findOne({ email: data.email }, { isVerified: 1 });
        if (!(status === null || status === void 0 ? void 0 : status.isVerified)) {
            throw new Error('User not verified');
        }
        return user;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.verify = verify;
