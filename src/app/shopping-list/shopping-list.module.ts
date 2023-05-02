import { NgModule } from '@angular/core';

import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
// import { LoggingService } from '../logging.service';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [SharedModule, FormsModule, ShoppingListRoutingModule],
  // providers: [LoggingService]
})
export class ShoppingListModule {}
