import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.loginForm = this.formBuilder.group({
      // TODO: login form validators
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLoginSubmit() {
    console.log(this.loginForm.get('email').value + this.loginForm.get('password').value);
  }

}
