import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Subject, takeUntil, finalize, Observable } from "rxjs";
import { Account, CreateAccountDto, CreateCreditDto, CreateDepositDto, CreditPaymentType, DepositTerm, DepositType } from "src/app/core";
import { BackendService } from "src/app/core/services/backend.service";
import { AccountPopupPayload, AccountEditPopupComponent } from "../../accounts/account-edit-popup/account-edit-popup.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { DepositEditPopupComponent } from "../../deposits/deposit-edit-popup/deposit-edit-popup.component";
import { MatCheckboxModule } from "@angular/material/checkbox";

@Component({
  selector: "app-credit-edit-popup",
  templateUrl: "./credit-edit-popup.component.html",
  styleUrls: ["./credit-edit-popup.component.scss"],
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
export class CreditEditPopupComponent {
  public creditForm: FormGroup;
  public isLoading = false;
  public accountPool: [unknown, unknown][] = [];
  public accounts: Account[] = [];

  private readonly destroy$$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: AccountPopupPayload,
    private readonly fb: FormBuilder,
    private readonly backendService: BackendService,
    private readonly dialogRef: MatDialogRef<DepositEditPopupComponent>,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.creditForm = this.fb.group({
      name: this.fb.control<string>("", [Validators.required]),
      account_id: this.fb.control<number | null>(null, [Validators.required]),
      term: this.fb.control<DepositTerm | "">("", [Validators.required]),
      amount_given: this.fb.control<number | null>(null, [Validators.required]),
      payment_type: this.fb.control<CreditPaymentType | "">("", [Validators.required]),
      is_notification_enabled: this.fb.control<boolean>(false, [Validators.required])
    });

    this.backendService.accounts.get$(this.data.userId)
      .pipe(takeUntil(this.destroy$$))
      .subscribe((accounts) => {
        this.accounts = accounts;
        this.cdr.detectChanges();
      })
  }

  public get mode() {
    return this.data.mode;
  }

  public handleSave(): void {
    if (this.creditForm.valid) {
      this.isLoading = true;
      const body: CreateCreditDto = this.creditForm.getRawValue();
      this.getObs$(body)
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
    }
    else {
      this.creditForm.markAllAsTouched();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  private getObs$(body: CreateCreditDto): Observable<void> {
    return this.backendService.credits.post$(body, this.data.userId);
  }
}
