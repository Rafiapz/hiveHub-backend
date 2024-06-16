import { Router } from "express";
import { IDependencies } from "../../application/interface/user/IDependencies";
import { controllers } from "../controllers/user";
import passport from "passport";
import { currentUser } from "../middlewares/currentUser";
import { uploadSingleFile } from "../../_lib/multer";
import { validatePassword } from "../../_lib/bcrypt";
import { isUserBlocked } from "../middlewares/isUserBlocked";

export const authRoutes = (dependencies: IDependencies) => {
    const {
        signup,
        verify,
        login,
        updateOtp,
        googleAuth,
        logout,
        fetchUser,
        editProfile,
        findAllUsers,
        resetPasswordVerification,
        changePassword,
        fetchOtherUser,
        editEmailVerifyandUpdate,
        blockOtherUser,
        unblockOtherUser,
        isUserBlockedController

    } = controllers(dependencies);

    const router = Router();

    router.use(passport.initialize());

    router.use(passport.session());

    router.route("/signup").post(signup);

    router.route("/otp-verification").post(verify);

    router.route("/login").post(login);

    router.route("/fetch-user").get(fetchUser);

    router.route("/resend-otp").get(updateOtp);

    router.route("/google").post(googleAuth);

    router.route("/logout").get(currentUser, logout);

    router.route("/edit-user-images/:type").post(currentUser, uploadSingleFile, editProfile);

    router.route("/edit-user-profile").post(currentUser, editProfile);

    router.route("/verify-email-update-otp").put(currentUser, editEmailVerifyandUpdate);

    router.route("/edit-user-password").post(validatePassword, currentUser, editProfile);

    router.route("/fetch-all-users").get(currentUser, findAllUsers);

    router.route("/send-confirmation-email-reset-password/:email").get(resetPasswordVerification);

    router.route("/change-password").post(changePassword);

    router.route('/block-another-user').put(currentUser, blockOtherUser)

    router.route('/unblock-another-user').put(currentUser, unblockOtherUser)

    router.route('/is-user-blocked/:id').get(currentUser, isUserBlockedController)

    router.route("/fetch-other-user").get(currentUser, fetchOtherUser);

    router.get("/failure", (req, res) => {
        console.log("called failure");

        res.send("failure");
    });

    return router;
};
