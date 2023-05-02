import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromAppStore from 'src/app/store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  storeSub: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromAppStore.AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('shoppingList').subscribe((stateData) => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // *** old syntax ***
      // this.store.dispatch(
      //   new ShoppingListActions.UpdateIngredient(newIngredient)
      // );
      // *** new syntax ***
      this.store.dispatch(
        ShoppingListActions.updateIngredient({
          ingredient: newIngredient,
        })
      );
    } else {
      // *** old syntax ***
      // this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
      // *** new syntax ***
      this.store.dispatch(
        ShoppingListActions.addIngredient({ ingredient: newIngredient })
      );
    }
    form.reset();
    this.editMode = false;
  }

  onDelete() {
    // *** old syntax ***
    // this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    // *** new syntax ***
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    // *** old syntax ***
    // this.store.dispatch(new ShoppingListActions.StopEdit());
    // *** new syntax ***
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    // *** old syntax ***
    // this.store.dispatch(new ShoppingListActions.StopEdit());
    // *** new syntax ***
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
