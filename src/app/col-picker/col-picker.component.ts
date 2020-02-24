import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { LibService } from "../services/lib.service";

@Component({
  selector: "app-col-picker",
  templateUrl: "./col-picker.component.html",
  styleUrls: ["./col-picker.component.scss"]
})
export class ColPickerComponent implements OnInit {
  @ViewChild("colorBox1", { static: true }) colorBox1: ElementRef;
  @ViewChild("colorBox2", { static: true }) colorBox2: ElementRef;
  @ViewChild("colorSlider", { static: true }) colorSlider: ElementRef;

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

  @ViewChild("wrapper", { static: true }) wrapper: ElementRef;
  @ViewChild("colorWheel", { static: true }) wheel: ElementRef;

  @ViewChild("colorTriangle", { static: true }) triangle: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild("colorCircle", { static: true }) circle: ElementRef<
    HTMLCanvasElement
  >;

  @Output() currentColor = new EventEmitter<any>();

  private hue: number = 0;
  private saturation: number = 0;
  private brightness: number = 14;
  private rgb: { r: number; g: number; b: number };

  private saturationInput;
  private brightnessInput;

  private wrapperWidth: number;
  private wheelOuterRadius: number;
  private wheelInnerRadius: number;
  private thickness: number;
  private canvasColor: string = "#535353";
  private triangleRadius: number;
  private centerX: number;
  private centerY: number;

  private isWheel: boolean = false;
  private isTriangle: boolean = false;
  private wCirclePos: any;
  private tCirclePos: any;

  constructor(private libService: LibService) {}

  ngOnInit() {
    const wrapper = this.wrapper.nativeElement;
    const size = wrapper.clientWidth;
    const wheelRadius = size / 2;
    const wheelThickness = (size / 2) * 0.16;
    const wheelInnerRadius = wheelRadius - wheelThickness;
    const triangleRadius = (wheelRadius - wheelThickness) * 0.98;
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
    this.drawTriangle();
    this.drawCircle({});
  }

