import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, SiteStats, OrderRecord, VisitorRecord, CodRecord, PaymentRecord } from './history.service';
import { RouterLink } from '@angular/router';

export type MetricKey = 'orders' | 'visitors' | 'cod' | 'payments';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  stats: SiteStats = { visitors: 0, onlineOrders: 0, codDelivered: 0, paymentsReceived: 0 };
  activeMetric: MetricKey | null = null;
  orders: OrderRecord[] = [];
  visitors: VisitorRecord[] = [];
  codHistory: CodRecord[] = [];
  payments: PaymentRecord[] = [];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService.getStats().subscribe((s) => (this.stats = s));
  }

  toggleMetric(metric: MetricKey): void {
    if (this.activeMetric === metric) {
      this.activeMetric = null;
      return;
    }

    this.activeMetric = metric;
    if (metric === 'orders' && this.orders.length === 0) {
      this.historyService.getOrders().subscribe((o) => (this.orders = o));
    }
    if (metric === 'visitors' && this.visitors.length === 0) {
      this.historyService.getVisitorHistory().subscribe((v) => (this.visitors = v));
    }
    if (metric === 'cod' && this.codHistory.length === 0) {
      this.historyService.getCodHistory().subscribe((c) => (this.codHistory = c));
    }
    if (metric === 'payments' && this.payments.length === 0) {
      this.historyService.getPaymentHistory().subscribe((p) => (this.payments = p));
    }
  }

  get activeTableData() {
    if (!this.activeMetric) {
      return { title: '', headers: [], rows: [], filename: '' };
    }

    if (this.activeMetric === 'orders') {
      return {
        title: 'Order History',
        headers: ['Order ID', 'Date', 'Customer', 'Amount', 'Payment', 'Status'],
        rows: this.orders.map((o) => [o.id, o.date, o.customer, `₹${o.amount}`, o.paymentMethod, o.status]),
        filename: 'orders'
      };
    }

    if (this.activeMetric === 'visitors') {
      return {
        title: 'Visitor History',
        headers: ['Record', 'Date', 'Visitors', 'Source'],
        rows: this.visitors.map((v) => [v.id, v.date, v.visitors.toString(), v.source]),
        filename: 'visitors'
      };
    }

    if (this.activeMetric === 'cod') {
      return {
        title: 'COD Delivery History',
        headers: ['Record', 'Date', 'Delivered', 'Region'],
        rows: this.codHistory.map((c) => [c.id, c.date, c.delivered.toString(), c.region]),
        filename: 'cod-deliveries'
      };
    }

    return {
      title: 'Payment History',
      headers: ['Record', 'Date', 'Amount', 'Method', 'Status'],
      rows: this.payments.map((p) => [p.id, p.date, `₹${p.amount}`, p.method, p.status]),
      filename: 'payments'
    };
  }

  statusClass(status: string): string {
    return status ? status.toLowerCase().replace(/\s+/g, '-') : '';
  }

  downloadCSV(): void {
    const tableData = this.activeTableData;
    if (!tableData.rows.length) return;
    const csv = [tableData.headers, ...tableData.rows].map((row) => row.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableData.filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadPDF(): void {
    const tableData = this.activeTableData;
    if (!tableData.rows.length) return;
    const tableRows = tableData.rows.map((row) => `
      <tr>
        ${row.map((cell) => `<td>${cell}</td>`).join('')}
      </tr>
    `).join('');

    const html = `
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${tableData.title}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 10px; border: 1px solid #ddd; text-align: left; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>${tableData.title}</h2>
        <table>
          <thead><tr>${tableData.headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 400);
  }
}
