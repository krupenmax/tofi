import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Login } from '..';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly backendService: BackendService) { }

  public login(body: Login): any {
    this.backendService.login(body)
      .pipe(take(1))
      .subscribe((res) => console.log(res));
  }
}
