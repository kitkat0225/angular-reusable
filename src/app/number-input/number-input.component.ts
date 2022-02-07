import { 
  AfterViewInit,
  Component,
  forwardRef,
  Injector,
  Input,
  Output,
  OnInit,
  EventEmitter } from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator
} from '@angular/forms'
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    }
  ]
})
export class NumberInputComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {

  @Input() label = '';
  @Input() disabled = false;
  @Input() id = 'numberInput';
  @Input() errorMessageRequired = '';
  @Input() isRequired = false;
  @Input() lang = 'de';
  @Input() value = 0.0;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  
  stringVal = '';
  touched = false;
  generalPattern = /[0-9\.\-\+]/;
  germanPattern = /[0-9\,\-\+]/;

  constructor(
    private logger: NGXLogger,
    private inj: Injector
  ) { }

  ngOnInit(): void {
    this.setStringVal();

    if (!this.errorMessageRequired) {
      this.errorMessageRequired = `"${this.label}" muss ausgefüllt werden.`;
    }
  }

  
  ngAfterViewInit(): void {
    const outerControl = this.inj.get(NgControl).control;
    if (outerControl) {
      const prevMarkAsTouched = outerControl.markAsTouched;
      outerControl.markAsTouched = (...args: any) => {
        this.touched = true;
        // @ts-ignore
        prevMarkAsTouched.bind(outerControl)(...args);
      };
    }
  }

  onTouched: any = () => {
  };

  onChange: any = () => {
    let result = this.stringVal;
    if (this.lang === 'de') {
      result = result.replace(',', '.');
    }
    this.valueChange.emit(Number(result));
  };

  onValidatorChangeFn: any = () => {
  };

  validate(control: AbstractControl): ValidationErrors | null {
    const validationErrors = [];

    if (this.isRequired) {
      if (!this.value) {
        validationErrors.push({error: this.errorMessageRequired});
      }
    }

    return validationErrors.length > 0 ? validationErrors : [];
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
      this.value = obj;
      this.setStringVal();
      this.onTouched();

      if (this.onValidatorChangeFn) {
        this.onValidatorChangeFn();
      }
    }
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChangeFn = fn;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  isRequriedFieldInvalid() {
    return this.touched && this.isRequired && !this.value;
  }

  setStringVal() {
    if (this.lang === 'de') {
      this.stringVal = this.value.toString().replace('.', ',');
    }
  }

  _keyUp(event: any) {
    const pattern = this.lang === 'de' ? this.germanPattern : this.generalPattern;
    const keyVal = event.key;
    
    if (keyVal === 'Enter') {
      this.onChange();
    }
    
    if (
      keyVal === "ArrowLeft" ||
      keyVal === "ArrowRight" ||
      keyVal === "Delete" ||
      keyVal === "Backspace" ||
      keyVal === "Tab"
    ) {
      return;
    }

    if ((keyVal === '+' || keyVal === '-') && this.stringVal.length > 0) {
      event.preventDefault();
    }

    if (!pattern.test(keyVal)) {
      event.preventDefault();
    } else {
      if (keyVal === ',' && this.lang === 'de' && this.stringVal.indexOf(',') !== -1) {
        event.preventDefault();
      }

      if (keyVal === '.' && this.lang !== 'de' && this.stringVal.indexOf('.') !== -1) {
        event.preventDefault();
      }
    }
  }
}