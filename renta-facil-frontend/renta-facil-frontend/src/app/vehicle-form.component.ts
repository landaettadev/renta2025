import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Vehicle } from './core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Editar Vehículo' : 'Agregar Vehículo' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="vehicle-form-modal">
      <div class="form-grid">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Marca</mat-label>
          <input matInput formControlName="brand" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Modelo</mat-label>
          <input matInput formControlName="model" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="Sedan">Sedan</mat-option>
            <mat-option value="SUV">SUV</mat-option>
            <mat-option value="Hatchback">Hatchback</mat-option>
            <mat-option value="Pickup">Pickup</mat-option>
            <mat-option value="Otro">Otro</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Placa</mat-label>
          <input matInput formControlName="licensePlate" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Precio por día</mat-label>
          <input matInput type="number" formControlName="pricePerDay" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Disponibilidad</mat-label>
          <mat-select formControlName="isAvailable" required>
            <mat-option [value]="true">Disponible</mat-option>
            <mat-option [value]="false">No disponible</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="image-upload">
          <label>Imagen:</label>
          <input type="file" (change)="onFileChange($event)" accept="image/*" />
          <img *ngIf="form.value.image" [src]="form.value.image" alt="Preview" class="preview-img" />
        </div>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || data?.loading">
          <mat-spinner *ngIf="data?.loading" diameter="22"></mat-spinner>
          <span *ngIf="!data?.loading"><mat-icon>save</mat-icon> Guardar</span>
        </button>
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    .vehicle-form-modal { display: flex; flex-direction: column; gap: 18px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { grid-column: 1 / -1; }
    .image-upload { display: flex; flex-direction: column; align-items: flex-start; margin-left: 16px; }
    .preview-img { width: 100px; height: 70px; object-fit: cover; border-radius: 8px; margin-top: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.10); border: 1.5px solid #eee; }
  `]
})
export class VehicleFormComponent {
  form: FormGroup;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VehicleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Vehicle> | null
  ) {
    this.form = this.fb.group({
      id: [data?.id],
      brand: [data?.brand || '', Validators.required],
      model: [data?.model || '', Validators.required],
      type: [data?.type || '', Validators.required],
      licensePlate: [data?.licensePlate || '', Validators.required],
      pricePerDay: [data?.pricePerDay || '', Validators.required],
      isAvailable: [data?.isAvailable ?? true, Validators.required],
      image: [data?.image || '']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.form.patchValue({ image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.form.value, imageFile: this.imageFile });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 