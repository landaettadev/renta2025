import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-chip-test',
  standalone: true,
  imports: [MatChipsModule],
  template: `<mat-chip-list><mat-chip color="primary">Test</mat-chip></mat-chip-list>`
})
export class ChipTestComponent {} 