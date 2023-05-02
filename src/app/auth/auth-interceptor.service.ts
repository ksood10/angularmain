import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, map, take } from 'rxjs';
import * as fromAppStore from 'src/app/store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromAppStore.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      // take(1) takes the latest value from the observable and immediately unsubscribes
      take(1),
      map((authState) => authState.user),
      // here exhaustMap subscribes to an outer observable (user) and executes a mapping function
      // that returns an inner observable (http request); it passes down the combined signal when
      // both observables complete
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
