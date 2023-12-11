import { Component, OnDestroy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Subject, takeUntil } from "rxjs";
import { BackendService } from "src/app/core/services/backend.service";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
  standalone: true,
  imports: [
    MatButtonModule
  ]
})
export class ReportsComponent implements OnDestroy {
  private readonly destroy$$ = new Subject<void>();
  constructor(private readonly backendService: BackendService) { }

  public download(): void {
    this.backendService.reports.download$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], { type: "application/octet-stream" });
          const file = new File([blob], "Кредитный отчет" , { type: "application/vnd.ms-excel" })

          const url = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = "Кредитный отчет";
          link.click();
          URL.revokeObjectURL(url);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
