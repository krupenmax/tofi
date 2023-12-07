import { Pipe, PipeTransform } from "@angular/core";
import { DepositTerm } from "src/app/core";

@Pipe({
  name: "depositTerm",
  standalone: true
})
export class DepositTermPipe implements PipeTransform {

  transform(value: DepositTerm): string {
    switch (value) {
      case DepositTerm.ThreeMonth: return "3 месяца";
      case DepositTerm.SixMonth: return "6 месяцев";
      case DepositTerm.TwelveMonth: return "Год";
      case DepositTerm.Perpetual: return "Бессрочный";
    }
  }

}
