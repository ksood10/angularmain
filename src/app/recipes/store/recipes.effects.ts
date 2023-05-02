import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';
import * as fromAppStore from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipesEffects {
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      // *** old syntax ***
      // ofType(RecipesActions.FETCH_RECIPES),
      // *** new syntax ***
      ofType(RecipesActions.fetchRecipes),
      switchMap(() => {
        return this.http
          .get<Recipe[]>(
            'https://udemy-angular-project-d838f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
          )
          .pipe(
            // set the ingredients to an empty array if it doesn't exist
            map((recipes) => {
              return recipes.map((recipe) => {
                return {
                  ...recipe,
                  ingredients: recipe.ingredients ? recipe.ingredients : [],
                };
              });
            }),
            map((recipes) => {
              // *** old syntax ***
              // return new RecipesActions.SetRecipes(recipes);
              // *** new syntax ***
              return RecipesActions.setRecipes({ recipes });
            })
          );
      })
    )
  );

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        // *** old syntax ***
        // ofType(RecipesActions.STORE_RECIPES),
        // *** new syntax ***
        ofType(RecipesActions.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([_, recipesState]) => {
          return this.http.put(
            'https://udemy-angular-project-d838f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipesState.recipes
          );
        })
      ),
    { dispatch: false }
  );

  // *** my solution ***
  // storeRecipes$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(RecipesActions.STORE_RECIPES),
  //       switchMap(() => {
  //         return this.store.select('recipes').pipe(
  //           map((recipesState) => {
  //             return this.http
  //               .put(
  //                 'https://udemy-angular-project-d838f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
  //                 recipesState.recipes
  //               )
  //               .subscribe((response: HttpResponse<Recipe[]>) => {
  //                 if (response.status === 200) {
  //                   console.log(response);
  //                 }
  //               });
  //           })
  //         );
  //       })
  //     ),
  //   { dispatch: false }
  // );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromAppStore.AppState>
  ) {}
}
