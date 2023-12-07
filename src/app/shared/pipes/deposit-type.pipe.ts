import { Pipe, PipeTransform } from "@angular/core";
import { DepositType } from "src/app/core";

@Pipe({
  name: "depositType",
  standalone: true
})
export class DepositTypePipe implements PipeTransform {

  transform(value: DepositType): string {
    switch (value) {
      case DepositType.Irrevocable: return "Неотзывной";
      case DepositType.Revocable: return "Отзывной";
    }
  }

}
