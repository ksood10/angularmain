import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as fromAppStore from 'src/app/store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.id = +params['id'];
          return this.store
            .select('recipes')
            .pipe(map((recipesState) => recipesState.recipes[this.id]));
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList(): void {
    // *** old syntax ***
    // this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
    // *** new syntax ***
    this.store.dispatch(
      ShoppingListActions.addIngredients({
        ingredients: this.recipe.ingredients,
      })
    );
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe(): void {
    // *** old syntax ***
    // this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    // *** new syntax ***
    this.store.dispatch(RecipesActions.deleteRecipe({ index: this.id }));
    this.router.navigate(['recipes']);
  }
}
