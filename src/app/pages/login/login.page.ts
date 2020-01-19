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

  /**
   * Initialize the login form fields.
   */
  formInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Get the form fields values.
   */
  async onLoginSubmit() {
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();

    if (!this.validateFields()) {
      this.loading.dismiss();
    } else {
      const email: string = this.loginForm.get('email').value;
      const password: string = this.loginForm.get('password').value;

      this.authenticate(email, password);
    }
  }

  /**
   * Check if all the fields are correctly validated.
   */
  validateFields(): boolean {
    if (!this.loginForm.get('email').valid) {
      this.notifyWithToast('Please enter a valid email');
      return false;
    } else if (!this.loginForm.get('password')) {
      this.notifyWithToast('Incorrect password');
      return false;
    } else {
      return true;
    }
  }

  /**
   * Handle login control.
   */
  authenticate(email: string, password: string) {
    this.authService.loginUser(email, password)
      .then(() => {
        this.loading.dismiss();
        this.router.navigateByUrl('/home');
      })
      .catch((err) => {
        this.loading.dismiss();
        this.checkError(err);
      });
  }

  /**
   * Present register modal.
   */
  async onRegisterClicked() {
    const modal = await this.modalCtrl.create({
      component: RegisterModalComponent,
    });

    return await modal.present();
  }

  /**
   * Present a toast with a given message.
   */
  async notifyWithToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      color: 'danger'
    });
    await toast.present();
  }

  /**
   *  Handle Firebase Auth errors.
   * @param err: Firebase Authentication error.
   */
  checkError(err) {
    let message = '';
    switch (err.code) {
      case 'auth/invalid-email':
        message = 'Invalid email';
        break;
      case 'auth/wrong-password':
        message = 'Wrong password';
        break;
      case 'auth/user-not-found':
        message = 'User not found';
        break;
      default:
        message = 'An unexpected error occurred';
        console.log(err.code);
        break;
    }
    this.notifyWithToast(message);
  }

}
