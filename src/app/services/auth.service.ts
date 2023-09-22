import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = `https://young-sands-07814.herokuapp.com/api/auth`
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(email:string, password: string){
    return this.http.post<Auth>(`${this.apiURL}/login`, {
      email, password
    }).pipe(
      tap(response => this.tokenService.saveToken(response.access_token))
    )
  }

  getProfile(){
    /* const header = new HttpHeaders();
    header.set("Authrization:", `Bearer ${token}`) */
    return this.http.get<User>(`${this.apiURL}/profile`, {
      /* headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-type': 'application/json'
      } */
    });
  }

}
