import { Component } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { CustomIconService } from "./core/services/custom-icon.service";
import { HeaderComponent } from "./header/header.component";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [RouterOutlet, HeaderComponent, NgIf],
  standalone: true
})
export class AppComponent {
  constructor(private readonly customIconService: CustomIconService, private readonly router: Router) {
    this.customIconService.initIcons();
  }

  public shouldRenderHeader(): boolean {
    return this.router.url !== "/auth" && this.router.url !== "/register";
  }
}
