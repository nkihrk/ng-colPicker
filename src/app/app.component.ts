import { Component, ViewChild, ElementRef } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss", "./_reset.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild("container", { static: true }) container: ElementRef;

  public flg: boolean = true;
  private count: number = 0;

  setBgColor($event) {
    if (this.count === 1) {
      this.flg = false;
    } else if (this.count <= 1) {
      this.count++;
    }
    this.container.nativeElement.style.backgroundColor = `rgb(${$event.r}, ${$event.g}, ${$event.b})`;
  }
}
