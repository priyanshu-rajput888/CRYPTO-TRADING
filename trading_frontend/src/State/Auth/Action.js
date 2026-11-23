
import axios from "axios";
import {
    GET_USER_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    LOGIN_TWO_STEP_FAILURE,
    LOGIN_TWO_STEP_REQUIRED,
    LOGIN_TWO_STEP_REQUEST,
    LOGIN_TWO_STEP_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    SEND_RESET_PASSWORD_FAILURE,
    SEND_RESET_PASSWORD_REQUEST,
    SEND_RESET_PASSWORD_SUCCESS,
    VERIFY_RESET_PASSWORD_FAILURE,
    VERIFY_RESET_PASSWORD_REQUEST,
    VERIFY_RESET_PASSWORD_SUCCESS
} from "./ActionType";

export const register = (userData) => async (dispatch) => {

    dispatch({ type: REGISTER_REQUEST });

    const baseUrl = "http://localhost:5454";

    try {
        const response = await axios.post(
            `${baseUrl}/auth/signup`,
            userData
        );

        const user = response.data;
        console.log(user);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: user.jwt
        });

        localStorage.setItem("jwt", user.jwt)

    } catch (error) {
        dispatch({
            type: REGISTER_FAILURE,
            payload: error.message
        });

        console.log(error);
    }
};

export const login = (userData) => async (dispatch) => {

    dispatch({ type: LOGIN_REQUEST });

    const baseUrl = "http://localhost:5454";

    try {
        const response = await axios.post(
            `${baseUrl}/auth/signin`,
            userData.data
        );

        const user = response.data;
        if (user.twoFactorAuthEnabled) {
            dispatch({type: LOGIN_TWO_STEP_REQUIRED});
            return {twoFactorRequired: true, session: user.session};
        }

        dispatch({
            type: LOGIN_SUCCESS,
            payload: user.jwt
        });

        localStorage.setItem("jwt", user.jwt)
        userData.navigate("/")
        return {success: true};

    } catch (error) {
        const message = error.response?.status === 401
            ? "Email or password is incorrect."
            : error.response?.data?.message ?? error.response?.data?.detail ?? error.message;
        dispatch({
            type: LOGIN_FAILURE,
            payload: message
        });

        return {error: message};
    }
};

export const verifyTwoFactorOtp = ({session, otp, navigate}) => async (dispatch) => {
    dispatch({type: LOGIN_TWO_STEP_REQUEST});

    try {
        const baseUrl = "http://localhost:5454";
        const response = await axios.post(
            `${baseUrl}/auth/two-factor/otp`,
            {id: session, otp}
        );
        const jwt = response.data.jwt;

        dispatch({type: LOGIN_TWO_STEP_SUCCESS, payload: jwt});
        localStorage.setItem("jwt", jwt);
        navigate("/");
        return {success: true};
    } catch (error) {
        const message = error.response?.data?.message ?? error.message;
        dispatch({type: LOGIN_TWO_STEP_FAILURE, payload: message});
        return {error: message};
    }
};

export const sendResetPasswordOtp = (email) => async (dispatch) => {
    dispatch({type: SEND_RESET_PASSWORD_REQUEST});

    try {
        const baseUrl = "http://localhost:5454";
        const response = await axios.post(
            `${baseUrl}/auth/users/reset-password/send-otp`,
            {sendTo: email, verificationType: "EMAIL"}
        );
        const session = response.data.session;
        dispatch({type: SEND_RESET_PASSWORD_SUCCESS, payload: session});
        return {session};
    } catch (error) {
        const message = error.response?.data?.message ??
            error.response?.data?.detail ??
            error.message;
        dispatch({type: SEND_RESET_PASSWORD_FAILURE, payload: message});
        return {error: message};
    }
};

export const resetPassword = ({id, otp, password}) => async (dispatch) => {
    dispatch({type: VERIFY_RESET_PASSWORD_REQUEST});

    try {
        const baseUrl = "http://localhost:5454";
        await axios.patch(
            `${baseUrl}/auth/users/reset-password/verify-otp`,
            {id, otp, password}
        );
        dispatch({type: VERIFY_RESET_PASSWORD_SUCCESS});
        return {success: true};
    } catch (error) {
        const message = error.response?.data?.message ??
            error.response?.data?.detail ??
            error.message;
        dispatch({type: VERIFY_RESET_PASSWORD_FAILURE, payload: message});
        return {error: message};
    }
};

export const getUser = (jwt) => async (dispatch) => {
    if (!jwt) {
        return;
    }

    dispatch({ type: GET_USER_REQUEST });

    const baseUrl = "http://localhost:5454";

    try {
        const response = await axios.get(
            `${baseUrl}/api/users/profile`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );

        const user = response.data;
        console.log(user);

        dispatch({
            type: GET_USER_SUCCESS,
            payload: user
        });

    } catch (error) {
        dispatch({
            type: GET_USER_FAILURE,
            payload: error.message
        });

        console.log(error);
    }
};

export const logout = () => (dispatch) => {
    localStorage.clear();
    dispatch({type : LOGOUT})
}  