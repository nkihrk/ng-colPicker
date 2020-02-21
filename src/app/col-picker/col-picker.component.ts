import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";

@Component({
  selector: "app-col-picker",
  templateUrl: "./col-picker.component.html",
  styleUrls: ["./col-picker.component.scss"]
})
export class ColPickerComponent implements OnInit {
  @ViewChild("colorBox1", { static: true }) colorBox1: ElementRef;
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

  @Output() currentColor = new EventEmitter<any>();

  private hue: number = 0;

  private wrapperWidth: number;
  private wheelOuterRadius: number;
  private wheelInnerRadius: number;
  private thickness: number;
  private canvasColor: string = "#535353";
  private triangleRadius: number;
  private centerX: number;
  private centerY: number;

  constructor() {}

  ngOnInit() {
    const wrapper = this.wrapper.nativeElement;
    const size = wrapper.clientWidth;
    const wheelRadius = size / 2;
    const wheelThickness = (size / 2) * 0.16;
    const wheelInnerRadius = wheelRadius - wheelThickness;
    const triangleRadius = (wheelRadius - wheelThickness) * 0.99;
    const originX = wrapper.getBoundingClientRect().left;
    const originY = wrapper.getBoundingClientRect().top;
    const centerX = originX + size / 2;
    const centerY = originY + size / 2;

    this.wrapperWidth = size;
    this.wheelOuterRadius = wheelRadius;
    this.wheelInnerRadius = wheelInnerRadius;
    this.thickness = wheelThickness;
    this.triangleRadius = triangleRadius;
    this.centerX = centerX;
    this.centerY = centerY;

    this.drawWheel();
    this.drawTriangle({});
    this.drawHue(0);
    this.drawSaturation(0, { h: 0, s: 0, b: 100 });
    this.drawBrightness(100, { h: 0, s: 0, b: 0 });
  }

  drawHue(val) {
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

    const pos: number = (val / 360) * (c.width - 13) + 6;
    this._showSelectBar(ctx, pos);

    this.inputH.nativeElement.value = val;
  }

  drawSaturation(val, hsb) {
    const c = this.canvasS.nativeElement;
    c.width = this.sliderColor.nativeElement.clientWidth;
    c.height = this.sliderColor.nativeElement.clientHeight;
    const ctx = c.getContext("2d");

    const hsl0 = this._hsv2hsl(hsb.h / 360, 1, hsb.b / 100);
    const hsl1 = this._hsv2hsl(hsb.h / 360, 0, hsb.b / 100);
    const grd = ctx.createLinearGradient(5, 3, c.width - 10, 6);
    grd.addColorStop(
      1,
      `hsl(${Math.floor(hsl0[0])}, ${Math.floor(hsl0[1] * 100)}%, ${Math.floor(
        hsl0[2] * 100
      )}%)`
    );
    grd.addColorStop(
      0,
      `hsl(${Math.floor(hsl1[0])}, ${Math.floor(hsl1[1] * 100)}%, ${Math.floor(
        hsl1[2] * 100
      )}%)`
    );
    ctx.fillStyle = grd;
    ctx.fillRect(5, 3, c.width - 10, 6);

    const pos: number = (val / 100) * (c.width - 13) + 6;
    this._showSelectBar(ctx, pos);

    this.inputS.nativeElement.value = val;
  }

