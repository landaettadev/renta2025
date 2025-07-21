import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirmar acción' }}</h2>
    <div mat-dialog-content>
      <p>{{ data.message || '¿Estás seguro de que deseas continuar?' }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Confirmar</button>
    </div>
  `,
  styles: [`
    h2 { margin-bottom: 12px; }
    [mat-dialog-content] { font-size: 1.08rem; margin-bottom: 18px; }
    [mat-dialog-actions] { margin-top: 18px; }
    button + button { margin-left: 12px; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string }
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }
  onConfirm() {
    this.dialogRef.close(true);
  }
} 