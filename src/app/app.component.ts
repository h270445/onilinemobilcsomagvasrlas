import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthNavbarComponent } from './shared/components/auth-navbar/auth-navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
      RouterOutlet,
      AuthNavbarComponent
    ],    
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'onlinemobilcsomagvasarlas';
}
