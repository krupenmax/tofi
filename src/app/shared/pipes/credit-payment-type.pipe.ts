import { Pipe, PipeTransform } from '@angular/core';
import { CreditPaymentType } from 'src/app/core';

@Pipe({
  name: 'creditPaymentType',
  standalone: true
})
export class CreditPaymentTypePipe implements PipeTransform {

  transform(value: CreditPaymentType): string {
    switch (value) {
      case CreditPaymentType.Auto: return "Автоматический";
      case CreditPaymentType.Manual: return "Ручной";
    }
  }

}
