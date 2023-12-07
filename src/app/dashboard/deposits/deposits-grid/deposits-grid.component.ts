import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Subject, takeUntil, finalize } from "rxjs";
import { Deposit } from "src/app/core";
import { AuthService } from "src/app/core/services/auth.service";
import { BackendService } from "src/app/core/services/backend.service";
import { AccountPopupPayload } from "../../accounts/account-edit-popup/account-edit-popup.component";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { DepositEditPopupComponent } from "../deposit-edit-popup/deposit-edit-popup.component";
import { GetFromPoolPipe } from "src/app/shared/pipes/get-from-pool.pipe";
import { DepositTermPipe } from "src/app/shared/pipes/deposit-term.pipe";
import { DepositTypePipe } from "src/app/shared/pipes/deposit-type.pipe";
import { PlaceholderPipe } from "src/app/shared/pipes/placeholder.pipe";
import { DepositStatusPipe } from "src/app/shared/pipes/deposit-status.pipe";

@Component({
  selector: "app-deposits-grid",
  templateUrl: "./deposits-grid.component.html",
  styleUrls: ["./deposits-grid.component.scss"],
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
    DepositTypePipe,
    PlaceholderPipe,
    DepositStatusPipe
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositsGridComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable, { static: true }) matTable!: MatTable<Deposit>;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) matPaginator!: MatPaginator;

  public isLoading = false;
  public displayedColumns = ["date", "term", "amount", "compensationAmount", "status", "type", "accountId"];
  public tableData: MatTableDataSource<Deposit>;
  public accountPool: [unknown, unknown][] = [];

  private readonly destroy$$ = new Subject<void>();

  constructor(
    private readonly backendService: BackendService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly dialog: MatDialog
  ) {
    this.tableData = new MatTableDataSource<Deposit>();
  }

  public ngOnInit(): void {
    this.getData();
    this.getPools();
  }

  public getData(): void {
    const userInfo = this.authService.getUserInfo();
    const userId = userInfo?.userId;

    this.isLoading = true;
    this.backendService.deposits.get$(userId as number)
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

  public addDeposit(): void {
    const userId = this.authService.getUserInfo()?.userId;
    const dialogRef = this.dialog.open<DepositEditPopupComponent, AccountPopupPayload>(DepositEditPopupComponent, {
      autoFocus: false,
      data: {
        mode: "add",
        userId: userId as number
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        if (res) this.getData();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
