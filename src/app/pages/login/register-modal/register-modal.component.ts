import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {

  registerForm: FormGroup;
  loading: HTMLIonLoadingElement;

  constructor(private modalCtrl: ModalController,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private router: Router,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeat_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onBackPressed() {
    this.modalCtrl.dismiss();
  }

  /**
   * Get the form fields values.
   */
  async onRegisterSubmit() {
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();

    const email: string = this.registerForm.get('email').value;
    const password: string = this.registerForm.get('password').value;
    const repeatPassword: string = this.registerForm.get('repeat_password').value;

    if (this.matchingPasswords(password, repeatPassword)) {
      this.createNewUser(email, password);
    } else {
      await this.loading.dismiss();
      this.notifyWithToast('Passwords don\'t match');
    }
  }

  matchingPasswords(password: string, repeatPassword: string): boolean {
    return password === repeatPassword;
  }

  /**
   *  Handle register control.
   */
  createNewUser(email: string, password: string) {
    this.authService.registerUser(email, password)
      .then(() => {
        this.loading.dismiss();
        this.modalCtrl.dismiss();
        this.router.navigateByUrl('/home');
      })
      .catch((err) => {
        this.loading.dismiss();
        console.log(err);
        this.checkError(err);
      });
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
    if (err.code === 'auth/email-already-in-use') {
      this.notifyWithToast('Email already in use.');
    } else if (err.code === 'auth/invalid-email') {
      this.notifyWithToast('Invalid email');
    } else {
      this.notifyWithToast('An unexpected error occurred');
    }
  }
}
