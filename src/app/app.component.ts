import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CustomIconService } from "./core/services/custom-icon.service";
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [RouterOutlet, HeaderComponent],
  standalone: true
})
export class AppComponent {
  constructor(private readonly customIconService: CustomIconService) {
    this.customIconService.initIcons();
  }
}