  drawBrightness(val, hsb) {
    const c = this.canvasB.nativeElement;
    c.width = this.sliderColor.nativeElement.clientWidth;
    c.height = this.sliderColor.nativeElement.clientHeight;
    const ctx = c.getContext("2d");

    const hsl0 = this._hsv2hsl(hsb.h / 360, hsb.s / 100, 1);
    const hsl1 = this._hsv2hsl(hsb.h / 360, hsb.s / 100, 0);
    const grd = ctx.createLinearGradient(5, 3, c.width - 10, 6);
    grd.addColorStop(
      1,
      `hsl(${Math.floor(hsl0[0])}, ${Math.floor(hsl0[1] * 100)}%, ${Math.floor(
        hsl0[2] * 100
      )}%)`
    );
    grd.addColorStop(
      0,
      `hsl(${Math.floor(hsl1[0])}, ${Math.floor(hsl1[1] * 100)}%, ${Math.floor(
        hsl1[2] * 100
      )}%)`
    );
    ctx.fillStyle = grd;
    ctx.fillRect(5, 3, c.width - 10, 6);

    const pos: number = (val / 100) * (c.width - 13) + 6;
    this._showSelectBar(ctx, pos);

    this.inputB.nativeElement.value = val;
  }

  _hsv2hsl(h, s, v) {
    const l = ((2 - s) * v) / 2;

    if (l != 0) {
      if (l == 1) {
        s = 0;
      } else if (l < 0.5) {
        s = (s * v) / (l * 2);
      } else {
        s = (s * v) / (2 - l * 2);
      }
    }

    return [h, s, l];
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
    const outerRadius = this.wheelOuterRadius;
    const wheelInnerRadius = this.wheelInnerRadius;
    const root = this.wheel;

    // this._createWheelCircle();
    this._generateConicGradiant(outerRadius, resolution, root);
    this._generateOverlay(outerRadius, wheelInnerRadius, root);
  }

  //

  _generateOverlay(outerRadius, wheelInnerRadius, target) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("cx", outerRadius);
    circle.setAttribute("cy", outerRadius);
    circle.setAttribute("r", wheelInnerRadius);
    circle.setAttribute("fill", this.canvasColor);

