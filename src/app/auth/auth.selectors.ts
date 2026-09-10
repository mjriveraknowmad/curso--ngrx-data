import { createFeatureSelector, createSelector } from "@ngrx/store";
import { authFeatureKey, AuthState } from "./reducers";

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey); // "auth"

export const isLoggedIn = createSelector(
  selectAuthState,
  (auth) => !!auth.user,
);

// usa el selector isLoggedIn anteriormente definido para crear otro selector que devuelva lo contrario
export const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn);
