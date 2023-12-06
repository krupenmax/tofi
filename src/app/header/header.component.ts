import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../core/services/auth.service";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  imports: [MatButtonModule, MatIconModule, NgIf],
  standalone: true
})
export class HeaderComponent {
  constructor(private readonly authService: AuthService) { }

  public get isLogged() {
    return !!this.authService.getToken();
  }

  public get userInfo() {
    return this.authService.getUserInfo();
  }

  public logout(): void {
    this.authService.handleLogoutWithRedirect();
  }
}
