import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil, finalize, Observable } from 'rxjs';
import { Account, CreateAccountDto, CreateDepositDto, DepositTerm, DepositType } from 'src/app/core';
import { BackendService } from 'src/app/core/services/backend.service';
import { AccountPopupPayload } from '../../accounts/account-edit-popup/account-edit-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deposit-edit-popup',
  templateUrl: './deposit-edit-popup.component.html',
  styleUrls: ['./deposit-edit-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule
  ],
  standalone: true
})
export class DepositEditPopupComponent implements OnDestroy {
  public depositForm: FormGroup;
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
    this.depositForm = this.fb.group({
      account_id: this.fb.control<number | null>(null, [Validators.required]),
      term: this.fb.control<DepositTerm | "">("", [Validators.required]),
      amount: this.fb.control<number | null>(null, [Validators.required]),
      deposit_type: this.fb.control<DepositType | "">("", [Validators.required])
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
    if (this.depositForm.valid) {
      this.isLoading = true;
      const body: CreateDepositDto = this.depositForm.getRawValue();
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
      this.depositForm.markAllAsTouched();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  private getObs$(body: CreateDepositDto): Observable<void> {
    return this.backendService.deposits.post$(body, this.data.userId);
  }
}
