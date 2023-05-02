import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromAppStore from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

export type CurrentTab = 'shopping-list' | 'recipes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromAppStore.AppState>,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit(): void {
    // *** this check is needed because autoLogin needs access
    // to localStorage, which is only available in the browser ***
    if (isPlatformBrowser(this.platformId)) {
      // *** old syntax ***
      // this.store.dispatch(new AuthActions.AutoLogin());
      // *** new syntax ***
      this.store.dispatch(AuthActions.autoLoginStart());
    }
  }
}
