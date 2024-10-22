import { Component, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Card, QRTemplates, QRFrames } from '../../models';
import { FrameStyle, NgxQrcodeStylingModule, TemplateType } from 'ngx-qrcode-styling';
import html2canvas from 'html2canvas-pro';
import { PageSizes, PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Demo } from './demo';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgxQrcodeStylingModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @ViewChild('pdfFront') pdfFront: ElementRef<HTMLDivElement>;
  @ViewChild('pdfBack') pdfBack: ElementRef<HTMLDivElement>;

  url = signal<string>('');
  clipTitle = signal<string>('');
  cards = signal<Card[]>([]);

  qrTemplate = signal<TemplateType>('angular');
  qrFrame = signal<FrameStyle>('F_062');
  hideQR = false;

  constructor() {
    if (!environment.production) {
      this.cards.set(Demo);
    }

    effect(() => {
      if (QRTemplates.includes(this.qrTemplate())) {
        this.hideQR = true;
        setTimeout(() => {
          this.hideQR = false;
        }, 0);
      }
    });
    effect(() => {
      if (QRFrames.includes(this.qrFrame())) {
        this.hideQR = true;
        setTimeout(() => {
          this.hideQR = false;
        }, 0);
      }
    });
  }

  addCard(): void {
    const [clipTitle, artist, title, year] = this.clipTitle().match(/([^-]*) - (.*) \((.*)\)/) || [];
    let id: string;
    if (this.url().includes('clip')) {
      id = new URL(this.url()).pathname.split('/')[2];
    } else {
      id = new URL(this.url()).searchParams.get('v')!;
    }
    this.cards.update((cards) => [
      {
        id,
        artist,
        title,
        year
      },
      ...cards
    ]);
    this.url.set('');
    this.clipTitle.set('');
  }

  deleteCard(index: number): void {
    this.cards.update((cards) => {
      cards.splice(index, 1);
      return cards;
    });
  }

  async generatePDF(): Promise<void> {
    const pdfDoc = await PDFDocument.create();

    // A4 dimensions: [595.28, 841.89]
    const page1 = pdfDoc.addPage(PageSizes.A4);
    const canvasFront = await html2canvas(this.pdfFront.nativeElement);
    const imageFront = await pdfDoc.embedPng(canvasFront.toDataURL('image/png'));
    page1.drawImage(imageFront, {
      width: 540,
      height: 180 * (Math.floor(this.cards().length / 3) + 1),
      x: 25,
      y: 60
    });

    const page2 = pdfDoc.addPage(PageSizes.A4);
    const canvasBack = await html2canvas(this.pdfBack.nativeElement);
    const imageBack = await pdfDoc.embedPng(canvasBack.toDataURL('image/png'));
    page2.drawImage(imageBack, {
      width: 540,
      height: 180 * (Math.floor(this.cards().length / 3) + 1),
      x: 30.28,
      y: 60
    });

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'hitster.png');
  }
}
