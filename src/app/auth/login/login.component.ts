import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/core/services/auth.service";
import { ConfirmOtpRequest, Login } from "src/app/core";
import { Subject, finalize, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarComponent } from "src/app/shared/snack-bar/snack-bar.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonModule } from "@angular/common";
import { initializeApp } from "firebase/app";
import * as firebase from "firebase/app";
import { environment } from "src/environments/environment";
import { BackendService } from "src/app/core/services/backend.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    CommonModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {
  public authForm: FormGroup;
  public showPassword = false;
  public isLoading = false;
  public hasTwoFactor = false;
  public twoFactorControl = this.fb.control<number | null>(null, [Validators.required]);

  private readonly destroy$$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef,
    backend: BackendService
  ) {
    this.authForm = this.fb.group({
      login: this.fb.control<string>("", [Validators.required]),
      password: this.fb.control<string>("", [Validators.required])
    });
    backend.accounts.get$(42).subscribe(console.log);
  }

  public login(): void {
    if (this.authForm.valid) {
      this.isLoading = true;
      const body: Login = this.authForm.getRawValue();
      this.authService.login$(body)
        .pipe(
          takeUntil(this.destroy$$),
          finalize(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: () => {
            const hasTwoFactor = this.authService.getUserInfo()?.twoFactor;
            if (!hasTwoFactor) {
              this.router.navigateByUrl("/");
            }
            else {
              this.authForm.get("login")?.disable();
              this.authForm.get("password")?.disable();
              this.hasTwoFactor = true;
              this.snackBar.openFromComponent(SnackBarComponent, {
                data: { type: "success", message: "Код подтверждения отправлен на почту" }
              });
            }

          },
          error: (err) => {
            const message = err.error.error_description.toString();
            this.snackBar.openFromComponent(SnackBarComponent, {
            data: { type: "error", message },
          });
        },
      });
    }
    else {
      this.authForm.markAllAsTouched();
    }
    if (this.twoFactorControl.valid && this.hasTwoFactor) {
      const body: ConfirmOtpRequest = { otp_code: this.twoFactorControl.value as number };
      this.authService.confirmSMS$(body)
        .pipe(takeUntil(this.destroy$$))
        .subscribe({
          next: () => {
            this.authService.setSMSConfirmed(true);
            this.router.navigateByUrl("/");
          },
          error: () => {
            this.snackBar.openFromComponent(SnackBarComponent, {
              data: { type: "error", message: "Проверочный код указан неверно" }
            })
          }
        })
    }
  }

  public redirectToRegister(): void {
    if (this.hasTwoFactor) this.authService.handleLogout();
    this.router.navigateByUrl("register");
  }

  public refreshPage(): void {
    this.authService.handleLogout();
    this.authForm.reset();
    this.hasTwoFactor = false;
    this.authForm.enable();
  }

  public refreshCode(): void {
    this.authService.refreshSMS$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: () => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { type: "success", message: "Код повторно отправлен" }
          });
        },
        error: () => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { type: "warning", message: "Срок действия текущего кода подтверждения не истек" }
          })
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
