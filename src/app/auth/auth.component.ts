import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromAppStore from 'src/app/store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  // this will find the first occurrence of the PlaceholderDirective type
  // in the template
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    // *** old syntax ***
    // if (this.isLoginMode) {
    //   this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    // } else {
    //   this.store.dispatch(new AuthActions.SignupStart({ email, password }));
    // }
    // *** new syntax ***
    if (this.isLoginMode) {
      this.store.dispatch(AuthActions.loginStart({ email, password }));
    } else {
      this.store.dispatch(AuthActions.signupStart({ email, password }));
    }

    form.reset();
  }

  onHandleError() {
    // *** old syntax ***
    // this.store.dispatch(new AuthActions.ClearError());
    // *** new syntax ***
    this.store.dispatch(AuthActions.clearError());
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    // we need a to use a custom directive
    // to expose a ViewContainerRef on the hosting element
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    // the above createComponent use is deprecated,
    // now you can pass a Component class directly:
    // const componentRef = hostViewContainerRef.createComponent(AlertComponent);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
