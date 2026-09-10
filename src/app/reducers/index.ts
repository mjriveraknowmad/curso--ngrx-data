import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {routerReducer} from '@ngrx/router-store';

export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {
    router: routerReducer // Reducer for handling router state
};

export function logger(reducer:ActionReducer<any>)
    : ActionReducer<any> {
    return (state, action) => {
        console.log("state before: ", state);
        console.log("action", action);

        return reducer(state, action); // Pasa el estado y la acción al siguiente reducer
    }

}

// Los metaReducers son funciones que se ejecutan antes de los reducers y pueden modificar el estado o la acción antes de que lleguen al reducer. Se pueden usar para logging, manejo de errores, etc.
// por ejemplo en la configuración de StoreModule se están añadiendo comprobadores de estado en tiempo de ejecución para asegurar que el estado y las acciones no se muten directamente, lo que ayuda a mantener la integridad del estado y facilita la depuración.
// en este caso, se está utilizando un metaReducer llamado logger que registra el estado y la acción antes de que lleguen al reducer. Esto es útil para depuración y seguimiento de acciones en la aplicación.
export const metaReducers: MetaReducer<AppState>[] =
    !environment.production ? [logger] : [];


