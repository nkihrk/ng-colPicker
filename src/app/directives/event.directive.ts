import { Directive, HostListener, Output, EventEmitter } from "@angular/core";

@Directive({
  selector: "[appEvent]"
})
export class EventDirective {
  @Output() coord = new EventEmitter<any>();

  private downFlg: boolean = false;

  constructor() {}

  @HostListener("touchstart", ["$event"]) onTouchStart(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.touches[0].clientX;
    const clientY = evt.touches[0].clientY;

    const isTriangleCanvas: boolean = !!evt.target.closest("#color-triangle");
    if (isTriangleCanvas) {
      this.downFlg = true;
      this.coord.emit({ x: clientX, y: clientY });
    }
  }

  @HostListener("touchend", ["$event"]) onTouchEnd(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.touches[0].clientX;
    const clientY = evt.touches[0].clientY;

    if (this.downFlg) {
      this.downFlg = false;
      this.coord.emit({ x: clientX, y: clientY });
    }
  }

  @HostListener("touchmove", ["$event"]) onTouchMove(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.clientX;
    const clientY = evt.clientY;

    if (this.downFlg) {
      this.coord.emit({ x: clientX, y: clientY });
    }
  }

  @HostListener("mousedown", ["$event"]) onMouseDown(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.clientX;
    const clientY = evt.clientY;

    const isTriangleCanvas: boolean = !!evt.target.closest("#color-triangle");
    if (isTriangleCanvas) {
      this.downFlg = true;
      this.coord.emit({ x: clientX, y: clientY });
    }
  }

  @HostListener("document:mouseup", ["$event"]) onMouseUp(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.clientX;
    const clientY = evt.clientY;

    if (this.downFlg) {
      this.downFlg = false;
      this.coord.emit({ x: clientX, y: clientY });
    }
  }

  @HostListener("mouseleave", ["$event"]) onMouseLeave(evt) {}

  @HostListener("document:mousemove", ["$event"]) onMouseMove(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.clientX;
    const clientY = evt.clientY;

    if (this.downFlg) {
      this.coord.emit({ x: clientX, y: clientY });
    }
  }
}
