import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-col-picker",
  templateUrl: "./col-picker.component.html",
  styleUrls: ["./col-picker.component.scss"]
})
export class ColPickerComponent implements OnInit {
  @ViewChild("colpick", { static: true }) wrapper: ElementRef;
  @ViewChild("colorWheel", { static: true }) wheel: ElementRef;
  @ViewChild("sliderColor", { static: true }) sliderColor: ElementRef;
  @ViewChild("inputH", { static: true }) inputH: ElementRef;
  @ViewChild("inputS", { static: true }) inputS: ElementRef;
  @ViewChild("inputB", { static: true }) inputB: ElementRef;
  @ViewChild("canvasH", { static: true }) canvasH: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild("canvasS", { static: true }) canvasS: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild("canvasB", { static: true }) canvasB: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild("colorTriangle", { static: true }) triangle: ElementRef<
    HTMLCanvasElement
  >;

  constructor() {}

  ngOnInit() {
    const wrapper = this.wrapper.nativeElement;
    const size = wrapper.clientWidth;
    const wheelRadius = size / 2;
    const wheelThickness = (size / 2) * 0.16;
    const wheelInnerRadius = wheelRadius - wheelThickness;
    const triangleRadius = (wheelRadius - wheelThickness) * 0.99;
    const originX = wrapper.style.left;
    const originY = wrapper.style.top;
    const centerX = originX + size / 2;
    const centerY = originY + size / 2;

    this.wrapperWidth = size;
    this.radius = wheelRadius;
    this.innerRadius = wheelInnerRadius;
    this.thickness = wheelThickness;
    this.triangleRadius = triangleRadius;

    this.drawWheel();
    this.drawTriangle();
    this._drawHue();
    this._drawSaturation();
    this._drawBrightness();
  }

  private huePos: number = 0;
  private saturatePos: number = 0;
  private brightPos: number = 0;

  private wrapperWidth: number;
  private radius: number;
  private innerRadius: number;
  private thickness: number;
  private canvasColor: string = "#535353";
  private triangleRadius: number;

  _drawHue() {
    const c = this.canvasH.nativeElement;
    c.width = this.sliderColor.nativeElement.clientWidth;
    c.height = this.sliderColor.nativeElement.clientHeight;
    const ctx = c.getContext("2d");

    const grd = ctx.createLinearGradient(5, 3, c.width - 10, 6);
    grd.addColorStop(0, "rgb(255,   0,   0)");
    grd.addColorStop(0.15, "rgb(255, 255,   0)");
    grd.addColorStop(0.33, "rgb(0,   255,   0)");
    grd.addColorStop(0.49, "rgb(0,   255, 255)");
    grd.addColorStop(0.67, "rgb(0,     0, 255)");
    grd.addColorStop(0.84, "rgb(255,   0, 255)");
    grd.addColorStop(1, "rgb(255,   0,   0)");
    ctx.fillStyle = grd;
    ctx.fillRect(5, 3, c.width - 10, 6);

    const pos: number = this.huePos + 6;
    this._showSelectBar(ctx, pos);

    this.inputH.nativeElement.value = 0;
  }

  _drawSaturation() {
    const c = this.canvasS.nativeElement;
    c.width = this.sliderColor.nativeElement.clientWidth;
    c.height = this.sliderColor.nativeElement.clientHeight;
    const ctx = c.getContext("2d");

    const grd = ctx.createLinearGradient(5, 3, c.width - 10, 6);
    grd.addColorStop(0, "white");
    grd.addColorStop(1, "red");
    ctx.fillStyle = grd;
    ctx.fillRect(5, 3, c.width - 10, 6);

    const pos: number = this.saturatePos + 6;
    this._showSelectBar(ctx, pos);

    this.inputS.nativeElement.value = 0;
  }

  _drawBrightness() {
    const c = this.canvasB.nativeElement;
    c.width = this.sliderColor.nativeElement.clientWidth;
    c.height = this.sliderColor.nativeElement.clientHeight;
    const ctx = c.getContext("2d");

    const grd = ctx.createLinearGradient(5, 3, c.width - 10, 6);
    grd.addColorStop(0, "black");
    grd.addColorStop(1, "white");
    ctx.fillStyle = grd;
    ctx.fillRect(5, 3, c.width - 10, 6);

    const pos: number = c.width - 6;
    this._showSelectBar(ctx, pos);

    this.inputB.nativeElement.value = 100;
  }

