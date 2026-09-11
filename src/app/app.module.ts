import {BrowserModule} from '@angular/platform-browser';
import {NgModule, isDevMode} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import {RouterModule, Routes} from '@angular/router';
import {AuthModule} from './auth/auth.module';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {RouterState, StoreRouterConnectingModule} from '@ngrx/router-store';

import {EffectsModule} from '@ngrx/effects';
import {EntityDataModule} from '@ngrx/data';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { reducers, metaReducers } from './reducers';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
    canActivate: [AuthGuard] // no puede acceder a esta ruta si no está logueado
  },
  {
    path: '**',
    redirectTo: '/'
  }
];



@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        MatMenuModule,
        MatIconModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatToolbarModule,
        AuthModule.forRoot(),
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks : {
                strictStateImmutability: true, // Asegura que el estado de la aplicación no se pueda mutar directamente, lo que ayuda a mantener la integridad del estado y facilita la depuración.
                strictActionImmutability: true, // Garantiza que las acciones despachadas no se puedan mutar, promoviendo un flujo de datos predecible y evitando efectos secundarios inesperados.
                strictActionSerializability: true, // Verifica que las acciones despachadas sean serializables, lo que es importante para la depuración y el registro de acciones, así como para la persistencia del estado.
                strictStateSerializability:true // Verifica que el estado de la aplicación sea serializable, lo que es importante para la depuración, el registro de acciones y la persistencia del estado.
            }
        }),
        EffectsModule.forRoot([]),
        EntityDataModule,
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router',
            routerState: RouterState.Minimal
        })

      ],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    })
export class AppModule {
}
