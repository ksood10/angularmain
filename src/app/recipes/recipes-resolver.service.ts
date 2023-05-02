import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAppStore from 'src/app/store/app.reducer';
import * as RecipesActions from './store/recipes.actions';
import { Actions, ofType } from '@ngrx/effects';

// @Injectable({
//   providedIn: 'root',
// })
// export class RecipesResolverService implements Resolve<Recipe[]> {
//   constructor(
//     private store: Store<fromAppStore.AppState>,
//     private actions$: Actions
//   ) {}

//   resolve(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
//     return this.store.select('recipes').pipe(
//       take(1),
//       map((recipesState) => recipesState.recipes),
//       switchMap((recipes) => {
//         if (recipes.length === 0) {
//           // *** old syntax ***
//           // store.dispatch(new RecipesActions.FetchRecipes());
//           // return actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
//           // *** new syntax ***
//           this.store.dispatch(RecipesActions.fetchRecipes());
//           return this.actions$.pipe(
//             ofType(RecipesActions.setRecipes),
//             take(1),
//             map((setRecipesAction) => setRecipesAction.recipes)
//           );
//         } else {
//           return of(recipes);
//         }
//       })
//     );
//   }
// }

export const recipesResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store: Store<fromAppStore.AppState> = inject(Store);
  const actions$ = inject(Actions);
  return store.select('recipes').pipe(
    take(1),
    map((recipesState) => recipesState.recipes),
    switchMap((recipes) => {
      if (recipes.length === 0) {
        // *** old syntax ***
        // store.dispatch(new RecipesActions.FetchRecipes());
        // return actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
        // *** new syntax ***
        store.dispatch(RecipesActions.fetchRecipes());
        return actions$.pipe(
          ofType(RecipesActions.setRecipes),
          take(1),
          map((setRecipesAction) => setRecipesAction.recipes)
        );
      } else {
        return of(recipes);
      }
    })
  );
};
