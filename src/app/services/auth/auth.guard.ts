import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private fireAuth: AngularFireAuth) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    console.log('ERROROR');
    return new Promise((resolve, reject) => {
      this.fireAuth.auth.onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true);
        } else {
          console.log('User is not logged in');
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }

}
