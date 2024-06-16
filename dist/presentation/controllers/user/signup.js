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
exports.signupController = void 0;
const bcrypt_1 = require("../../../_lib/bcrypt");
const otp_1 = require("../../../_lib/otp");
const signupController = (dependencies) => {
    const { useCases: { createUserUseCase } } = dependencies;
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let data = req.body;
            data.isActive = true;
            data.role = 'user';
            data.isVerified = false;
            data.password = yield (0, bcrypt_1.passwordHashing)(data.password);
            data.createdAt = Date.now();
            data.otp = (0, otp_1.generateOtp)(data.email);
            data.profilePhoto = `${process === null || process === void 0 ? void 0 : process.env.BACK_END_URL}/api/image/user/no-profile.webp`;
            data.coverPhoto = `${process === null || process === void 0 ? void 0 : process.env.BACK_END_URL}/api/image/user/no-coverphoto.jpg`;
            console.log(data);
            const user = yield createUserUseCase(dependencies).execute(data);
            if (user) {
                res.status(200).json({ status: 'ok' });
            }
            else {
                throw new Error('failed to create account');
            }
        }
        catch (error) {
            res.status(400).json({ status: 'failed', message: error.message });
            console.log(error);
        }
    });
};
exports.signupController = signupController;
