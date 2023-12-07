import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "ph",
	standalone: true,
})
export class PlaceholderPipe implements PipeTransform {
	public transform(value: unknown, placeholder = "—"): string | unknown {
		return value !== null && value !== undefined && value !== "" ? value : placeholder;
	}
}
