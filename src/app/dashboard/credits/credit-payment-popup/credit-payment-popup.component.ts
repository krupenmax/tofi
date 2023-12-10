import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Subject, takeUntil, finalize, Observable } from "rxjs";
import { Account, DepositTerm, CreditPaymentType, CreateCreditDto, Credit, MakePaymentRequest, CreditPaymentInfoDto, CreditStatus } from "src/app/core";
import { BackendService } from "src/app/core/services/backend.service";
import { AccountPopupPayload } from "../../accounts/account-edit-popup/account-edit-popup.component";
import { DepositEditPopupComponent } from "../../deposits/deposit-edit-popup/deposit-edit-popup.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-credit-payment-popup",
  templateUrl: "./credit-payment-popup.component.html",
  styleUrls: ["./credit-payment-popup.component.scss"],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditPaymentPopupComponent {
  public creditForm: FormGroup;
  public isLoading = false;
  public credits: Credit[] = [];

  private readonly destroy$$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: AccountPopupPayload,
    private readonly fb: FormBuilder,
    private readonly backendService: BackendService,
    private readonly dialogRef: MatDialogRef<DepositEditPopupComponent>,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.creditForm = this.fb.group({
      credit_id: this.fb.control<number | "">("", [Validators.required]),
    });

    this.backendService.credits.get$(this.data.userId)
      .pipe(takeUntil(this.destroy$$))
      .subscribe((credits) => {
        const creditStatus = CreditStatus;
        this.credits = credits.filter((credit) => credit.status !== creditStatus.Paid);
        this.cdr.detectChanges();
      })
  }

  public get mode() {
    return this.data.mode;
  }

  public handleSave(): void {
    if (this.creditForm.valid) {
      this.isLoading = true;

      const creditId = this.creditForm.get("credit_id")?.value as number;
      this.backendService.credits.getCreditInfo$(creditId, this.data.userId)
        .pipe(takeUntil(this.destroy$$))
        .subscribe((creditInfo) => {
          const body: MakePaymentRequest = {
            sum_to_pay: creditInfo.sum_to_pay
          };
          this.backendService.credits.pay$(this.data.userId, this.creditForm.get("credit_id")?.value as number, body)
          .pipe(
            takeUntil(this.destroy$$),
            finalize(() => {
              this.isLoading = false;
              this.cdr.detectChanges();
            })
          )
          .subscribe({
            next: () => {
              this.dialogRef.close(true);
            }
          });
        });

    }
    else {
      this.creditForm.markAllAsTouched();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
