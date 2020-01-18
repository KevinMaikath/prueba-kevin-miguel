import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private modalCtrl: ModalController,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    // TODO: register form validators
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeat_password: ['', Validators.required],
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  onRegisterSubmit() {
    console.log(this.registerForm.get('email').value + '__'
      + this.registerForm.get('password').value + '___'
      + this.registerForm.get('repeat_password').value);
  }
}
