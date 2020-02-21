import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ColPickerComponent } from "./col-picker/col-picker.component";
import { EventDirective } from "./directives/event.directive";

@NgModule({
  declarations: [AppComponent, ColPickerComponent, EventDirective],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
