import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
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
  loading: HTMLIonLoadingElement;

  constructor(private formBuilder: FormBuilder,
              private modalCtrl: ModalController,
              private authService: AuthService,
              private router: Router,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLoginSubmit() {
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();

    const email: string = this.loginForm.get('email').value;
    const password: string = this.loginForm.get('password').value;

    this.authService.loginUser(email, password)
      .then(() => {
        this.loading.dismiss();
        this.router.navigateByUrl('/home');
      })
      .catch((err) => {
        this.loading.dismiss();

        if (err.code === 'auth/invalid-email' ||
          err.code === 'auth/wrong-password') {
          this.notifyWithToast('Incorrect credentials');
        } else {
          this.notifyWithToast('An unexpected error ocurred');
        }

      });
  }

  async onRegisterClicked() {
    const modal = await this.modalCtrl.create({
      component: RegisterModalComponent,
    });

    return await modal.present();
  }

  async notifyWithToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      color: 'danger'
    });
    await toast.present();
  }

}
