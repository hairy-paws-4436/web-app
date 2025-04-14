import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {Carousel} from "primeng/carousel";
import {PrimeTemplate} from "primeng/api";
import {Ripple} from "primeng/ripple";

interface CarouselItem {
  title: string;
  image: string;
  text: string;
}

@Component({
  selector: 'app-carousel-register',
  imports: [
    ButtonDirective,
    Carousel,
    PrimeTemplate,
    Ripple
  ],
  templateUrl: './carousel-register.component.html',
  styleUrl: './carousel-register.component.css'
})


export class CarouselRegisterComponent implements OnInit {
  carouselItems: CarouselItem[] = [];

  ngOnInit() {
    this.carouselItems = [
      {
        title: 'Browse pets',
        image: 'https://i.postimg.cc/k5CZsGhY/image.png',
        text: 'Find the perfect pet for you.'
      },
      {
        title: 'View details',
        image: 'https://i.postimg.cc/BQXGPjdx/image.png',
        text: 'Learn more about their personality and needs.'
      },
      {
        title: 'Schedule a visit',
        image: 'https://i.postimg.cc/t46QDLRJ/image.png',
        text: 'Meet the pet in person or virtually.'
      },
      {
        title: 'Talk with the owner',
        image: 'https://i.postimg.cc/GpJ0nGy1/image.png',
        text: 'Ask questions and clarify everything.'
      },

    ];
  }
}
