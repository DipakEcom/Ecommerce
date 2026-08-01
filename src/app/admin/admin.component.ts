import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

interface ProductPayload {
  brand: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  color: string;
  size: string;
  badge?: string;
  installments?: string;
  stockNote?: string;
  image?: string; // data URL
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // Replace or extend these with real admin emails in production
  allowedAdmins = [
    'admin@fashionzone.test',
    'owner@fashionzone.test',
    'manager@fashionzone.test'
  ];
  user: any = null;
  isAdmin = false;
  adminEmail = '';

  model: ProductPayload = {
    brand: '',
    title: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    color: '',
    size: '',
    badge: '',
    installments: '',
    stockNote: '',
    image: ''
  };

  constructor(private auth: AuthService) {
    const stored = localStorage.getItem('isAdmin');
    if (stored === 'true') {
      this.isAdmin = true;
    }
  }

  async signIn() {
    try {
      const cred = await this.auth.signInWithGoogle();
      this.user = cred.user;
      const email = this.user?.email || '';
      if (this.allowedAdmins.includes(email)) {
        this.isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
      } else {
        alert('You are not an admin.');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  }

  signInDummy() {
    const email = this.adminEmail.trim();
    if (!email) {
      alert('Enter a dummy admin email.');
      return;
    }
    if (this.allowedAdmins.includes(email)) {
      this.user = { email };
      this.isAdmin = true;
      localStorage.setItem('isAdmin', 'true');
      alert(`Signed in as ${email}`);
    } else {
      alert('This email is not in the allowed admin list.');
    }
  }

  signOutLocal() {
    this.isAdmin = false;
    localStorage.removeItem('isAdmin');
    this.user = null;
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.model.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addProduct() {
    const raw = localStorage.getItem('customProducts');
    const arr = raw ? JSON.parse(raw) : [];
    const nextId = arr.length ? Math.max(...arr.map((p: any) => p.id)) + 1 : 1000;
    const product = {
      id: nextId,
      brand: this.model.brand,
      title: this.model.title,
      image: this.model.image || 'assets/product-placeholder.svg',
      price: Number(this.model.price),
      originalPrice: Number(this.model.originalPrice),
      discount: Number(this.model.discount),
      color: this.model.color,
      size: this.model.size,
      rating: 0,
      badge: this.model.badge,
      installments: this.model.installments,
      stockNote: this.model.stockNote
    };
    arr.push(product);
    localStorage.setItem('customProducts', JSON.stringify(arr));
    alert('Product added — it will appear on the products page.');
    this.resetForm();
  }

  resetForm() {
    this.model = {
      brand: '',
      title: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      color: '',
      size: '',
      badge: '',
      installments: '',
      stockNote: '',
      image: ''
    };
  }
}
