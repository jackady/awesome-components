import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[highlight]'
})
export class HighlightDirective implements AfterViewInit {

    @Input() color = 'yellow';

    constructor(private readonly ref: ElementRef,
                private readonly renderer: Renderer2) {}

    ngAfterViewInit() {
        this.setBackgroundColor(this.color);
    }

    setBackgroundColor(color: string) {
        this.renderer.setStyle(this.ref.nativeElement, 'background-color', color);
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.setBackgroundColor('lightgreen');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.setBackgroundColor(this.color);
    }

    @HostListener('click') onClick() {
        this.color = 'lightgreen';
    }
}