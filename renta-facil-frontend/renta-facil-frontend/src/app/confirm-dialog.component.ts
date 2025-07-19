import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div style="padding: 24px 8px 8px 8px; text-align: center;">
      <mat-icon color="warn" style="font-size: 3rem;">warning</mat-icon>
      <div style="margin: 18px 0 24px 0; font-size: 1.1rem;">{{ data.message }}</div>
      <div style="display: flex; justify-content: center; gap: 18px;">
        <button mat-raised-button color="warn" (click)="onConfirm()">Sí, eliminar</button>
        <button mat-button (click)="onCancel()">Cancelar</button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
  onConfirm() { this.dialogRef.close(true); }
  onCancel() { this.dialogRef.close(false); }
} 