import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, 'reveal-ready');

    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(this.elementRef.nativeElement, 'reveal-visible');
      return;
    }

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.renderer.addClass(this.elementRef.nativeElement, 'reveal-visible');
        this.observer?.unobserve(this.elementRef.nativeElement);
      }
    }, { threshold: 0.12 });

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
