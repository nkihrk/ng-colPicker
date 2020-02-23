import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LibService {
  constructor() {}

  getDistance(x1, y1, x2, y2) {
    let xs = x2 - x1;
    let ys = y2 - y1;
    xs *= xs;
    ys *= ys;

    return Math.sqrt(xs + ys);
  }

  calcurateTheta(mouseX, mouseY) {
    const rad =
      (Math.atan2(mouseY, mouseX) / Math.PI) * 180 +
      (Math.atan2(mouseY, mouseX) > 0 ? 0 : 360);

    return (rad / 180) * Math.PI;
  }

  calcurateInvertDeg(mouseX, mouseY) {
    const deg =
      -(Math.atan2(mouseY, mouseX) / Math.PI) * 180 +
      (Math.atan2(mouseY, mouseX) < 0 ? 0 : 360);

    return deg;
  }

  calculateHue(currentPos, centerPos) {
    const deg =
      (Math.atan2(currentPos.x - centerPos.y, currentPos.x - centerPos.x) /
        Math.PI) *
        180 +
      90 +
      ((Math.atan2(currentPos.y - centerPos.y, currentPos.y - centerPos.x) /
        Math.PI) *
        180 +
        90 >
      0
        ? 0
        : 360);

    return deg;
  }

  hsv2hsl(h, s, v) {
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

  hsl2rgb(hsl) {
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

  rgb2hsb(r, g, b) {
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
