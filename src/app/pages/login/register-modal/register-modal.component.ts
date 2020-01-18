import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
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
              private router: Router) {
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    // TODO: register form validators
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeat_password: ['', Validators.required, Validators.minLength(6)],
    }, {Validators: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('repeat_password').value;

    return password === confirmPassword ? null : { notSame: true };
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async onRegisterSubmit() {
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();

    const email: string = this.registerForm.get('email').value;
    const password: string = this.registerForm.get('password').value;

    this.authService.registerUser(email, password)
      .then(() => {
        this.loading.dismiss();
        this.modalCtrl.dismiss();
        this.router.navigateByUrl('/home');
      })
      .catch((err) => {
        this.loading.dismiss();
        console.log('ERROR: ' + err.message);
      });
  }
}
