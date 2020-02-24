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

  setBgColor($event) {
    this.container.nativeElement.style.backgroundColor = `rgb(${$event.r}, ${$event.g}, ${$event.b})`;
  }
}
