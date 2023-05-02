import { Action, createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

// *** old syntax ***
// export const SET_RECIPES = '[Recipes] Set Recipes';
// export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
// export const STORE_RECIPES = '[Recipes] Store Recipes';
// export const ADD_RECIPE = '[Recipes] Add Recipe';
// export const UPDATE_RECIPE = '[Recipes] Update Recipe';
// export const DELETE_RECIPE = '[Recipes] Delete Recipe';

// export class SetRecipes implements Action {
//   readonly type = SET_RECIPES;

//   constructor(public payload: Recipe[]) {}
// }

// export class FetchRecipes implements Action {
//   readonly type = FETCH_RECIPES;
// }

// export class StoreRecipes implements Action {
//   readonly type = STORE_RECIPES;
// }

// export class AddRecipe implements Action {
//   readonly type = ADD_RECIPE;

//   constructor(public payload: Recipe) {}
// }

// export class UpdateRecipe implements Action {
//   readonly type = UPDATE_RECIPE;

//   constructor(public payload: { index: number; newRecipe: Recipe }) {}
// }

// export class DeleteRecipe implements Action {
//   readonly type = DELETE_RECIPE;

//   constructor(public payload: number) {}
// }

// export type RecipesActions =
//   | SetRecipes
//   | FetchRecipes
//   | StoreRecipes
//   | AddRecipe
//   | UpdateRecipe
//   | DeleteRecipe;

// *** new syntax ***
export const setRecipes = createAction(
  '[Recipes] Set Recipes',
  props<{ recipes: Recipe[] }>()
);

export const fetchRecipes = createAction('[Recipes] Fetch Recipes');

export const storeRecipes = createAction('[Recipes] Store Recipes');

export const addRecipe = createAction(
  '[Recipes] Add Recipe',
  props<{ recipe: Recipe }>()
);

export const updateRecipe = createAction(
  '[Recipes] Update Recipe',
  props<{ index: number; newRecipe: Recipe }>()
);

export const deleteRecipe = createAction(
  '[Recipes] Delete Recipe',
  props<{ index: number }>()
);
