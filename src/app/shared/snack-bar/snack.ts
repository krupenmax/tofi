import { Provider } from "@angular/core";
import { MatSnackBarConfig, MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";

export type SnackPayload = {
	message: string;
	type: "success" | "warning" | "error";
};

export const customSnackDefaults: MatSnackBarConfig = {
	panelClass: "custom-snackbar",
	verticalPosition: "top",
	horizontalPosition: "right",
	duration: 5000,
};

/**
 * **Doesn't work in standalone components' providers for some reason**
 *
 * Works in route providers
 */
export const CUSTOM_SNACK_PROVIDERS: Provider[] = [
	{
		provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
		useValue: customSnackDefaults,
	},
];
