import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromAppStore from 'src/app/store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;
  constructor(private store: Store<fromAppStore.AppState>) {}

  ngOnInit(): void {
    this.ingredients$ = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    // *** old syntax ***
    // this.store.dispatch(new ShoppingListActions.StartEdit(index));
    // *** new syntax ***
    this.store.dispatch(ShoppingListActions.startEdit({ index }));
  }
}
