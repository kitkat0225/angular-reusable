import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { INumberBoxSample } from './inumber-box-sample';

@Component({
  selector: 'app-number-input-test',
  templateUrl: './number-input-test.component.html',
  styleUrls: ['./number-input-test.component.css']
})

export class NumberInputTestComponent implements OnInit {

  public numberBoxSample: INumberBoxSample;

  editForm = this.fb.group({
    name: [''],
    firstNumber: 12.5,
    secondNumber: 1,
  }, {updateOn: 'submit'});


  constructor(private fb: FormBuilder, private logger: NGXLogger) {
    this.numberBoxSample = {name: '', firstNumber: 1.2};
  }

  ngOnInit(): void {

    this.logger.info('ngOnInit');
    this.editForm.patchValue({
      name: this.numberBoxSample.name,
    });


  }

  onSubmit() {

    if (!this.editForm.valid) {
      this.logger.info(this.editForm);
      return;
    }

    const formValue = this.editForm.value;
    const editedNumberBoxSample = Object.assign({}, this.numberBoxSample);
    editedNumberBoxSample.name = formValue.name;
    editedNumberBoxSample.firstNumber = formValue.firstNumber;
    editedNumberBoxSample.secondNumber = formValue.secondNumber;



    this.logger.info('editedNumberBoxSample ', editedNumberBoxSample);

  }

}
