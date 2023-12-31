import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { BackendService } from 'src/app/core/services/backend.service';
import { Subject, finalize, takeUntil } from "rxjs";
import { MatTableModule, MatTable, MatTableDataSource } from "@angular/material/table";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { Account } from 'src/app/core';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { AccountEditPopupComponent, AccountPopupPayload } from '../account-edit-popup/account-edit-popup.component';
import { DatePipe } from '@angular/common';
import { AccountPaymentPopupComponent } from '../account-payment-popup/account-payment-popup.component';
import { AccountTransferPopupComponent } from '../account-transfer-popup/account-transfer-popup.component';
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';

@Component({
  selector: 'app-accounts-grid',
  templateUrl: './accounts-grid.component.html',
  styleUrls: ['./accounts-grid.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    DatePipe,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsGridComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable, { static: true }) matTable!: MatTable<Account>;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) matPaginator!: MatPaginator;

  public isLoading = false;
  public displayedColumns = ["id", "name", "date", "balance", "currency", "isBlocked"];
  public tableData: MatTableDataSource<Account>;

  private readonly destroy$$ = new Subject<void>();

  constructor(
    private readonly backendService: BackendService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.tableData = new MatTableDataSource<Account>();
  }

  public ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    const userInfo = this.authService.getUserInfo();
    const userId = userInfo?.userId;

    this.isLoading = true;
    this.backendService.accounts.get$(userId as number)
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

  public addAccount(): void {
    const userId = this.authService.getUserInfo()?.userId;
    const dialogRef = this.dialog.open<AccountEditPopupComponent, AccountPopupPayload>(AccountEditPopupComponent, {
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
            data: { type: "success", message: "Счет успешно открыт" }
          });
        }
      });
  }

  public editAccount(account: Account): void {
    const userId = this.authService.getUserInfo()?.userId;
    const dialogRef = this.dialog.open<AccountEditPopupComponent, AccountPopupPayload>(AccountEditPopupComponent, {
      autoFocus: false,
      data: {
        mode: "edit",
        userId: userId as number,
        account
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        if (res) this.getData();
      });
  }

  public openPaymentPopup(): void {
    const userId = this.authService.getUserInfo()?.userId;
    const dialogRef = this.dialog.open(AccountPaymentPopupComponent, {
      autoFocus: false,
      data: {
        accounts: this.tableData.data,
        userId
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        if (res) {
          this.getData();
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { type: "success", message: "Счет успешно пополнен" }
          });
        }
      });
  }

  public openTransferPopup(): void {
    const dialogRef = this.dialog.open(AccountTransferPopupComponent, {
      data: { userId: this.authService.getUserInfo()?.userId }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        if (res) {
          this.getData();
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { type: "success", message: "Перевод выполнен успешно" }
          });
        }
      });
  }

  public handleAccountStatusChange(value: MatSlideToggleChange, accountId: number) {
    const newValue = !value.checked;
    const userId = this.authService.getUserInfo()?.userId as number;
    this.backendService.accounts.changeStatus$(accountId, userId, newValue)
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: () => {
          this.getData();
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { type: "success", message: "Статус счета успешно изменен" }
          });
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}

