import { Pipe, PipeTransform } from '@angular/core';
import { CreditStatus } from 'src/app/core';

@Pipe({
  name: 'creditStatus',
  standalone: true
})
export class CreditStatusPipe implements PipeTransform {

  transform(value: CreditStatus): string {
    switch (value) {
      case CreditStatus.Approved: return "Подтвержден";
      case CreditStatus.New: return "Новый";
      case CreditStatus.Paid: return "Оплачен";
    }
  }

}
