import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  standalone: false,
  selector: 'app-report-modal',
  templateUrl: './report-modal.html',
  styleUrls: ['./report-modal.css']
})
export class ReportModal {

  @Input() userEvent: any;
  @Input() profileEvents: any;
  @Input() user: any;

  @ViewChild('pdfContent') pdfContent!: ElementRef;

  eventDate = '';
  eventId = '';
  eventDesc = '';
  eventType = '';

  show = false;

  open() {
    this.eventDate = this.userEvent?.createdAt || '';
    this.eventId = this.userEvent?.id || '';
    this.eventDesc = this.userEvent?.description || '';
    this.eventType = this.userEvent?.type || '';
    this.show = true;
  }

  close() {
    this.show = false;
  }

generateProfileEventReport(): void {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório consolidado de eventos do perfil', 20, y);
    y += 10;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text(this.user.firstName, 20, y);
    y += 10;
    doc.text('-----------------------------------------------------------', 20, y);
    y += 10;

    if (Array.isArray(this.profileEvents)) {
      this.profileEvents.forEach((ev: any, idx: number) => {
      const formattedDate = ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : '';
      const eventDetails = `
        Tipo: ${ev.type}
        Data: ${formattedDate}
        Descrição: ${ev.description || ''}
        -----------------------------------------------------------
      `;
      doc.text(eventDetails, 10, y);
      y += 30; // space between events
      });
    } else {
      doc.text('No events found.', 10, y);
    }

    doc.save('event-report.pdf');
  }

}
