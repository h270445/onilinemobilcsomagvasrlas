import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { AuthNavbarComponent } from './shared/components/auth-navbar/auth-navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthNavbarComponent,
  ],
  template: `
    <app-auth-navbar></app-auth-navbar>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

}
