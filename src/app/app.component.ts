import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { CustomIconService } from "./core/services/custom-icon.service";
import { HeaderComponent } from "./header/header.component";
import { NgIf } from "@angular/common";
import * as firebase from "firebase/app";
import { environment } from "src/environments/environment";
import { Firestore } from "@angular/fire/firestore";
import { addDoc, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [RouterOutlet, HeaderComponent, NgIf],
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(private readonly customIconService: CustomIconService, private readonly router: Router, private firestore: Firestore) {
    this.customIconService.initIcons();
    firebase.initializeApp(environment.firebase);
  }

  public ngOnInit(): void {
    const test = collection(this.firestore, "test");
  }

  public shouldRenderHeader(): boolean {
    return this.router.url !== "/auth" && this.router.url !== "/register";
  }
}
