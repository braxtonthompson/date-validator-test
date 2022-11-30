import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  date1Control: FormControl<Date | null> = new FormControl(null, [Validators.required]);
  date2Control: FormControl<Date | null> = new FormControl(null, [Validators.required, DateValidators.greaterThan(this.date1Control)]);
  date3Control: FormControl<Date | null> = new FormControl(null, [DateValidators.greaterThan(this.date2Control)]);

  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date1: this.date1Control,
      date2: this.date2Control,
      date3: this.date3Control
    });

    this.subscriptions.push(
      this.date1Control.valueChanges.subscribe(() => this.date2Control.updateValueAndValidity()),
      this.date2Control.valueChanges.subscribe(() => this.date3Control.updateValueAndValidity())
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}

export class DateValidators {
  static greaterThan(startControl: AbstractControl): ValidatorFn {
    return (endControl: AbstractControl): ValidationErrors | null => {
      const startDate: Date = startControl.value;
      const endDate: Date = endControl.value;
      if (!startDate || !endDate) {
        return null;
      }
      if (startDate > endDate) {
        return { greaterThan: true };
      }
      return null;
    };
  }
}