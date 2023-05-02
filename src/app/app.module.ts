import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import * as fromAppStore from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { environment } from 'src/environments/environment';
import { RecipesEffects } from './recipes/store/recipes.effects';
// import { LoggingService } from './logging.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  // make sure you remove imports of lazy-loaded modules from here
  imports: [
    // ng-universal: use server-rendered app to transition into the browser version
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    StoreModule.forRoot(fromAppStore.appReducer),
    EffectsModule.forRoot([AuthEffects, RecipesEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
  // providers: [LoggingService]
})
export class AppModule {}
