import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAppStore from 'src/app/store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromAppStore.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      // *** old syntax ***
      // this.store.dispatch(AuthActions.Logout());
      // *** new syntax ***
      this.store.dispatch(AuthActions.logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
