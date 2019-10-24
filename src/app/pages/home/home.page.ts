import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../app/auth/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private authService: AuthService,
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('GPS resp', resp);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    const watch = this.geolocation.watchPosition().subscribe(
        (data) => {
        console.log('latitude', data.coords.latitude);
        console.log('longitude', data.coords.longitude);
     });
  }

  Logout() {
    this.authService.Logout();
  }

}
