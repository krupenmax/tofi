import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "getFromPool",
	standalone: true,
})
export class GetFromPoolPipe implements PipeTransform {
	public transform(id: unknown, pool: unknown[][], index = 1): unknown | null {
		const item = pool.find((el) => el[0] === id);
		return item ? item[index] : null;
	}
}