  _showSelectBar(ctx: any, pos: number) {
    ctx.beginPath();
    ctx.moveTo(pos, 10);
    ctx.lineTo(pos - 5, 16);
    ctx.lineTo(pos - 5, 19);
    ctx.lineTo(pos - 4, 20);
    ctx.lineTo(pos + 4, 20);
    ctx.lineTo(pos + 5, 19);
    ctx.lineTo(pos + 5, 16);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.fill();
  }

  /**
   * Color wheel
   *
   */
  drawWheel() {
    const resolution = 1;
    const outerRadius = this.radius;
    const innerRadius = this.innerRadius;
    const root = this.wheel;

    // this._createWheelCircle();
    this._generateConicGradiant(outerRadius, resolution, root);
    this._generateOverlay(outerRadius, innerRadius, root);
  }

  //

  _generateOverlay(outerRadius, innerRadius, target) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("cx", outerRadius);
    circle.setAttribute("cy", outerRadius);
    circle.setAttribute("r", innerRadius);
    circle.setAttribute("fill", this.canvasColor);

    target.nativeElement.appendChild(circle);
  }

  _generateConicGradiant(radius, resolution, target) {
    for (let i = 0; i < 360 * resolution; i++) {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      path.setAttribute(
        "d",
        this._describeArc(
          radius,
          radius,
          radius,
          i / resolution,
          (i + 2) / resolution
        )
      );
      path.setAttribute("fill", `hsl(${i / resolution}, 100%, 50%)`);

      target.nativeElement.appendChild(path);
    }
  }

  _describeArc(x, y, radius, startAngle, endAngle) {
    const start = this._polar2Cartesian(x, y, radius, endAngle);
    const end = this._polar2Cartesian(x, y, radius, startAngle);

    const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    const setD = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      arcSweep,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
      "L",
      start.x,
      start.y
    ].join(" ");

    return setD;
  }

  _polar2Cartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  // _createWheelCircle() {
  //   const wheelCircle = document.createElement('div');
  //   const r = this.innerRadius + this.thickness / 2;
  //   const left =
  //     r * Math.cos(this.options.THETA + (3 / 2) * Math.PI) + this.wrapperWidth / 2;
  //   const top =
  //     r * Math.sin(this.options.THETA + (3 / 2) * Math.PI) + this.wrapperWidth / 2;

  //   wheelCircle.id = 'color-wheel-circle';
  //   wheelCircle.style.left = `${left}px`;
  //   wheelCircle.style.top = `${top}px`;
  //   wheelCircle.style.backgroundColor = `hsla(${Math.round(
  //     this.options.HUE
  //   )}, 100%, 50%, 1)`;
  // }

  // _colorWheelArea(e) {
  //   const isWheelArea = this._isWheelArea(e);
  //   if (isWheelArea) this._updateWheelCircle(e);
  // }

  // _isWheelArea(e) {
  //   const minR = this.colorWheel.innerRadius;
  //   const maxR = this.colorWheel.radius;
  //   const mouseR = LibEve.getDistance(
  //     this.param.centerPos.x,
  //     this.param.centerPos.y,
  //     e.clientX,
  //     e.clientY
  //   );

  //   if (mouseR > minR && maxR > mouseR) return true;
  //   return false;
  // }

  // _updateWheelCircle(e) {
  //   const pointer = this.wheelCircle;
  //   const r = this.colorWheel.innerRadius + this.colorWheel.thickness / 2;
  //   const theta = this._calculateTheta(e);
  //   const left = r * Math.cos(theta) + this.param.size / 2;
  //   const top = r * Math.sin(theta) + this.param.size / 2;
  //   pointer.style.left = `${left}px`;
  //   pointer.style.top = `${top}px`;

  //   const hue = this._calculateHue(e);
  //   this.param.color.hue = hue;
  //   this._updateTriangle(e);

  //   $('#color-wheel-circle').css(
  //     'background-color',
  //     `hsla(${Math.round(this.param.color.hue)}, 100%, 50%, 1)`
  //   );
  // }

  // _calculateTheta(e) {
  //   const rad =
  //     (Math.atan2(
  //       e.clientY - this.param.centerPos.y,
  //       e.clientX - this.param.centerPos.x
  //     ) /
  //       Math.PI) *
  //     180 +
  //     (Math.atan2(
  //       e.clientY - this.param.centerPos.y,
  //       e.clientX - this.param.centerPos.x
  //     ) > 0
  //       ? 0
  //       : 360);

  //   return (rad / 180) * Math.PI;
  // }

  // _calculateHue(e) {
  //   const deg =
  //     (Math.atan2(
  //       e.clientY - this.param.centerPos.y,
  //       e.clientX - this.param.centerPos.x
  //     ) /
  //       Math.PI) *
  //     180 +
  //     90 +
  //     ((Math.atan2(
  //       e.clientY - this.param.centerPos.y,
  //       e.clientX - this.param.centerPos.x
  //     ) /
  //       Math.PI) *
  //       180 +
  //       90 >
  //       0
  //       ? 0
  //       : 360);

  //   return deg;
  // }

  /**
   * Color triangle
   *
   */
  drawTriangle() {
    this._initTriangle();
    // this._getTriangleColor();
  }

  _initTriangle() {
    const c = this.triangle.nativeElement;
    c.width = this.wrapperWidth;
    c.height = this.wrapperWidth;
    const ctx = c.getContext("2d");

    const leftTopX = Math.cos((Math.PI * 2) / 3) * this.triangleRadius;
    const leftTopY = Math.sin((Math.PI * 2) / 3) * this.triangleRadius;

    ctx.clearRect(0, 0, this.wrapperWidth, this.wrapperWidth);
    ctx.save();
    ctx.translate(this.radius, this.radius);

    ctx.beginPath();
    ctx.moveTo(leftTopX, leftTopY);
    ctx.lineTo(this.triangleRadius, 0);
    ctx.lineTo(leftTopX, -leftTopY);
    ctx.closePath();
    // ctx.stroke();
    ctx.clip();
    ctx.fillRect(
      -this.radius,
      -this.radius,
      this.wrapperWidth,
      this.wrapperWidth
    );

    const grad0 = ctx.createLinearGradient(this.triangleRadius, 0, leftTopX, 0);
    const hsla = `hsla(${Math.round(0)}, 100%, 50%, `;
    grad0.addColorStop(0, `${hsla}1)`);
    grad0.addColorStop(1, `${hsla}0)`);
    ctx.fillStyle = grad0;
    ctx.fillRect(
      -this.radius,
      -this.radius,
      this.wrapperWidth,
      this.wrapperWidth
    );

    const grad1 = ctx.createLinearGradient(
      leftTopX,
      -leftTopY,
      (leftTopX + this.triangleRadius) / 2,
      leftTopY / 2
    );
    grad1.addColorStop(0.0, "rgba(255, 255, 255, 1)");
    grad1.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = grad1;
    ctx.fillRect(
      -this.radius,
      -this.radius,
      this.wrapperWidth,
      this.wrapperWidth
    );
    ctx.restore();

    // Triangle
    ctx.beginPath();
    ctx.translate(this.radius, this.radius);
    ctx.arc(leftTopX, -leftTopY, 5, 0, 2 * Math.PI);
    ctx.stroke();

    // Wheel
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.arc(0, -(this.innerRadius + this.thickness / 2), 6, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // _updateTriangle() {
  //   this._initTriangle();
  //   this._setRgb('#color-triangle-circle');
  // }

  // _createTriangleCircle() {
  //   const triangleCircle = D.createElement('div');
  //   triangleCircle.id = 'color-triangle-circle';
  //   triangleCircle.style.left = `${this.colorTriangle.circlePos.x}px`;
  //   triangleCircle.style.top = `${this.colorTriangle.circlePos.y}px`;

  //   this.triangleCircle = triangleCircle;
  //   this.param.container.appendChild(triangleCircle);
  //   this._setRgb('#color-triangle-circle');
  // }

  // _colorTriangleArea(e) {
  //   const isTriangleArea = this._isTriangleArea(e);
  //   if (isTriangleArea) this._updateTriangleCircle(e);
  // }

  // _isTriangleArea(e) {
  //   const mouseX = e.clientX - this.param.centerPos.x;
  //   const mouseY = e.clientY - this.param.centerPos.y;
  //   const minX = Math.cos((Math.PI * 2) / 3) * this.colorTriangle.radius;
  //   const maxX = this.colorTriangle.radius;
  //   const maxY = (-mouseX + maxX) / Math.sqrt(3);

  //   if (mouseX > minX && maxX > mouseX) {
  //     if (Math.abs(mouseY) >= 0 && maxY >= Math.abs(mouseY)) return true;
  //   }
  //   return false;
  // }

  // _updateTriangleCircle(e) {
  //   const mouseX = e.clientX - this.param.centerPos.x;
  //   const mouseY = e.clientY - this.param.centerPos.y;

  //   const minX = Math.cos((Math.PI * 2) / 3) * this.colorTriangle.radius;
  //   const maxX = this.colorTriangle.radius;
  //   let minY = (mouseX - maxX) / Math.sqrt(3);
  //   let maxY = (-mouseX + maxX) / Math.sqrt(3);
  //   minY =
  //     mouseX <= minX
  //       ? -Math.sin((Math.PI * 2) / 3) * this.colorTriangle.radius
  //       : minY;
  //   maxY =
  //     mouseX <= minX
  //       ? Math.sin((Math.PI * 2) / 3) * this.colorTriangle.radius
  //       : maxY;

  //   const pointer = this.triangleCircle;
  //   const $container = $(this.param.container);
  //   const parentNodeX = $container.offset().left;
  //   const parentNodeY = $container.offset().top;
  //   const left = e.clientX - parentNodeX;
  //   const top = e.clientY - parentNodeY;

  //   if (minX < mouseX && mouseX < maxX) {
  //     pointer.style.left = `${left}px`;
  //     if (mouseY >= maxY) {
  //       pointer.style.top = `${maxY + this.param.size / 2}px`;
  //     } else if (minY >= mouseY) {
  //       pointer.style.top = `${minY + this.param.size / 2}px`;
  //     } else {
  //       pointer.style.top = `${top}px`;
  //     }
  //   } else if (mouseX <= minX) {
  //     pointer.style.left = `${minX + this.param.size / 2}px`;
  //     if (maxY <= mouseY) {
  //       pointer.style.top = `${maxY + this.param.size / 2}px`;
  //     } else if (mouseY <= minY) {
  //       pointer.style.top = `${minY + this.param.size / 2}px`;
  //     } else {
  //       pointer.style.top = `${top}px`;
  //     }
  //   } else if (maxX <= mouseX) {
  //     pointer.style.left = `${maxX + this.param.size / 2}px`;
  //     pointer.style.top = `${this.param.size / 2}px`;
  //   }

  //   this.colorTriangle.circlePos.x = pointer.style.left.replace('px', '');
  //   this.colorTriangle.circlePos.y = pointer.style.top.replace('px', '');
  //   this._setRgb('#color-triangle-circle');
  // }

  // _setRgb(target) {
  //   const rgb = this._getTriangleColor();
  //   const r = rgb[0];
  //   const g = rgb[1];
  //   const b = rgb[2];

  //   this.param.color.rgb = [r, g, b];
  //   $(target).css('background-color', `rgb(${r},${g},${b})`);
  // }

  // _getRgba(x, y) {
  //   const ctx = this.triangleCtx;
  //   const imagedata = ctx.getImageData(x, y, 1, 1);
  //   const r = imagedata.data[0];
  //   const g = imagedata.data[1];
  //   const b = imagedata.data[2];
  //   const a = imagedata.data[3];

  //   return [r, g, b, a];
  // }

  // _getTriangleColor() {
  //   const x = this.colorTriangle.circlePos.x - this.param.size / 2;
  //   const y = this.colorTriangle.circlePos.y - this.param.size / 2;
  //   const leftTopX = Math.cos((Math.PI * 2) / 3) * this.colorTriangle.radius;
  //   const leftTopY = Math.sin((Math.PI * 2) / 3) * this.colorTriangle.radius;
  //   const a =
  //     -Math.tan(Math.PI / 6) * x - y - leftTopY + Math.tan(Math.PI / 6) * leftTopX;
  //   const k = Math.abs(a) * Math.sin(Math.PI / 3);
  //   const l = (this.colorTriangle.radius * 3) / 2;

  //   const hsl = [this.param.color.hue / 360, 1.0, 0.5];
  //   const b = LibEve.hsl2rgb(hsl);
  //   const s = [255, 255, 255];

  //   const co = [];
  //   let tmp;
  //   for (let i = 0; i < 3; i++) {
  //     tmp =
  //       (s[i] * (l - k)) / l +
  //       (b[i] * (l - (this.colorTriangle.radius - x))) / l;
  //     tmp = Math.abs(Math.round(tmp));
  //     co.push(tmp);
  //   }

  //   return co;
  // }
}
