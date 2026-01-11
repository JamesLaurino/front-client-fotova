import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appProductBorder]'
})
export class ProductBorderDirective {

  private readonly hoverColor = '#3F333A';

  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;

    // Bordure TOUJOURS présente
    element.style.border = '3px solid transparent';
    element.style.boxSizing = 'border-box';
    element.style.transition = 'border-color 0.2s ease, transform 0.2s ease';
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.borderColor = this.hoverColor;
    this.el.nativeElement.style.transform = 'translateY(-2px)';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.borderColor = 'transparent';
    this.el.nativeElement.style.transform = 'translateY(0)';
  }
}
