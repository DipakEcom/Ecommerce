import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HeroSlide {
  badge: string;
  title: string;
  subtitle: string;
  theme: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  activeSlide = 0;
  slideInterval?: number;

  heroSlides: HeroSlide[] = [
    {
      badge: 'GRWM SALE',
      title: 'It ends tonight',
      subtitle: 'From ₹99 — shop now and enjoy instant discounts.',
      theme: 'slide-one'
    },
    {
      badge: 'Featured Style',
      title: 'New summer looks',
      subtitle: 'Refresh your wardrobe with trending pieces.',
      theme: 'slide-two'
    },
    {
      badge: 'Limited Offer',
      title: 'Men’s collection',
      subtitle: 'Fresh arrivals for every occasion.',
      theme: 'slide-three'
    },
    {
      badge: 'Flash Deals',
      title: 'Up to 80% off',
      subtitle: 'Grab the best offers before they disappear.',
      theme: 'slide-four'
    }
  ];

  ngOnInit(): void {
    this.slideInterval = window.setInterval(() => this.nextSlide(), 5000);
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      window.clearInterval(this.slideInterval);
    }
  }

  setSlide(index: number): void {
    this.activeSlide = index;
  }

  private nextSlide(): void {
    this.activeSlide = (this.activeSlide + 1) % this.heroSlides.length;
  }
}