  /**
   * Color wheel
   *
   */
  drawWheel() {
    const resolution = 1;
    const outerRadius = this.wheelOuterRadius;
    const wheelInnerRadius = this.wheelInnerRadius;
    const wheelElem = this.wheel;

    this._generateConicGradiant(outerRadius, resolution, wheelElem);
    this._generateOverlay(outerRadius, wheelInnerRadius, wheelElem);
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

  /**
   * Color triangle
   *
   */
  drawTriangle() {
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
    const hsla = `hsla(${this.hue}, 100%, 50%, `;
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
  }

  changeInputHue($val) {
    const input = parseFloat($val.target.value);
    const isValid = 0 <= input && input <= 360;

    if (isValid) {
      this.hue = Math.round(input);
      this._updateCircleWheelViaInput();
    }
  }

  _updateCircleWheelViaInput() {
    const c = this.circle.nativeElement;
    c.width = this.wrapperWidth;
    c.height = this.wrapperWidth;
    const ctx = c.getContext("2d");
    ctx.translate(this.wheelOuterRadius, this.wheelOuterRadius);

    const centerPos = {
      x:
        this.wrapper.nativeElement.getBoundingClientRect().left +
        this.wheelOuterRadius,
      y:
        this.wrapper.nativeElement.getBoundingClientRect().top +
        this.wheelOuterRadius
    };
    const r = this.triangleRadius;
    const rad = (this.hue / 180) * Math.PI;
    const wheelPos = {
      x: centerPos.x + r * Math.cos(rad),
      y: centerPos.y - r * Math.sin(rad)
    };

    this.wCirclePos = wheelPos;

    this._updateCircleWheel(ctx, this.wCirclePos);
    this._updateCircleTriangle(ctx, this.tCirclePos);
  }

  changeInputSaturation($val) {
    const input = parseFloat($val.target.value);
    const isValid = 0 <= input && input <= 100;

    if (isValid) {
      this.saturationInput = Math.round(input);
      this._updateCircleSaturateViaInput();
    }
  }

  _updateCircleSaturateViaInput() {
    const leftTopXFromCenterX =
      Math.cos((Math.PI * 2) / 3) * this.triangleRadius;
    const leftTopYFromCenterY =
      Math.sin((Math.PI * 2) / 3) * this.triangleRadius;
    const leftTopX = leftTopXFromCenterX + this.wheelOuterRadius;
    const leftTopY = -leftTopYFromCenterY + this.wheelOuterRadius;
    const leftDownX = leftTopX;
    const leftDownY = Math.sqrt(3) * this.triangleRadius + leftTopY;

    const prevPos = this._fixedPosTriangleArea(this.tCirclePos);

    const mainSlice = prevPos.y - prevPos.x / Math.sqrt(3);
    const anotherSlice = leftDownY + leftDownX / Math.sqrt(3);

    const intersectA = {
      x: leftTopX,
      y: mainSlice + leftTopX / Math.sqrt(3)
    };
    const intersectB = {
      x: ((anotherSlice - mainSlice) * Math.sqrt(3)) / 2,
      y: (anotherSlice + mainSlice) / 2
    };

    const resultPos = {
      x:
        ((100 - this.saturationInput) * intersectA.x +
          this.saturationInput * intersectB.x) /
          100 +
        this.wrapper.nativeElement.getBoundingClientRect().left,
      y:
        ((100 - this.saturationInput) * intersectA.y +
          this.saturationInput * intersectB.y) /
          100 +
        this.wrapper.nativeElement.getBoundingClientRect().top
    };

    this.drawCircle(resultPos);
    this.clearFlg({});
  }

  clearFlg(e) {
    this.isWheel = false;
    this.isTriangle = false;
  }

  _fixedPosTriangleArea(pos) {
    let x, y;
    const mouseX = pos.x - this.centerX;
    const mouseY = pos.y - this.centerY;

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

    return {
      x: x + this.wheelOuterRadius,
      y: y + this.wheelOuterRadius
    };
  }

  changeInputBrightness($val) {
    const input = parseFloat($val.target.value);
    const isValid = 0 <= input && input <= 100;

    if (isValid) {
      this.brightnessInput = Math.round(input);
    }
  }

  _drawHue() {
    const c = this.canvasH.nativeElement;
    c.width = this.colorSlider.nativeElement.clientWidth;
    c.height = this.colorSlider.nativeElement.clientHeight;
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

    const pos: number = (this.hue / 360) * (c.width - 12) + 6;
    this._showArrowBar(ctx, pos);

    this.inputH.nativeElement.value = Math.round(this.hue);
  }

  _drawSaturation() {
    const c = this.canvasS.nativeElement;
    c.width = this.colorSlider.nativeElement.clientWidth;
    c.height = this.colorSlider.nativeElement.clientHeight;
    const ctx = c.getContext("2d");

    const hsl0 = this.libService.hsv2hsl(
      this.hue / 360,
      1,
      this.brightness / 100
    );
    const hsl1 = this.libService.hsv2hsl(
      this.hue / 360,
      0,
      this.brightness / 100
    );
    const grd = ctx.createLinearGradient(5, 3, c.width - 10, 6);
    grd.addColorStop(
      1,
      `hsl(${Math.round(hsl0[0] * 360)}, ${Math.round(
        hsl0[1] * 100
      )}%, ${Math.round(hsl0[2] * 100)}%)`
    );
    grd.addColorStop(
      0,
      `hsl(${Math.round(hsl1[0] * 360)}, ${Math.round(
        hsl1[1] * 100
      )}%, ${Math.round(hsl1[2] * 100)}%)`
    );
    ctx.fillStyle = grd;
    ctx.fillRect(5, 3, c.width - 10, 6);

    const pos: number = (this.saturation / 100) * (c.width - 13) + 6;
    this._showArrowBar(ctx, pos);

    this.inputS.nativeElement.value = Math.round(this.saturation);
  }

  _drawBrightness() {
    const c = this.canvasB.nativeElement;
    c.width = this.colorSlider.nativeElement.clientWidth;
    c.height = this.colorSlider.nativeElement.clientHeight;
    const ctx = c.getContext("2d");

    const hsl0 = this.libService.hsv2hsl(
      this.hue / 360,
      this.saturation / 100,
      1
    );
    const hsl1 = this.libService.hsv2hsl(
      this.hue / 360,
      this.saturation / 100,
      0
    );
    const grd = ctx.createLinearGradient(5, 3, c.width - 10, 6);
    grd.addColorStop(
      1,
      `hsl(${Math.round(hsl0[0] * 360)}, ${Math.round(
        hsl0[1] * 100
      )}%, ${Math.round(hsl0[2] * 100)}%)`
    );
    grd.addColorStop(
      0,
      `hsl(${Math.round(hsl1[0] * 360)}, ${Math.round(
        hsl1[1] * 100
      )}%, ${Math.round(hsl1[2] * 100)}%)`
    );
    ctx.fillStyle = grd;
    ctx.fillRect(5, 3, c.width - 10, 6);

    const pos: number = (this.brightness / 100) * (c.width - 13) + 6;
    this._showArrowBar(ctx, pos);

    this.inputB.nativeElement.value = Math.round(this.brightness);
  }

  _showArrowBar(ctx: any, pos: number) {
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
   * Circle symbol
   *
   */
  drawCircle($coord) {
    const c = this.circle.nativeElement;
    c.width = this.wrapperWidth;
    c.height = this.wrapperWidth;
    const ctx = c.getContext("2d");

    const leftTopX = Math.cos((Math.PI * 2) / 3) * this.triangleRadius;
    const leftTopY = Math.sin((Math.PI * 2) / 3) * this.triangleRadius;

    const isWheelArea = this._isWheelArea($coord);
    const isTriangleArea = this._isTriangleArea($coord);

    ctx.translate(this.wheelOuterRadius, this.wheelOuterRadius);

    if (Object.keys($coord).length) {
      // Wheel
      if (isWheelArea && !this.isTriangle) {
        this.wCirclePos = $coord;
        this.isWheel = true;
      } else if (this.isWheel && !this.isTriangle) {
        this.wCirclePos = $coord;
      }
      this._updateCircleWheel(ctx, this.wCirclePos);

      // Triangle
      if (isTriangleArea && !this.isWheel) {
        this.tCirclePos = $coord;
        this.isTriangle = true;
      } else if (this.isTriangle && !this.isWheel) {
        this.tCirclePos = $coord;
      }
      this._updateCircleTriangle(ctx, this.tCirclePos);

      this._updateAllCanvas();
      this._updateRgbInfo();
    } else {
      // Wheel
      const initPosX =
        this.wheelOuterRadius +
        this.wheelInnerRadius +
        this.thickness / 2 +
        this.circle.nativeElement.getBoundingClientRect().left;
      const initPosY =
        this.wheelOuterRadius +
        this.circle.nativeElement.getBoundingClientRect().top;
      this.wCirclePos = {
        x: initPosX,
        y: initPosY
      };
      this._updateCircleWheel(ctx, this.wCirclePos);

      // Triangle
      this.tCirclePos = { x: leftTopX, y: -leftTopY };
      this._updateCircleTriangle(ctx, this.tCirclePos);

      this._updateAllCanvas();
      this._updateRgbInfo();
    }
  }

  _isWheelArea(pos) {
    const minR = this.wheelInnerRadius;
    const maxR = this.wheelOuterRadius;
    const mouseR = this.libService.getDistance(
      this.centerX,
      this.centerY,
      pos.x,
      pos.y
    );

    if (mouseR > minR && maxR > mouseR) return true;
    return false;
  }

  _isInnerWheelArea(pos) {
    const maxR = this.wheelInnerRadius;
    const mouseR = this.libService.getDistance(
      this.centerX,
      this.centerY,
      pos.x,
      pos.y
    );

    if (mouseR < maxR) return true;
    return false;
  }

  _isTriangleArea(pos) {
    const mouseX = pos.x - this.centerX;
    const mouseY = pos.y - this.centerY;
    const minX = Math.cos((Math.PI * 2) / 3) * this.wheelInnerRadius;
    const maxX = this.wheelInnerRadius;
    const maxY = (-mouseX + maxX) / Math.sqrt(3);

    if (mouseX >= minX && maxX >= mouseX) {
      if (Math.abs(mouseY) >= 0 && maxY >= Math.abs(mouseY)) return true;
    }
    return false;
  }

  _updateCircleWheel(ctx, pos) {
    const wheelX = pos.x - this.centerX;
    const wheelY = pos.y - this.centerY;
    const wheelR = this.wheelInnerRadius + this.thickness / 2;
    const wheelTheta = this.libService.calcurateTheta(wheelX, wheelY);
    const invertDeg = this.libService.calcurateInvertDeg(wheelX, wheelY);
    const wheelResultX = wheelR * Math.cos(wheelTheta);
    const wheelResultY = wheelR * Math.sin(wheelTheta);

    this._drawCircleWheel(ctx, wheelResultX, wheelResultY);
    this._setHue(invertDeg);
  }

  _drawCircleWheel(ctx, mouseX, mouseY) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.arc(mouseX, mouseY, 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  _setHue($deg) {
    this.hue = this._getHue($deg);
  }

  _getHue($deg) {
    let result = Math.round($deg);
    return result === 360 ? 0 : result;
  }

  _updateAllCanvas() {
    this.drawTriangle();
    this._drawHue();
    this._drawSaturation();
    this._drawBrightness();
    this._initInput();
  }

  _initInput() {
    this.saturationInput = null;
    this.brightnessInput = null;
  }

  _updateRgbInfo() {
    this.colorBox1.nativeElement.style.backgroundColor = `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
    this.currentColor.emit(this.rgb);
  }

  _updateCircleTriangle(ctx, pos) {
    let x, y;
    const mouseX = pos.x - this.centerX;
    const mouseY = pos.y - this.centerY;

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
    this.rgb = this._getTriangleColor(x, y);
    this._setSaturateAndBright();
  }

  _drawCircleTriangle(ctx, mouseX, mouseY) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  _getTriangleColor($circleX, $circleY) {
    const x = $circleX;
    const y = $circleY;
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
    const b = this.libService.hsl2rgb(hsl);
    const s = [255, 255, 255];

    const co = [];
    let tmp;
    for (let i = 0; i < 3; i++) {
      tmp = (s[i] * (l - k)) / l + (b[i] * (l - (this.triangleRadius - x))) / l;
      tmp = Math.abs(Math.round(tmp));
      co.push(tmp);
    }

    return {
      r: co[0],
      g: co[1],
      b: co[2]
    };
  }

  _setSaturateAndBright() {
    const hsb = this.libService.rgb2hsb(this.rgb.r, this.rgb.g, this.rgb.b);

    this.saturation = !!this.saturationInput ? this.saturationInput : hsb.s;
    this.brightness = !!this.brightnessInput ? this.brightnessInput : hsb.b;
  }
}
