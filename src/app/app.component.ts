import {Component, inject, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import { AppState } from './reducers';
import { authFeatureKey } from './auth/reducers';
import { AuthActions } from './auth/action-types';
import { isLoggedIn, isLoggedOut } from './auth/auth.selectors';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {

    loading = true;

    store = inject(Store<AppState>);
    // isLoggedIn$: Observable<boolean> = this.store.pipe(
    //   select(authFeatureKey),
    //   map(authState => !!authState.user)
    // );
    isLoggedIn$: Observable<boolean> = this.store.pipe(select(isLoggedIn));
    isLoggedOut$: Observable<boolean> = this.store.pipe(select(isLoggedOut));

    constructor(private router: Router) {

    }

    ngOnInit() {

      this.router.events.subscribe(event  => {
        switch (true) {
          case event instanceof NavigationStart: {
            this.loading = true;
            break;
          }

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.loading = false;
            break;
          }
          default: {
            break;
          }
        }
      });

      // this.store.subscribe(store => {
      //   console.log('[AppComponent] Current user:', store['auth']!.user);
      // });
    }

    logout() {
      this.store.dispatch(AuthActions.logout());
    }

}
