import { Component } from '@angular/core';

import { Product } from './models/product.model';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  imgRta = '';

  constructor(private authService: AuthService, private usersService: UsersService, private fileService: FilesService){}

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser(){
    this.usersService.create({name: 'Daniel', email: 'daniel@gmail.com', password: '1212'}).subscribe( rta => {
      console.log(rta)
    })
  }

  login(){
    this.authService.login('daniel@gmail.com', '1212').subscribe( rta => {
      console.log(rta)
    })
  }
  getProfile(){
    this.authService.getProfile().subscribe(data =>{
      console.log(data)
    });
  }
  downloadPdf() {
    this.fileService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }

  onUpload(event: Event){
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if(file){
      this.fileService.uploadFile(file)
    .subscribe(rta => {
      this.imgRta = rta.location
    })
    }

  }
}
