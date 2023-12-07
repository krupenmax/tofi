import { Pipe, PipeTransform } from "@angular/core";
import { DepositStatus } from "src/app/core";

@Pipe({
  name: "depositStatus",
  standalone: true
})
export class DepositStatusPipe implements PipeTransform {

  transform(value: DepositStatus): string {
    switch (value) {
      case DepositStatus.Approve: return "Подтвержден";
      case DepositStatus.Closed: return "Закрыт";
      case DepositStatus.New: return "Новый";
      case DepositStatus.OnCompensation: return "На возмещении";
    }
  }

}
