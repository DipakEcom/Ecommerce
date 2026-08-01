import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  brand: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  color: string;
  size: string;
  rating: number;
  badge?: string;
  label?: string;
  installments?: string;
  stockNote?: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  selectedSort = 'Popularity';
  priceRange = {
    min: 150,
    max: 1500,
    from: 150,
    to: 1500
  };
  selectedBrands = new Set<string>();
  selectedColors = new Set<string>();
  selectedSizes = new Set<string>();

  sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest First'];
  brandOptions = ['Pepe Jeans', 'Metronaut Plus', 'Stoneberg', 'RODEZ', 'CAMBREEN', 'S-LINE'];
  colorOptions = ['Black', 'Blue', 'Green', 'White', 'Pink'];
  sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  products: Product[] = [
    {
      id: 1,
      brand: 'Pepe Jeans',
      title: 'Boys Regular Fit Checked Shirt',
      image: 'assets/product-pepejeans.svg',
      price: 443,
      originalPrice: 1299,
      discount: 65,
      color: 'Blue',
      size: 'M',
      rating: 4.4,
      badge: 'Sponsored',
      installments: 'Or Pay ₹425 + 3',
      stockNote: 'Lowest Price Live'
    },
    {
      id: 2,
      brand: 'METRONAUT PLUS',
      title: 'Men Regular Fit Solid Shirt',
      image: 'assets/product-metronaut.svg',
      price: 450,
      originalPrice: 1999,
      discount: 77,
      color: 'Green',
      size: 'L',
      rating: 4.1,
      badge: 'Sponsored',
      installments: 'Or Pay ₹425 + 3',
      stockNote: ''
    },
    {
      id: 3,
      brand: 'STONEBERG',
      title: 'Men Slim Fit Solid Casual Shirt',
      image: 'assets/product-stoneberg.svg',
      price: 357,
      originalPrice: 1599,
      discount: 77,
      color: 'White',
      size: 'XL',
      rating: 4.2,
      badge: 'Sponsored',
      installments: 'Or Pay ₹334 + 3',
      stockNote: 'Save Deal'
    },
    {
      id: 4,
      brand: 'RODEZ',
      title: 'Men Slim Fit Striped Spread Collar Shirt',
      image: 'assets/product-rodez.svg',
      price: 259,
      originalPrice: 1490,
      discount: 82,
      color: 'Blue',
      size: 'L',
      rating: 4.0,
      badge: 'Best Seller',
      installments: 'Or Pay ₹241 + 3',
      stockNote: ''
    },
    {
      id: 5,
      brand: 'CAMBREEN',
      title: 'Men Regular Fit Striped Shirt',
      image: 'assets/product-cambreen.svg',
      price: 268,
      originalPrice: 1399,
      discount: 80,
      color: 'White',
      size: 'XL',
      rating: 4.1,
      badge: 'Only 3 left',
      installments: 'Or Pay ₹234 + 3',
      stockNote: ''
    },
    {
      id: 6,
      brand: 'S-LINE',
      title: 'Men Slim Fit Checkered Shirt',
      image: 'assets/product-sline.svg',
      price: 320,
      originalPrice: 1999,
      discount: 83,
      color: 'Black',
      size: 'M',
      rating: 4.3,
      badge: 'Sponsored',
      installments: 'Or Pay ₹299 + 3',
      stockNote: ''
    }
  ];

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem('customProducts');
      if (raw) {
        const custom = JSON.parse(raw) as Product[];
        // prepend or append custom products — we'll prepend so they appear first
        this.products = [...custom, ...this.products];
      }
    } catch (err) {
      console.error('Failed to load custom products', err);
    }
  }

  get visibleCount() {
    return this.filteredProducts.length;
  }

  get filteredProducts(): Product[] {
    return this.products
      .filter(product => {
        const brandMatch = this.selectedBrands.size === 0 || this.selectedBrands.has(product.brand);
        const colorMatch = this.selectedColors.size === 0 || this.selectedColors.has(product.color);
        const sizeMatch = this.selectedSizes.size === 0 || this.selectedSizes.has(product.size);
        const priceMatch = product.price >= this.priceRange.from && product.price <= this.priceRange.to;
        return brandMatch && colorMatch && sizeMatch && priceMatch;
      })
      .sort((a, b) => {
        if (this.selectedSort === 'Price: Low to High') {
          return a.price - b.price;
        }
        if (this.selectedSort === 'Price: High to Low') {
          return b.price - a.price;
        }
        if (this.selectedSort === 'Newest First') {
          return b.id - a.id;
        }
        return a.id - b.id;
      });
  }

  toggleSelection(set: Set<string>, value: string): void {
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
  }

  formatPrice(value: number): string {
    return `₹${value}`;
  }
}
