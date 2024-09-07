import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  logoImage: WritableSignal<string> = signal(this.setBrandImage());

  constructor() {}

  setBrandImage() {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      return '/assets/WhiteLogo.png';
    } else {
      return '/assets/ColoredLogo.png';
    }
  }
}
