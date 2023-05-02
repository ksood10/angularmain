import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';

@NgModule({
  declarations: [
    AlertComponent,
    DropdownDirective,
    LoadingSpinnerComponent,
    PlaceholderDirective,
  ],
  imports: [CommonModule],
  // exports are now necessary, because we want to get
  // access to these elsewhere by importing the SharedModule
  exports: [
    AlertComponent,
    DropdownDirective,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    CommonModule,
  ],
  // Angular 9.0.0+ this is not required:
  entryComponents: [AlertComponent],
})
export class SharedModule {}
