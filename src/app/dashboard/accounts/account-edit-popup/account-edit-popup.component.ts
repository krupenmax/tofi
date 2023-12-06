import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Observable, Subject, finalize, takeUntil } from "rxjs";
import { Account, CreateAccountDto } from "src/app/core";
import { BackendService } from "src/app/core/services/backend.service";

export interface AccountPopupPayload {
  mode: "add" | "edit",
  account?: Account,
  userId: number;
}

@Component({
  selector: "app-account-edit-popup",
  templateUrl: "./account-edit-popup.component.html",
  styleUrls: ["./account-edit-popup.component.scss"],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountEditPopupComponent implements OnDestroy {
  public accountForm: FormGroup;
  public isLoading = false;

  private readonly destroy$$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: AccountPopupPayload,
    private readonly fb: FormBuilder,
    private readonly backendService: BackendService,
    private readonly dialogRef: MatDialogRef<AccountEditPopupComponent>,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.accountForm = this.fb.group({
      name: this.fb.control<string>("", [Validators.required]),
      currency: this.fb.control<string>("", [Validators.required])
    });
  }

  public get mode() {
    return this.data.mode;
  }

  public handleSave(): void {
    if (this.accountForm.valid) {
      this.isLoading = true;
      const body: CreateAccountDto = this.accountForm.getRawValue();
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
      this.accountForm.markAllAsTouched();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  private getObs$(body: CreateAccountDto): Observable<void> {
    return this.backendService.accounts.post$(body, this.data.userId);
  }
}

