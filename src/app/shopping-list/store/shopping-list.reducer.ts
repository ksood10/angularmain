import { createReducer, on } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

// *** old Redux-like syntax ***
// export function shoppingListReducer(
//   state: State = initialState,
//   action: ShoppingListActions.ShoppingListActions
// ) {
//   switch (action.type) {
//     case ShoppingListActions.ADD_INGREDIENT:
//       return {
//         ...state,
//         ingredients: [...state.ingredients, action.payload],
//       };
//     case ShoppingListActions.ADD_INGREDIENTS:
//       return {
//         ...state,
//         ingredients: [...state.ingredients, ...action.payload],
//       };
//     case ShoppingListActions.UPDATE_INGREDIENT:
//       const ingredient = state.ingredients[state.editedIngredientIndex];
//       const updatedIngredient = {
//         ...ingredient,
//         ...action.payload,
//       };
//       const updatedIngredients = [...state.ingredients];
//       updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

//       return {
//         ...state,
//         ingredients: updatedIngredients,
//         editedIngredientIndex: -1,
//         editedIngredient: null,
//       };
//     case ShoppingListActions.DELETE_INGREDIENT:
//       return {
//         ...state,
//         ingredients: state.ingredients.filter(
//           (_, index) => index != state.editedIngredientIndex
//         ),
//         editedIngredientIndex: -1,
//         editedIngredient: null,
//       };
//     case ShoppingListActions.START_EDIT:
//       return {
//         ...state,
//         editedIngredientIndex: action.payload,
//         editedIngredient: { ...state.ingredients[action.payload] },
//       };
//     case ShoppingListActions.STOP_EDIT:
//       return {
//         ...state,
//         editedIngredientIndex: -1,
//         editedIngredient: null,
//       };

//     default:
//       return state;
//   }
// }

// *** new syntax for ngrx ***
export const shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, { ingredient }) => ({
    ...state,
    ingredients: [...state.ingredients, ingredient],
  })),
  on(ShoppingListActions.addIngredients, (state, { ingredients }) => ({
    ...state,
    ingredients: [...state.ingredients, ...ingredients],
  })),
  on(ShoppingListActions.updateIngredient, (state, { ingredient }) => {
    const updatedIngredient = {
      ...state.ingredients[state.editedIngredientIndex],
      ...ingredient,
    };
    const updatedIngredients = [...state.ingredients];
    updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

    return {
      ...state,
      editedIngredientIndex: -1,
      editedIngredient: null,
      ingredients: updatedIngredients,
    };
  }),
  on(ShoppingListActions.deleteIngredient, (state) => ({
    ...state,
    ingredients: state.ingredients.filter(
      (_, index) => index != state.editedIngredientIndex
    ),
  })),
  on(ShoppingListActions.startEdit, (state, { index }) => ({
    ...state,
    editedIngredientIndex: index,
    editedIngredient: { ...state.ingredients[index] },
  })),
  on(ShoppingListActions.stopEdit, (state) => ({
    ...state,
    editedIngredientIndex: -1,
    editedIngredient: null,
  }))
);
