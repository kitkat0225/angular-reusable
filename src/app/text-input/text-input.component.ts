import { 
  AfterViewInit, 
  Component, 
  forwardRef, 
  Injector, 
  Input, 
  OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, NgControl,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {

  @Input() label = '';

  @Input() disabled = false;

  @Input() id = 'myControl';

  @Input() errorMessageRequired = '';

  @Input() errorMessageMinLength = '';

  @Input() isRequired = false;

  @Input() minLength = 3;

  @Input()  lineType: 'single' | 'multiple' = 'single';

  @Input()  rows = 1;

  touched = false;



  private readonly defaultRows = 4;

  private _value = '';

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(this._value);
  }

  onTouched: any = () => {
  };

  onChange: any = () => {
  };

  onValidatorChangeFn: any = () => {
  };

  constructor(private logger: NGXLogger, private inj: Injector) { }

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

  ngOnInit(): void {
    if (this.lineType === 'single' && this.rows > 0) {
      this.logger.error(`the input with id "${this.id}" is defined as single-line, but rows are specified. the rows will not be applied.`);
    }

    // this.logger.info(`ngOnInit appTextInput lineType: ${this.lineType} rows: ${this.rows}`);
    if (this.lineType === 'multiple' && (!this.rows || this.rows < 1)) {
      this.rows = this.defaultRows;
    }

    if (!this.errorMessageRequired) {
      this.errorMessageRequired = `"${this.label}" muss ausgefüllt werden.`;
    }
    if (!this.errorMessageMinLength) {
      this.errorMessageMinLength = `"${this.label}" muss mindestens ${this.minLength} Zeichen lang sein.`;
    }
  }

  validate(control: AbstractControl): ValidationErrors {

    const validationErrors = [];

    if (this.isRequired) {
      if (!this.value) {
        validationErrors.push({error: this.errorMessageRequired});
      }
    }

    if (this.minLength > 0) {

      if (this.isMinLengthFieldInvalidInternal()){
        validationErrors.push({error: this.errorMessageMinLength});
      }

    }

    return validationErrors.length > 0 ? validationErrors : [];
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

  writeValue(obj: any): void {
    if (obj !== undefined) {
      this.value = obj;
      //this.touched = true;
      this.onChange(this.value);
      this.onTouched();

      if (this.onValidatorChangeFn) {
        this.onValidatorChangeFn();
      }
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  addEvent(event: any) {
    this.onChange(this.value);
    this.touched = true;
  }

  isRequriedFieldInvalid() {
    return this.touched && this.isRequired && !this.value;
  }

  private isMinLengthFieldInvalidInternal() {
    if (this.isRequired) {
      // this.logger.log('isRequired, therefore check for length ' + this.id);
      return !this.value || this.value.length < this.minLength;
    } else {
      if (!this.value) {
        return false; //allow empty field, because not req
      }
      return this.value.length < this.minLength;
    }
  }

  isMinLengthFieldInvalid() {
    // this.logger.log('checkForMinFieldLength ' + this.id);
    if (!this.touched) {
      return false;
    }
    return this.isMinLengthFieldInvalidInternal();

    // return this.touched && this.isRequired && (!this.value || this.value.length < this.minLength);
  }
}
