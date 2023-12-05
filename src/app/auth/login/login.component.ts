import { Component, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/core/services/auth.service";
import { Login } from "src/app/core";

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
    ReactiveFormsModule
  ],
  standalone: true
})
export class LoginComponent {
  public authForm: FormGroup;
  public showPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.authForm = this.fb.group({
      login: this.fb.control<string>("", [Validators.required]),
      password: this.fb.control<string>("", [Validators.required])
    });
  }

  public login(): void {
    if (this.authForm.valid) {
      const body: Login = this.authForm.getRawValue();
      this.authService.login(body);
    }
    else {
      this.authForm.markAllAsTouched();
    }
  }
}
