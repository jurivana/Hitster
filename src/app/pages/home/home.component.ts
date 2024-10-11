import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ZXingScannerModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  lastScan: string;
  url = signal<string>('');

  constructor() {}

  scanSuccess(qrData: string): void {
    if (qrData === this.lastScan) {
      return;
    }
    this.lastScan = qrData;
    if (qrData.length === 36) {
      this.url.set(`https://www.youtube.com/clip/${qrData}`);
    } else if (qrData.length === 11) {
      this.url.set(`https://www.youtube.com/watch?v=${qrData}`);
    } else {
      this.url.set(qrData);
    }
  }

  openUrl(): void {
    window.open(this.url());
    this.url.set('');
  }

  scanFailure() {
    this.lastScan = '';
  }
}
