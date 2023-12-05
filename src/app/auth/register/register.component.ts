import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { RegisterUserRequest } from "src/app/core";
import { BackendService } from "src/app/core/services/backend.service";
import { passwordMatchValidator } from "src/app/shared/custom.validators";
import { Subject, takeUntil, finalize } from "rxjs";
import { SnackBarComponent } from "src/app/shared/snack-bar/snack-bar.component";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnDestroy {
  public isLoading = false;
  public showPassword = false;
  public showPasswordCheck = false;
  public registerForm: FormGroup;

  private readonly destroy$$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly backendService: BackendService,
    private readonly cdr: ChangeDetectorRef,
    private readonly snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: this.fb.control<string>("", [Validators.required]),
      fullName: this.fb.control<string>("", [Validators.required]),
      phoneNumber: this.fb.control<string>("", [Validators.required]),
      password: this.fb.control<string>("", [Validators.required]),
      passwordCheck: this.fb.control<string>("", [Validators.required]),
    }, { validators: passwordMatchValidator("password", "passwordCheck") });
  }

  public register(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const fv = this.registerForm.getRawValue();
      const body: RegisterUserRequest = this.transformForm(fv);
      this.backendService.register$(body)
        .pipe(
          takeUntil(this.destroy$$),
          finalize(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: () => this.redirectToLogin(),
          error: (err) => {
            const message = err.error.error_description.toString();
            this.snackBar.openFromComponent(SnackBarComponent, {
              data: { type: "error", message },
            });
          },
        });
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }

  public redirectToLogin(): void {
    this.router.navigateByUrl("auth");
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  private transformForm(fv: any): RegisterUserRequest {
    return {
      email: fv.email,
      full_name: fv.fullName,
      phone_number: fv.phoneNumber,
      password: fv.password,
      is_enabled: true
    };
  }
}