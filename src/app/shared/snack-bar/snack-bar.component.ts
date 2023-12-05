import { Component, Inject, Optional } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { SnackPayload } from './snack';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
  imports: [MatIconModule, CommonModule],
  standalone: true
})
export class SnackBarComponent {
	constructor(@Inject(MAT_SNACK_BAR_DATA) @Optional() public readonly data: SnackPayload | null) {}
}
