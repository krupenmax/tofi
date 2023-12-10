import { Component, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BackendService } from "src/app/core/services/backend.service";
import { AccountPopupPayload } from "../account-edit-popup/account-edit-popup.component";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-account-transfer-popup",
  templateUrl: "./account-transfer-popup.component.html",
  styleUrls: ["./account-transfer-popup.component.scss"],
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule
  ]
})
export class AccountTransferPopupComponent implements OnDestroy {
  public transferForm: FormGroup;

  private readonly destroy$$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly backendService: BackendService,
    @Inject(MAT_DIALOG_DATA) public readonly data: { userId: number },
    private readonly dialogRef: MatDialogRef<AccountTransferPopupComponent>
  ) {
    this.transferForm = this.fb.group({
      sender_id: this.fb.control<number | null>(null, [Validators.required]),
      receiver_id: this.fb.control<number | null>(null, [Validators.required]),
      sum: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
      currency: this.fb.control<string>("", [Validators.required])
    });
  }

  public handleTransfer(): void {
    if (this.transferForm.valid) {
      const body = this.transferForm.getRawValue();
      this.backendService.accounts.makeTransfer$(body, this.data.userId)
        .pipe(takeUntil(this.destroy$$))
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          }
        });
    }
    else {
      this.transferForm.markAllAsTouched();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
