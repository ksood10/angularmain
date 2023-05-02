import { Action, createAction, props } from '@ngrx/store';

// *** old syntax ***
// export const LOGIN_START = '[Auth] Login Start';
// export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
// export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
// export const SIGNUP_START = '[Auth] Signup Start';
// export const LOGOUT = '[Auth] Logout';
// export const CLEAR_ERROR = '[Auth] Clear Error';
// export const AUTO_LOGIN = '[Auth] Auto Login';

// export class AuthenticateSuccess implements Action {
//   readonly type = AUTHENTICATE_SUCCESS;

//   constructor(
//     public payload: {
//       email: string;
//       userId: string;
//       token: string;
//       expirationDate: Date;
//       redirect: boolean;
//     }
//   ) {}
// }

// export class Logout implements Action {
//   readonly type = LOGOUT;
// }

// export class LoginStart implements Action {
//   readonly type = LOGIN_START;

//   constructor(public payload: { email: string; password: string }) {}
// }

// export class AuthenticateFail implements Action {
//   readonly type = AUTHENTICATE_FAIL;

//   constructor(public payload: string) {}
// }

// export class SignupStart implements Action {
//   readonly type = SIGNUP_START;

//   constructor(public payload: { email: string; password: string }) {}
// }

// export class ClearError implements Action {
//   readonly type = CLEAR_ERROR;
// }

// export class AutoLogin implements Action {
//   readonly type = AUTO_LOGIN;
// }

// export type AuthActions =
//   | AuthenticateSuccess
//   | Logout
//   | LoginStart
//   | AuthenticateFail
//   | SignupStart
//   | ClearError
//   | AutoLogin;

// *** new syntax ***
export const authenticateSuccess = createAction(
  '[Auth] Authenticate Success',
  props<{
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
  }>()
);

export const logout = createAction('[Auth] Logout');

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);

export const authenticateFail = createAction(
  '[Auth] Authenticate Fail',
  props<{ error: string }>()
);

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{ email: string; password: string }>()
);

export const clearError = createAction('[Auth] Clear Error');

export const autoLoginStart = createAction('[Auth] Auto Login Start');

export const autoLoginFail = createAction('[Auth] Auto Login Fail');
