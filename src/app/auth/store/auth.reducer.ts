import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
  loginStarted: boolean;
  loginAttempted: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
  loginStarted: false,
  loginAttempted: false,
};

// *** old syntax ***
// export function authReducer(
//   state = initialState,
//   action: AuthActions.AuthActions
// ) {
//   switch (action.type) {
//     case AuthActions.AUTHENTICATE_SUCCESS:
//       const user = new User(
//         action.payload.email,
//         action.payload.userId,
//         action.payload.token,
//         action.payload.expirationDate
//       );
//       return {
//         ...state,
//         user: user,
//         authError: null,
//         loading: false,
//       };
//     case AuthActions.LOGOUT:
//       return {
//         ...state,
//         user: null,
//       };
//     case AuthActions.SIGNUP_START:
//     case AuthActions.LOGIN_START:
//       return {
//         ...state,
//         authError: null,
//         loading: true,
//       };
//     case AuthActions.AUTHENTICATE_FAIL:
//       return {
//         ...state,
//         user: null,
//         authError: action.payload,
//         loading: false,
//       };
//     case AuthActions.CLEAR_ERROR:
//       return {
//         ...state,
//         authError: null,
//       };
//     default:
//       return state;
//   }
// }

// *** new syntax ***
export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.authenticateSuccess,
    (state, { email, userId, token, expirationDate }) => {
      const user = new User(email, userId, token, expirationDate);
      return {
        ...state,
        user,
        authError: null,
        loading: false,
        loginStarted: false,
        loginAttempted: true,
      };
    }
  ),
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    loginStarted: false,
    loginAttempted: false,
  })),
  on(AuthActions.loginStart, AuthActions.signupStart, (state) => ({
    ...state,
    authError: null,
    loading: true,
    loginStarted: true,
    loginAttempted: false,
  })),
  on(AuthActions.authenticateFail, (state, { error }) => ({
    ...state,
    user: null,
    authError: error,
    loading: false,
    loginStarted: false,
    loginAttempted: true,
  })),
  on(AuthActions.clearError, (state) => ({
    ...state,
    authError: null,
  })),
  on(AuthActions.autoLoginStart, (state) => ({
    ...state,
    loginStarted: true,
    loginAttempted: false,
  })),
  on(AuthActions.autoLoginFail, (state) => ({
    ...state,
    loginStarted: false,
    loginAttempted: true,
  }))
);
