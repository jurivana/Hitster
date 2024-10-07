import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Card } from '../../models';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import html2canvas from 'html2canvas-pro';
import { PageSizes, PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

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
  cards = signal<Card[]>([
    {
      title: 'White Christmas',
      artist: 'Frank Sinatra',
      year: '1944',
      id: 'UgkxF1f1wjuFY4C6rf0uoFRgWJAg_-fLkDao'
    },
    {
      title: 'All I Want for Christmas Is You',
      artist: 'Mariah Carey',
      year: '1994',
      id: 'UgkxgnBEPZ2x8zwApzj-6KNZhyCIsKC-iduL'
    },
    {
      title: 'White Christmas',
      artist: 'Bing Crosby',
      year: '1942',
      id: 'UgkxF1f1wjuFY4C6rf0uoFRgWJAg_-fLkDao'
    },
    {
      title: 'Last Christmas',
      artist: 'Wham!',
      year: '1984',
      id: 'XwlaG2h3kysdVt8Jof0mrAkYqOst-WwKrmpL'
    },
    {
      title: 'Stille Nacht, Heilige Nacht',
      artist: 'Franz Xaver Gruber',
      year: '1818',
      id: 'MnvkR4j2thxzPy7Lf9spOgXjHqhf_TlxgPdq'
    },
    {
      title: 'Jingle Bells',
      artist: 'James Lord Pierpont',
      year: '1857',
      id: 'BwlpT1j9cfyzFq6Whm8dnYrVhWiq_RpzMjnd'
    },
    {
      title: 'Feliz Navidad',
      artist: 'José Feliciano',
      year: '1970',
      id: 'ZnlqL8b2xhycXj9Mp7tkAnFgWsjs_WlNfgrQ'
    },
    {
      title: 'Rudolph, the Red-Nosed Reindeer',
      artist: 'Gene Autry',
      year: '1949',
      id: 'TnxkW5m7phxvLq2Gd3ljpFshKfpg_BtyFgrk'
    },
    {
      title: 'O Tannenbaum',
      artist: 'Traditional',
      year: '1824',
      id: 'WvbxS7p4xhzpLo3Cq1jkPnVfPqlr_MyZkvQk'
    },
    {
      title: "Do They Know It's Christmas?",
      artist: 'Band Aid',
      year: '1984',
      id: 'YmxrV8k4wqxkGj8Jq4pmPlGhRqlj_HmzKtqW'
    },
    {
      title: 'Santa Claus Is Coming to Town',
      artist: 'Eddie Cantor',
      year: '1934',
      id: 'QlbxS6r8pfxjRj5Hc2lmOpJrBqnp_NhyZjsR'
    }
  ]);

  constructor() {}

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
      y: 30
    });

    const page2 = pdfDoc.addPage(PageSizes.A4);
    const canvasBack = await html2canvas(this.pdfBack.nativeElement);
    const imageBack = await pdfDoc.embedPng(canvasBack.toDataURL('image/png'));
    page2.drawImage(imageBack, {
      width: 540,
      height: 180 * (Math.floor(this.cards().length / 3) + 1),
      x: 30.28,
      y: 30
    });

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'hitster.png');
  }
}
