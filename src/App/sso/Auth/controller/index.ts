import { disable2Fa } from './disable2Fa';
import { enable2Fa } from './enable2Fa';
import { forgetPassword } from './forgetPassword';
import { generate2FaSession } from './generate2FaSession';
import { login } from './login';
import { logout } from './logout';
import { register } from './register';
import { resendOtp } from './resendOtp';
import { resetPassword } from './resetPassword';
import { socialLogin } from './socialLogin';
import { validateSession } from './validateSession';


export const AuthController = {
    register,
    login,
    forgetPassword,
    resetPassword,
    resendOtp,
    validateSession,
    generate2FaSession,
    enable2Fa,
    disable2Fa,
    socialLogin,
    logout
}