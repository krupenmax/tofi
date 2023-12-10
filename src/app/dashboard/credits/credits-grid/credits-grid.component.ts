import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Subject, takeUntil, finalize } from "rxjs";
import { Credit, Deposit } from "src/app/core";
import { AuthService } from "src/app/core/services/auth.service";
import { BackendService } from "src/app/core/services/backend.service";
import { AccountPopupPayload } from "../../accounts/account-edit-popup/account-edit-popup.component";
import { DepositEditPopupComponent } from "../../deposits/deposit-edit-popup/deposit-edit-popup.component";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { DepositStatusPipe } from "src/app/shared/pipes/deposit-status.pipe";
import { DepositTermPipe } from "src/app/shared/pipes/deposit-term.pipe";
import { DepositTypePipe } from "src/app/shared/pipes/deposit-type.pipe";
import { GetFromPoolPipe } from "src/app/shared/pipes/get-from-pool.pipe";
import { PlaceholderPipe } from "src/app/shared/pipes/placeholder.pipe";
import { CreditEditPopupComponent } from "../credit-edit-popup/credit-edit-popup.component";
import { CreditPaymentTypePipe } from "src/app/shared/pipes/credit-payment-type.pipe";
import { CreditStatusPipe } from "src/app/shared/pipes/credit-status.pipe";
import { CreditPaymentPopupComponent } from "../credit-payment-popup/credit-payment-popup.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { SnackBarComponent } from "src/app/shared/snack-bar/snack-bar.component";

@Component({
  selector: "app-credits-grid",
  templateUrl: "./credits-grid.component.html",
  styleUrls: ["./credits-grid.component.scss"],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    DatePipe,
    GetFromPoolPipe,
    DepositTermPipe,
    CreditPaymentTypePipe,
    CreditStatusPipe,
    PlaceholderPipe,
    DepositStatusPipe,
    MatSnackBarModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditsGridComponent {
  @ViewChild(MatTable, { static: true }) matTable!: MatTable<Credit>;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) matPaginator!: MatPaginator;

  public isLoading = false;
  public displayedColumns = [
    "name", "date", "account_id", "term", "amount_given",
    "debt", "next_pay_date", "per_month_pay_sum",
    "penya", "status", "payment_type", "is_notification_enabled"
  ];
  public tableData: MatTableDataSource<Credit>;
  public accountPool: [unknown, unknown][] = [];

  private readonly destroy$$ = new Subject<void>();

  constructor(
    private readonly backendService: BackendService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.tableData = new MatTableDataSource<Credit>();
  }

  public ngOnInit(): void {
    this.getData();
    this.getPools();
  }

  public getData(): void {
    const userInfo = this.authService.getUserInfo();
    const userId = userInfo?.userId;

    this.isLoading = true;
    this.backendService.credits.get$(userId as number)
      .pipe(
        takeUntil(this.destroy$$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((res) => {
        this.tableData.data = res;
      });
  }

  public getPools(): void {
    const userId = this.authService.getUserInfo()?.userId;
    this.backendService.accounts.get$(userId as number)
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        this.accountPool = res.map((account) => [account.id, account.name]);
        this.cdr.detectChanges();
      });
  }

  public addCredit(): void {
    const userId = this.authService.getUserInfo()?.userId;
    const dialogRef = this.dialog.open<CreditEditPopupComponent, AccountPopupPayload>(CreditEditPopupComponent, {
      autoFocus: false,
      data: {
        mode: "add",
        userId: userId as number
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        if (res) {
          this.getData();
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { type: "success", message: "Кредит успешно оформлен" },
          });
        }
      });
  }

  public payForCredit(): void {
    const userId = this.authService.getUserInfo()?.userId;
    const dialogRef = this.dialog.open<CreditPaymentPopupComponent, AccountPopupPayload>(CreditPaymentPopupComponent, {
      autoFocus: false,
      data: {
        mode: "add",
        userId: userId as number
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        if (res) {
          this.getData();
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { type: "success", message: "Оплата за кредит прошла успешно" },
          });
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
