import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {RegisterModalComponent} from './register-modal/register-modal.component';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private modalCtrl: ModalController,
              private authService: AuthService,
              private router: Router) {
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
    // console.log(this.loginForm.get('email').value + this.loginForm.get('password').value);
    const email: string = this.loginForm.get('email').value;
    const password: string = this.loginForm.get('password').value;

    this.authService.loginUser(email, password)
      .then(() => {
        this.router.navigateByUrl('/home');
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async onRegisterClicked() {
    const modal = await this.modalCtrl.create({
      component: RegisterModalComponent,
    });

    return await modal.present();
  }

}
