import { afterLoginService } from "./afterLoginService";
import { changeAccountStatus } from "./changeAccountStatus";
import { createUser } from "./createUser";
import { disable2Fa } from "./disable2Fa";
import { enable2Fa } from "./enable2Fa";
import { findUserByEmail } from "./findUserByEmail";
import { findUserById } from "./findUserById";
import { forgetPassword } from "./forgetPassword";
import { generate2FaSession } from "./generate2FaSession";
import { login } from "./login";
import { logoutService } from "./logoutService";
import { resendOtp } from "./resendOtp";
import { resetPassword } from "./resetPassword";
import { socialLogin } from "./socialLogin";
import { validateSession } from "./validateSession";

export const AuthServices = {
    createUser,
    login,
    findUserByEmail,
    findUserById,
    forgetPassword,
    validateSession,
    resetPassword,
    resendOtp,
    generate2FaSession,
    enable2Fa,
    disable2Fa,
    changeAccountStatus,
    socialLogin,
    afterLoginService,
    logoutService
};