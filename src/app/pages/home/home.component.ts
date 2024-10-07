import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ZXingScannerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor() {}

  scan(qrData: string): void {
    if (qrData.length === 36) {
      window.open(`https://www.youtube.com/clip/${qrData}`);
    } else if (qrData.length === 11) {
      window.open(`https://www.youtube.com/watch?v=${qrData}`);
    } else {
      window.open(qrData, '_blank');
    }
  }
}
