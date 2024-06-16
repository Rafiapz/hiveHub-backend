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
exports.updateOne = void 0;
const models_1 = require("../../models");
const updateOne = (query, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOneAndUpdate({ email: query.email }, data);
        return user;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.updateOne = updateOne;
// const task = cron.schedule('0 */2 * * *', async () => {
//     try {
//         let sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);
//         const users = await User.find({
//             createdAt: { $lt: sevenDaysAgo }
//         })
//         users.forEach(async (ob: any) => {
//             await User.deleteOne({ _id: ob?._id })
//         })
//     } catch (error) {
//         console.log(error);
//     }
// });
// task.start();
