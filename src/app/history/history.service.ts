import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SiteStats {
  visitors: number;
  onlineOrders: number;
  codDelivered: number;
  paymentsReceived: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  customer: string;
  amount: number;
  paymentMethod: string;
  status: string;
}

export interface VisitorRecord {
  id: string;
  date: string;
  visitors: number;
  source: string;
}

export interface CodRecord {
  id: string;
  date: string;
  delivered: number;
  region: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  // TODO: Replace mock implementation with real API / Firebase calls
  getStats(): Observable<SiteStats> {
    const mock: SiteStats = {
      visitors: 12456,
      onlineOrders: 582,
      codDelivered: 213,
      paymentsReceived: 369
    };
    return of(mock);
  }

  getOrders(): Observable<OrderRecord[]> {
    const mock: OrderRecord[] = [
      { id: 'ORD-1001', date: '2026-07-30', customer: 'Asha K.', amount: 1299, paymentMethod: 'Online', status: 'Delivered' },
      { id: 'ORD-1002', date: '2026-07-31', customer: 'Rahul P.', amount: 799, paymentMethod: 'COD', status: 'Delivered' },
      { id: 'ORD-1003', date: '2026-08-01', customer: 'Maya S.', amount: 1599, paymentMethod: 'Online', status: 'Processing' },
      { id: 'ORD-1004', date: '2026-08-01', customer: 'Karan D.', amount: 499, paymentMethod: 'COD', status: 'Shipped' }
    ];
    return of(mock);
  }

  getVisitorHistory(): Observable<VisitorRecord[]> {
    const mock: VisitorRecord[] = [
      { id: 'VIS-101', date: '2026-07-28', visitors: 3200, source: 'Organic' },
      { id: 'VIS-102', date: '2026-07-29', visitors: 4120, source: 'Social' },
      { id: 'VIS-103', date: '2026-07-30', visitors: 3915, source: 'Referral' },
      { id: 'VIS-104', date: '2026-07-31', visitors: 4450, source: 'Direct' }
    ];
    return of(mock);
  }

  getCodHistory(): Observable<CodRecord[]> {
    const mock: CodRecord[] = [
      { id: 'COD-201', date: '2026-07-28', delivered: 34, region: 'North' },
      { id: 'COD-202', date: '2026-07-29', delivered: 27, region: 'West' },
      { id: 'COD-203', date: '2026-07-30', delivered: 41, region: 'South' },
      { id: 'COD-204', date: '2026-07-31', delivered: 29, region: 'East' }
    ];
    return of(mock);
  }

  getPaymentHistory(): Observable<PaymentRecord[]> {
    const mock: PaymentRecord[] = [
      { id: 'PAY-301', date: '2026-07-28', amount: 12400, method: 'UPI', status: 'Success' },
      { id: 'PAY-302', date: '2026-07-29', amount: 8720, method: 'Card', status: 'Success' },
      { id: 'PAY-303', date: '2026-07-30', amount: 10650, method: 'Wallet', status: 'Pending' },
      { id: 'PAY-304', date: '2026-07-31', amount: 11500, method: 'Netbanking', status: 'Success' }
    ];
    return of(mock);
  }
}
