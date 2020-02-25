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

    const isCircleCanvas: boolean = !!evt.target.closest("#color-circle");
    if (isCircleCanvas) {
      this.downFlg = true;
      this.coord.emit({ x: clientX, y: clientY, downFlg: this.downFlg });
    }
  }

  @HostListener("touchend", ["$event"]) onTouchEnd(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if (this.downFlg) {
      this.downFlg = false;
    }
  }

  @HostListener("touchmove", ["$event"]) onTouchMove(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.touches[0].clientX;
    const clientY = evt.touches[0].clientY;

    if (this.downFlg) {
      this.coord.emit({ x: clientX, y: clientY, downFlg: this.downFlg });
    }
  }

  @HostListener("mousedown", ["$event"]) onMouseDown(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const isCircleCanvas: boolean = !!evt.target.closest("#color-circle");
    if (isCircleCanvas) {
      this.downFlg = true;
    }
  }

  @HostListener("document:mouseup", ["$event"]) onMouseUp(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.clientX;
    const clientY = evt.clientY;

    if (this.downFlg) {
      this.coord.emit({ x: clientX, y: clientY, downFlg: this.downFlg });
      this.downFlg = false;
    }
  }

  @HostListener("mouseleave", ["$event"]) onMouseLeave(evt) {}

  @HostListener("document:mousemove", ["$event"]) onMouseMove(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const clientX = evt.clientX;
    const clientY = evt.clientY;

    if (this.downFlg) {
      this.coord.emit({ x: clientX, y: clientY, downFlg: this.downFlg });
    }
  }
}