    target.nativeElement.appendChild(circle);
  }

  _generateConicGradiant(wheelOuterRadius, resolution, target) {
    for (let i = 0; i < 360 * resolution; i++) {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      path.setAttribute(
        "d",
        this._describeArc(
          wheelOuterRadius,
          wheelOuterRadius,
          wheelOuterRadius,
          i / resolution,
          (i + 2) / resolution
        )
      );
      path.setAttribute("fill", `hsl(${i / resolution}, 100%, 50%)`);

      target.nativeElement.appendChild(path);
    }
  }

  _describeArc(x, y, wheelOuterRadius, startAngle, endAngle) {
    const start = this._polar2Cartesian(x, y, wheelOuterRadius, endAngle);
    const end = this._polar2Cartesian(x, y, wheelOuterRadius, startAngle);

    const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    const setD = [
      "M",
      start.x,
      start.y,
      "A",
      wheelOuterRadius,
      wheelOuterRadius,
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

  _polar2Cartesian(centerX, centerY, wheelOuterRadius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + wheelOuterRadius * Math.cos(angleInRadians),
      y: centerY + wheelOuterRadius * Math.sin(angleInRadians)
    };
  }

  // _createWheelCircle() {
  //   const wheelCircle = document.createElement('div');
  //   const r = this.wheelInnerRadius + this.thickness / 2;
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
  //   const minR = this.colorWheel.wheelInnerRadius;
  //   const maxR = this.colorWheel.wheelOuterRadius;
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
  //   const r = this.colorWheel.wheelInnerRadius + this.colorWheel.thickness / 2;
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

  drawTriangle($coord: any) {
    const c = this.triangle.nativeElement;
    c.width = this.wrapperWidth;
    c.height = this.wrapperWidth;
    const ctx = c.getContext("2d");

    const leftTopX = Math.cos((Math.PI * 2) / 3) * this.triangleRadius;
    const leftTopY = Math.sin((Math.PI * 2) / 3) * this.triangleRadius;

    ctx.clearRect(0, 0, this.wrapperWidth, this.wrapperWidth);
    ctx.save();
    ctx.translate(this.wheelOuterRadius, this.wheelOuterRadius);

    ctx.beginPath();
    ctx.moveTo(leftTopX, leftTopY);
    ctx.lineTo(this.triangleRadius, 0);
    ctx.lineTo(leftTopX, -leftTopY);
    ctx.closePath();
    ctx.stroke();
    ctx.clip();
    ctx.fillRect(
      -this.wheelOuterRadius,
      -this.wheelOuterRadius,
      this.wrapperWidth,
      this.wrapperWidth
    );

    const grad0 = ctx.createLinearGradient(this.triangleRadius, 0, leftTopX, 0);
    const hsla = `hsla(${Math.round(0)}, 100%, 50%, `;
    grad0.addColorStop(0, `${hsla}1)`);
    grad0.addColorStop(1, `${hsla}0)`);
    ctx.fillStyle = grad0;
    ctx.fillRect(
      -this.wheelOuterRadius,
      -this.wheelOuterRadius,
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
      -this.wheelOuterRadius,
      -this.wheelOuterRadius,
      this.wrapperWidth,
      this.wrapperWidth
    );
    ctx.restore();

    if (Object.keys($coord).length) {
      const isTriangleArea = this._isTriangleArea($coord);
      if (isTriangleArea) {
        const mouseX = $coord.x - this.centerX;
        const mouseY = $coord.y - this.centerY;
        const rgb = this._getRgb(mouseX, mouseY);
        const hsb = this._rgb2hsb(rgb[0], rgb[1], rgb[2]);
        this._drawCircleTriangle(ctx, mouseX, mouseY);
        this._getRgb(mouseX, mouseY);
        this._setHsb(hsb, rgb);
        // Just for now
        this._drawCircleWheel(ctx);
      } else {
        this._updateTriangleCircle(ctx, $coord);
        // Just for now
        this._drawCircleWheel(ctx);
      }
    } else {
      // Triangle
      this._drawCircleTriangle(ctx, leftTopX, -leftTopY);
      this._getRgb(leftTopX, -leftTopY);
      // Just for now
      this._drawCircleWheel(ctx);
    }
  }

  _drawCircleTriangle(ctx, mouseX, mouseY) {
    // Triangle
    ctx.beginPath();
    ctx.translate(this.wheelOuterRadius, this.wheelOuterRadius);
    ctx.arc(mouseX, mouseY, 5, 0, 2 * Math.PI);
    ctx.stroke();
  }

  _drawCircleWheel(ctx: CanvasRenderingContext2D) {
    // Wheel
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.arc(
      0,
      -(this.wheelInnerRadius + this.thickness / 2),
      6,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }

  // _updateTriangle() {
  //   this._initTriangle();
  //   this._getRgb('#color-triangle-circle');
  // }

  // _createTriangleCircle() {
  //   const triangleCircle = D.createElement('div');
  //   triangleCircle.id = 'color-triangle-circle';
  //   triangleCircle.style.left = `${this.colorTriangle.circlePos.x}px`;
  //   triangleCircle.style.top = `${this.colorTriangle.circlePos.y}px`;

  //   this.triangleCircle = triangleCircle;
  //   this.param.container.appendChild(triangleCircle);
  //   this._getRgb('#color-triangle-circle');
  // }

  // _colorTriangleArea(e) {
  //   const isTriangleArea = this._isTriangleArea(e);
  //   if (isTriangleArea) this._updateTriangleCircle(e);
  // }

  _isTriangleArea(e) {
    const mouseX = e.x - this.centerX;
    const mouseY = e.y - this.centerY;
    const minX = Math.cos((Math.PI * 2) / 3) * this.wheelInnerRadius;
    const maxX = this.wheelInnerRadius;
    const maxY = (-mouseX + maxX) / Math.sqrt(3);

    if (mouseX > minX && maxX > mouseX) {
      if (Math.abs(mouseY) >= 0 && maxY >= Math.abs(mouseY)) return true;
    }
    return false;
  }

  _updateTriangleCircle(ctx, e) {
    let x, y;
    const mouseX = e.x - this.centerX;
    const mouseY = e.y - this.centerY;

    const minX = Math.cos((Math.PI * 2) / 3) * this.triangleRadius;
    const maxX = this.triangleRadius;
    let minY = (mouseX - maxX) / Math.sqrt(3);
    let maxY = (-mouseX + maxX) / Math.sqrt(3);
    minY =
      mouseX <= minX
        ? -Math.sin((Math.PI * 2) / 3) * this.triangleRadius
        : minY;
    maxY =
      mouseX <= minX ? Math.sin((Math.PI * 2) / 3) * this.triangleRadius : maxY;

    if (minX < mouseX && mouseX < maxX) {
      x = mouseX;
      if (mouseY >= maxY) {
        y = maxY;
      } else if (minY >= mouseY) {
        y = minY;
      } else {
        y = mouseY;
      }
    } else if (mouseX <= minX) {
      x = minX;
      if (maxY <= mouseY) {
        y = maxY;
      } else if (mouseY <= minY) {
        y = minY;
      } else {
        y = mouseY;
      }
    } else if (maxX <= mouseX) {
      x = maxX;
      y = 0;
    }

    this._drawCircleTriangle(ctx, x, y);
    const rgb = this._getRgb(x, y);
    const hsb = this._rgb2hsb(rgb[0], rgb[1], rgb[2]);
    this._setHsb(hsb, rgb);
  }

  _setHsb(hsb, rgb) {
    this.colorBox1.nativeElement.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    this.currentColor.emit(rgb);
    this.drawHue(Math.floor(hsb.h));
    this.drawSaturation(Math.floor(hsb.s), hsb);
    this.drawBrightness(Math.floor(hsb.b), hsb);
  }

  _getRgb(circleX, circleY) {
    const rgb = this._getTriangleColor(circleX, circleY);
    return rgb;
  }

  _getTriangleColor(circleX, circleY) {
    const x = circleX;
    const y = circleY;
    const leftTopX = Math.cos((Math.PI * 2) / 3) * this.triangleRadius;
    const leftTopY = Math.sin((Math.PI * 2) / 3) * this.triangleRadius;
    const a =
      -Math.tan(Math.PI / 6) * x -
      y -
      leftTopY +
      Math.tan(Math.PI / 6) * leftTopX;
    const k = Math.abs(a) * Math.sin(Math.PI / 3);
    const l = (this.triangleRadius * 3) / 2;

    const hsl = [this.hue / 360, 1.0, 0.5];
    const b = this._hsl2rgb(hsl);
    const s = [255, 255, 255];

    const co = [];
    let tmp;
    for (let i = 0; i < 3; i++) {
      tmp = (s[i] * (l - k)) / l + (b[i] * (l - (this.triangleRadius - x))) / l;
      tmp = Math.abs(Math.round(tmp));
      co.push(tmp);
    }

    return co;
  }

  _hsl2rgb(hsl) {
    let r;
    let g;
    let b;

    function __hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

      return p;
    }

    if (hsl[1] === 0) {
      r = 1;
      g = 1;
      b = hsl[2];
    } else {
      const q =
        hsl[2] < 0.5
          ? hsl[2] * (1 + hsl[1])
          : hsl[2] + hsl[1] - hsl[2] * hsl[1];
      const p = 2 * hsl[2] - q;
      r = __hue2rgb(p, q, hsl[0] + 1 / 3);
      g = __hue2rgb(p, q, hsl[0]);
      b = __hue2rgb(p, q, hsl[0] - 1 / 3);
    }

    return [
      Math.min(Math.floor(r * 256), 255),
      Math.min(Math.floor(g * 256), 255),
      Math.min(Math.floor(b * 256), 255)
    ];
  }

  _rgb2hsb(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    (v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs));
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
        h = bb - gg;
      } else if (gabs === v) {
        h = 1 / 3 + rr - bb;
      } else if (babs === v) {
        h = 2 / 3 + gg - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return {
      h: Math.round(h * 360),
      s: percentRoundFn(s * 100),
      b: percentRoundFn(v * 100)
    };
  }
}
