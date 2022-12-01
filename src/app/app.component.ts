import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  date1Control: FormControl<Date | null> = new FormControl(new Date(2022, 10, 7), [Validators.required]);
  date2Control: FormControl<Date | null> = new FormControl(null, [Validators.required]);
  date3Control: FormControl<Date | null> = new FormControl(null);

  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date1: this.date1Control,
      date2: this.date2Control,
      date3: this.date3Control
    }, { validators: sequentialDates });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}

const sequentialDates: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  const date1Control = form.get('date1');
  const date2Control = form.get('date2');
  const date3Control = form.get('date3');

  const date1GreaterThanDate2: boolean = date1Control?.value > date2Control?.value;
  const date1GreaterThanDate3: boolean = date1Control?.value > date3Control?.value;
  const date2GreaterThanDate3: boolean = date2Control?.value > date3Control?.value;

  date2Control?.setErrors(date1GreaterThanDate2 ? {DATE1_GREATER_THAN_DATE2: true} : null);

  let date3Errors: ValidationErrors = {
    ...(date1GreaterThanDate3) && { DATE1_GREATER_THAN_DATE3: true },
    ...(date2GreaterThanDate3) && { DATE2_GREATER_THAN_DATE3: true }
  };
  
  date3Control?.setErrors(Object.keys(date3Errors).length ? date3Errors : null);

  return null;
}

