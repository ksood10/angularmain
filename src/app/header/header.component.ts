import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromAppStore from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/auth/store/auth.actions';
import * as RecipesActions from 'src/app/recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private store: Store<fromAppStore.AppState>) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData(): void {
    // *** old syntax ***
    // this.store.dispatch(new RecipesActions.StoreRecipes());
    // *** new syntax ***
    this.store.dispatch(RecipesActions.storeRecipes());
  }

  onFetchData(): void {
    // *** old syntax ***
    // this.store.dispatch(new RecipesActions.FetchRecipes());
    // *** new syntax ***
    this.store.dispatch(RecipesActions.fetchRecipes());
  }

  onLogout(): void {
    // *** old syntax ***
    // this.store.dispatch(new AuthActions.Logout());
    // *** new syntax ***
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
