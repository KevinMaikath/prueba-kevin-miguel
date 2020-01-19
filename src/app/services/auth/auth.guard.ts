import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

/**
 *  Checks if the device has been authenticated in Firebase.
 */
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private fireAuth: AngularFireAuth) {
  }

  /**
   *  Allow the current root if the device is authenticated.
   *  If not, redirect to '/login'.
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.fireAuth.auth.onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }

}
