import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_REQUEST, LOGIN_TWO_STEP_REQUEST, LOGIN_TWO_STEP_REQUIRED, LOGIN_TWO_STEP_SUCCESS, LOGIN_TWO_STEP_FAILURE, GET_USER_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, GET_USER_FAILURE, GET_USER_SUCCESS, SEND_RESET_PASSWORD_FAILURE, SEND_RESET_PASSWORD_REQUEST, SEND_RESET_PASSWORD_SUCCESS, VERIFY_RESET_PASSWORD_FAILURE, VERIFY_RESET_PASSWORD_REQUEST, VERIFY_RESET_PASSWORD_SUCCESS, LOGOUT } from "./ActionType";

const initialState = {
    user:null,
    loading:false,
    error:null,
    jwt:null,
    resetPasswordLoading:false,
    resetPasswordError:null,
    resetPasswordSession:null,
    resetPasswordComplete:false
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case LOGIN_TWO_STEP_REQUEST:
        case GET_USER_REQUEST:
            return{...state, loading:true, error:null}

        case LOGIN_TWO_STEP_REQUIRED:
            return {...state, loading:false, error:null}

        case SEND_RESET_PASSWORD_REQUEST:
        case VERIFY_RESET_PASSWORD_REQUEST:
            return {
                ...state,
                resetPasswordLoading:true,
                resetPasswordError:null,
                resetPasswordComplete:false
            }

        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
        case LOGIN_TWO_STEP_SUCCESS:
            return {...state, loading:false, error:null, jwt:action.payload}
            
        case GET_USER_SUCCESS:
            return {...state, user:action.payload, loading:false, error:null}

        case SEND_RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPasswordLoading:false,
                resetPasswordError:null,
                resetPasswordSession:action.payload
            }

        case VERIFY_RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPasswordLoading:false,
                resetPasswordError:null,
                resetPasswordSession:null,
                resetPasswordComplete:true
            }

        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case LOGIN_TWO_STEP_FAILURE:
        case GET_USER_FAILURE:
            return {...state, loading:false, error:action.payload}

        case SEND_RESET_PASSWORD_FAILURE:
        case VERIFY_RESET_PASSWORD_FAILURE:
            return {
                ...state,
                resetPasswordLoading:false,
                resetPasswordError:action.payload
            }

        case LOGOUT:
            return initialState

        default:
            return state; 
    }
}

export default authReducer;