import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AccountsGridComponent } from "../accounts/accounts-grid/accounts-grid.component";
import { CommonModule } from "@angular/common";
import { DepositsGridComponent } from "../deposits/deposits-grid/deposits-grid.component";
import { CreditsGridComponent } from "../credits/credits-grid/credits-grid.component";

export enum MainPanelTab {
  accounts = "accounts",
  deposits = "deposits",
  credits = "credits"
};

@Component({
  selector: "app-main-panel",
  templateUrl: "./main-panel.component.html",
  styleUrls: ["./main-panel.component.scss"],
  imports: [
    MatButtonModule,
    MatIconModule,
    AccountsGridComponent,
    DepositsGridComponent,
    CreditsGridComponent,
    CommonModule
  ],
  standalone: true
})
export class MainPanelComponent {
  public activeTab: string = MainPanelTab.accounts;

  public get tabType() {
    return MainPanelTab;
  }
}
