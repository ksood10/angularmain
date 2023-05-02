import { createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';

export interface State {
  recipes: Recipe[];
  loading: boolean;
  recipesError: string;
}

const initialState: State = {
  recipes: [],
  loading: false,
  recipesError: null,
};

// *** old syntax ***
// export function recipesReducer(
//   state = initialState,
//   action: RecipesActions.RecipesActions
// ) {
//   switch (action.type) {
//     case RecipesActions.SET_RECIPES:
//       return {
//         ...state,
//         recipes: [...action.payload],
//       };
//     case RecipesActions.ADD_RECIPE:
//       return {
//         ...state,
//         recipes: [...state.recipes, action.payload],
//       };
//     case RecipesActions.UPDATE_RECIPE:
//       const updatedRecipes = [...state.recipes];
//       updatedRecipes[action.payload.index] = action.payload.newRecipe;
//       return {
//         ...state,
//         recipes: updatedRecipes,
//       };
//     case RecipesActions.DELETE_RECIPE:
//       return {
//         ...state,
//         recipes: state.recipes.filter((_, idx) => idx != action.payload),
//       };

//     default:
//       return state;
//   }
// }

// *** new syntax ***
export const recipesReducer = createReducer(
  initialState,
  on(RecipesActions.setRecipes, (state, { recipes }) => ({
    ...state,
    recipes: [...recipes],
  })),
  on(RecipesActions.addRecipe, (state, { recipe }) => ({
    ...state,
    recipes: [...state.recipes, recipe],
  })),
  on(RecipesActions.updateRecipe, (state, { index, newRecipe }) => {
    const updatedRecipes = [...state.recipes];
    updatedRecipes[index] = newRecipe;
    return {
      ...state,
      recipes: updatedRecipes,
    };
  }),
  on(RecipesActions.deleteRecipe, (state, { index }) => ({
    ...state,
    recipes: state.recipes.filter((_, idx) => idx != index),
  }))
);
