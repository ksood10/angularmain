import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAppStore from 'src/app/store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
    // *** my alternative solution to setting the form ***
    // this.route.params
    //   .pipe(
    //     switchMap((params: Params) => {
    //       this.id = +params['id'];
    //       this.editMode = params['id'] != null;
    //       return this.store.select('recipes').pipe(
    //         map((recipesState) => {
    //           return recipesState.recipes[this.id];
    //         })
    //       );
    //     })
    //   )
    //   .subscribe((recipe) => {
    //     this.initForm(recipe);
    //   });
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // );
    if (this.editMode) {
      // *** old syntax ***
      // this.store.dispatch(
      //   new RecipesActions.UpdateRecipe({
      //     index: this.id,
      //     newRecipe: this.recipeForm.value,
      //   })
      // );
      // *** new syntax ***
      this.store.dispatch(
        RecipesActions.updateRecipe({
          index: this.id,
          newRecipe: this.recipeForm.value,
        })
      );

      // this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      // *** old syntax ***
      // this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
      // *** new syntax ***
      this.store.dispatch(
        RecipesActions.addRecipe({ recipe: this.recipeForm.value })
      );

      // this.router.navigate(
      //   ['../', (this.recipeService.getRecipes().length - 1).toString()],
      //   { relativeTo: this.route }
      // );
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store
        .select('recipes')
        .pipe(
          map((recipesState) =>
            recipesState.recipes.find((recipe, index) => {
              return index === this.id;
            })
          )
        )
        .subscribe((recipe) => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe['ingredients']) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  'name': new FormControl(ingredient.name, Validators.required),
                  'amount': new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            }
          }
        });
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients,
    });
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
