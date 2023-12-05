import { ValidationErrors, FormGroup } from "@angular/forms";

export function passwordMatchValidator(passwordField: string, passwordCheckField: string): ValidationErrors | null {
  return (form: FormGroup): ValidationErrors | null => {

    const password = form.get(passwordField)?.value;
    const passwordCheck = form.get(passwordCheckField)?.value;

    if (!password || !passwordCheck) return null;

    const passwordsValid = password === passwordCheck;

    form.get(passwordField)?.setErrors(passwordsValid ? null : { passwordMatchError: true });
    form.get(passwordCheckField)?.setErrors(passwordsValid ? null : { passwordMatchError: true });

    return passwordsValid ? null : { passwordMatchError: true };
  }
}
