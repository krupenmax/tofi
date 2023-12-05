import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/core/services/auth.service";
import { Login } from "src/app/core";
import { Subject, finalize, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarComponent } from "src/app/shared/snack-bar/snack-bar.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonModule } from "@angular/common";

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
    CommonModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {
  public authForm: FormGroup;
  public showPassword = false;
  public isLoading = false;

  private readonly destroy$$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.authForm = this.fb.group({
      login: this.fb.control<string>("", [Validators.required]),
      password: this.fb.control<string>("", [Validators.required])
    });
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
            this.router.navigateByUrl("/");
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
  }

  public redirectToRegister(): void {
    this.router.navigateByUrl("register");
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
