import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as fromAppStore from 'src/app/store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  private storeSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store
      .select('recipes')
      .pipe(map((recipesState) => recipesState.recipes))
      .subscribe((recipes) => (this.recipes = recipes));
  }

  onNewRecipe(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
