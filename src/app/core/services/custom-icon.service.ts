import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class CustomIconService {
	constructor(private readonly matIconRegistry: MatIconRegistry, private readonly domSanitizer: DomSanitizer) {}

	/**
	 * Any custom icons go here
	 */
	public initIcons(): void {
		this.matIconRegistry.addSvgIconInNamespace(
			"i",
			"trash_delete",
			this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/trash_delete.svg")
		);

    this.matIconRegistry.addSvgIconInNamespace(
			"i",
			"cancel",
			this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cancel.svg")
		);

    this.matIconRegistry.addSvgIconInNamespace(
			"i",
			"check_done",
			this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/check_done.svg")
		);

    this.matIconRegistry.addSvgIconInNamespace(
			"i",
			"block",
			this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/block.svg")
		);
  }
}
