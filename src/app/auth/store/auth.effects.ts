import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as AuthActions from './auth.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  // *** old syntax ***
  // return new AuthActions.AuthenticateSuccess({
  //   email,
  //   userId,
  //   token,
  //   expirationDate,
  // });
  // *** new syntax ***
  return AuthActions.authenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true,
  });
};

const handleError = (errorRes: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    // *** old syntax ***
    // return of(new AuthActions.AuthenticateFail(errorMessage));
    // *** new syntax ***
    return of(AuthActions.authenticateFail({ error: errorMessage }));
  }
  switch (errorRes.error.error.message) {
    // common signup errors:
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage =
        'You have tried too many times in a short while. Try again later!';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Sign up with email and password is disabled';
      break;
    // common login errors:
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
    case 'USER_DISABLED':
      errorMessage = 'This user has been disabled.';
      break;
  }
  // *** old syntax ***
  // return of(new AuthActions.AuthenticateFail(errorMessage));
  // *** new syntax ***
  return of(AuthActions.authenticateFail({ error: errorMessage }));
};

@Injectable()
export class AuthEffects {
  // *** old, removed syntax ***
  // @Effect()
  // authLogin = this.actions$.pipe(
  //   ofType(AuthActions.LOGIN_START),
  //   switchMap((authData: AuthActions.LoginStart) => {
  //     return this.http
  //       .post<AuthResponseData>(
  //         'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  //           environment.firebaseAPIKey,
  //         {
  //           email: authData.payload.email,
  //           password: authData.payload.password,
  //           returnSecureToken: true,
  //         }
  //       )
  //       .pipe(
  //         map((resData) => {
  //           const expirationDate = new Date(
  //             new Date().getTime() + +resData.expiresIn * 1000
  //           );
  //           return new AuthActions.Login({
  //             email: resData.email,
  //             userId: resData.localId,
  //             token: resData.idToken,
  //             expirationDate: expirationDate,
  //           });
  //         }),
  //         catchError((error) => {
  //           return of();
  //         })
  //       );
  //   })
  // );

  // *** new syntax with createEffect ***
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      // *** old actions syntax ***
      // ofType(AuthActions.LOGIN_START),
      // switchMap((authData: AuthActions.LoginStart) => {
      //   return this.http
      //     .post<AuthResponseData>(
      //       'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
      //         environment.firebaseAPIKey,
      //       {
      //         email: authData.payload.email,
      //         password: authData.payload.password,
      //         returnSecureToken: true,
      //       }
      //     )
      //     .pipe(
      //       map((resData) =>
      //         handleAuthentication(
      //           +resData.expiresIn,
      //           resData.email,
      //           resData.localId,
      //           resData.idToken
      //         )
      //       ),
      //       catchError((errorRes) => handleError(errorRes))
      //     );
      // })
      // *** new actions syntax ***
      ofType(AuthActions.loginStart),
      switchMap((authData) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
              environment.firebaseAPIKey,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) =>
              this.authService.setLogoutTimer(+resData.expiresIn * 1000)
            ),
            map((resData) =>
              handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              )
            ),
            catchError((errorRes) => handleError(errorRes))
          );
      })
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        // *** old syntax ***
        // ofType(AuthActions.AUTHENTICATE_SUCCESS),
        // tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
        //   if (authSuccessAction.payload.redirect) {
        //     this.router.navigate(['/']);
        //   }
        // })
        // *** new syntax ***
        ofType(AuthActions.authenticateSuccess),
        tap((authSuccessAction) => {
          if (authSuccessAction.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      // *** old syntax ***
      // ofType(AuthActions.SIGNUP_START),
      // switchMap((signupAction: AuthActions.SignupStart) => {
      //   return this.http
      //     .post<AuthResponseData>(
      //       'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
      //         environment.firebaseAPIKey,
      //       {
      //         email: signupAction.payload.email,
      //         password: signupAction.payload.password,
      //         returnSecureToken: true,
      //       }
      //     )
      //     .pipe(
      //       map((resData) =>
      //         handleAuthentication(
      //           +resData.expiresIn,
      //           resData.email,
      //           resData.localId,
      //           resData.idToken
      //         )
      //       ),
      //       catchError((errorRes) => handleError(errorRes))
      //     );
      // })
      // *** new syntax ***
      ofType(AuthActions.signupStart),
      switchMap((signupAction) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
              environment.firebaseAPIKey,
            {
              email: signupAction.email,
              password: signupAction.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) =>
              this.authService.setLogoutTimer(+resData.expiresIn * 1000)
            ),
            map((resData) =>
              handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              )
            ),
            catchError((errorRes) => handleError(errorRes))
          );
      })
    )
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        // *** old syntax ***
        // ofType(AuthActions.LOGOUT),
        // *** new syntax ***
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      // *** old syntax ***
      // ofType(AuthActions.AUTO_LOGIN),
      // *** new syntax ***
      ofType(AuthActions.autoLoginStart),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return AuthActions.autoLoginFail();
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          // *** old syntax ***
          // return new AuthActions.AuthenticateSuccess({
          //   email: loadedUser.email,
          //   userId: loadedUser.id,
          //   token: loadedUser.token,
          //   expirationDate: new Date(userData._tokenExpirationDate),
          // });
          // *** new syntax ***
          return AuthActions.authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        }
        return AuthActions.autoLoginFail();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
