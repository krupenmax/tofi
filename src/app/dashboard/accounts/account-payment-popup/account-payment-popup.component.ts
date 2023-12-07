import { CommonModule } from "@angular/common";
import { Component, Inject, OnDestroy } from "@angular/core";
import { ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Subject, finalize, takeUntil } from "rxjs";
import { Account } from "src/app/core";
import { BackendService } from "src/app/core/services/backend.service";

@Component({
  selector: "app-account-payment-popup",
  templateUrl: "./account-payment-popup.component.html",
  styleUrls: ["./account-payment-popup.component.scss"],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class AccountPaymentPopupComponent implements OnDestroy {
  public isLoading = false;
  public accountControl = new FormControl<number | "">("", [Validators.required]);

  private readonly destroy$$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: { accounts: Account[], userId: number },
    private readonly backendService: BackendService,
    private readonly dialogRef: MatDialogRef<AccountPaymentPopupComponent>
  ) { }

  public get accounts() {
    return this.data.accounts;
  }

  public handlePayment(): void {
    this.isLoading = true;
    this.backendService.accounts.addMoney$(this.data.userId, this.accountControl.value as number)
      .pipe(
        takeUntil(this.destroy$$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => this.dialogRef.close(true)
      });
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}

