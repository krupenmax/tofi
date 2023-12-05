import { Routes } from "@angular/router";
import authGuard from "./core/auth/auth.guard";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home"
  },
  {
    path: "home",
    canActivate: [authGuard],
    loadComponent: () => import("./dashboard/main-panel/main-panel.component").then((i) => i.MainPanelComponent),
  },
  {
    path: "login",
    loadComponent: () => import("./auth/login/login.component").then((i) => i.LoginComponent),
  }
];
