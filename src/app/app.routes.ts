import { Routes } from "@angular/router";
import authGuard from "./core/auth/auth.guard";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from "@angular/material/snack-bar";
import { CUSTOM_SNACK_PROVIDERS } from "./shared/snack-bar/snack";

export const customSnackDefaults: MatSnackBarConfig = {
	panelClass: "custom-snackbar",
	verticalPosition: "top",
	horizontalPosition: "right",
	duration: 5000,
};

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home"
  },
  {
    path: "auth",
    providers: [CUSTOM_SNACK_PROVIDERS],
    loadComponent: () => import("./auth/login/login.component").then((i) => i.LoginComponent),
  },
  {
    path: "home",
    canActivate: [authGuard],
    providers: [CUSTOM_SNACK_PROVIDERS],
    loadComponent: () => import("./dashboard/main-panel/main-panel.component").then((i) => i.MainPanelComponent),
  },
  {
    path: "register",
    providers: [CUSTOM_SNACK_PROVIDERS],
    loadComponent: () => import("./auth/register/register.component").then((i) => i.RegisterComponent),
  }
];
