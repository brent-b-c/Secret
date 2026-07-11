(function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
  
    // ---- coordinate mapping (turtle math coords -> canvas pixel coords) ----
    const originX = canvas.width / 2;
    const originY = canvas.height / 2 + 20;
    const scale = 1.0;
    function toCanvas(x, y) {
      return [originX + x * scale, originY - y * scale];
    }
  
    // ---------------------------------------------------------------------
    // A minimal re-implementation of the bits of Python's `turtle` module
    // that the original script used: goto, setheading, forward, circle,
    // begin_fill/end_fill, pensize, fillcolor. Instead of drawing straight
    // to the canvas, every move is recorded into an `ops` queue so we can
    // "replay" the drawing progressively, just like turtle's own animation.
    // ---------------------------------------------------------------------
    let ops = [];
  
    class VTurtle {
      constructor() {
        this.x = 0;
        this.y = 0;
        this.heading = 0;
        this.isDown = true;
        this.filling = false;
        this.fillPts = [];
        this.pensize = 1;
        this.pencolor = 'black';
        this.fillcolor = 'black';
      }
      penup() { this.isDown = false; }
      pendown() { this.isDown = true; }
      seth(h) { this.heading = h; }
      goto(nx, ny) {
        if (this.isDown) {
          ops.push({ type: 'seg', x1: this.x, y1: this.y, x2: nx, y2: ny, width: this.pensize, color: this.pencolor });
        }
        if (this.filling) this.fillPts.push([nx, ny]);
        this.x = nx;
        this.y = ny;
      }
      forward(d) {
        const r = this.heading * Math.PI / 180;
        this.goto(this.x + d * Math.cos(r), this.y + d * Math.sin(r));
      }
      circle(radius, extent) {
        const steps = Math.max(8, Math.min(150, Math.round(Math.abs(extent) * 1.5) + 8));
        const th = this.heading * Math.PI / 180;
        const centerAngle = th + Math.PI / 2;
        const cx = this.x + radius * Math.cos(centerAngle);
        const cy = this.y + radius * Math.sin(centerAngle);
        const startAngle = Math.atan2(this.y - cy, this.x - cx);
        const dir = radius >= 0 ? 1 : -1;
        const extentRad = extent * Math.PI / 180;
        const absR = Math.abs(radius);
        for (let i = 1; i <= steps; i++) {
          const a = startAngle + dir * extentRad * (i / steps);
          this.goto(cx + absR * Math.cos(a), cy + absR * Math.sin(a));
        }
        this.heading += dir * extent;
      }
      begin_fill() {
        this.filling = true;
        this.fillPts = [[this.x, this.y]];
      }
      end_fill() {
        if (this.fillPts.length > 2) {
          ops.push({ type: 'fill', points: this.fillPts.slice(), color: this.fillcolor });
        }
        this.filling = false;
      }
    }
  
    const t = new VTurtle();
  
    function go(x, y) { t.penup(); t.goto(x, y); t.pendown(); }
    function arco(direc, radio, ang) { t.seth(direc); t.circle(radio, ang); }
    function linea(direc, longitud) { t.seth(direc); t.forward(longitud); }
  
    function petalo1(dif) {
      t.fillcolor = 'cornflowerblue';
      t.begin_fill();
      arco(19.4 + dif, 16.55, 36.24);
      arco(58.23 + dif, 39.13, 19.06);
      arco(76.16 + dif, 78.56, 18.4);
      arco(91.84 + dif, 165.01, 25.11);
      arco(113.29 + dif, 63.02, 32.41);
      arco(147.49 + dif, 12.89, 46.29);
      arco(198.79 + dif, 16.08, 32.34);
      arco(236.61 + dif, 42, 19.38);
      arco(260.39 + dif, 142.41, 11.47);
      arco(273.6 + dif, 175.05, 21.41);
      arco(294.1 + dif, 91.55, 17.01);
      arco(312.75 + dif, 40.51, 19.1);
      arco(335.49 + dif, 14.52, 35.34);
      t.end_fill();
    }
  
    function petalo2(dif) {
      t.fillcolor = 'royalblue';
      t.begin_fill();
      arco(33.87 + dif, 87.78, 26.03);
      arco(61.06 + dif, 118.55, 26.52);
      arco(84.19 + dif, 175.12, 11.62);
      arco(96.12 + dif, 34.85, 23.06);
      arco(120.12 + dif, 10.40, 90);
      arco(202.44 + dif, 37.24, 24.37);
      arco(226.81 + dif, 118.29, 14.98);
      arco(294.34 + dif, -165.01, 22.51);
      arco(274.56 + dif, -78.56, 18.4);
      arco(257.29 + dif, -39.13, 19.06);
      t.end_fill();
    }
  
    function petalo3(dif) {
      t.fillcolor = 'mediumblue';
      t.begin_fill();
      arco(61.79 + dif, -118.29, 7.49);
      arco(104.98 + dif, 52.05, 33.98);
      arco(138.95 + dif, 12.66, 104.98);
      arco(327.02 + dif, -69.44, 37.4);
      t.end_fill();
    }
  
    function petalo4(dif) {
      t.fillcolor = 'lightskyblue';
      t.begin_fill();
      arco(54.3 + dif, -118.29, 7.49);
      arco(46.81 + dif, -37.24, 24.37);
      arco(130.31 + dif, 30.28, 25.84);
      arco(160.26 + dif, 12.15, 61.81);
      arco(221.49 + dif, 54.59, 12.76);
      arco(306.56 + dif, -52.05, 21.59);
      t.end_fill();
    }
  
    function buildOps() {
      ops = [];
      Object.assign(t, new VTurtle());
      t.pensize = 7;
  
      go(-32.98, -273.92);
      arco(119.2, -722.53, 13.66);
      arco(105.54, -940.73, 16.9);
      go(-24.06, -262.26);
      arco(93.61, -1196.71, 14.07);
      go(3.56, -249.56);
      arco(88.58, -622.34, 31.55);
  
      t.pensize = 4;
      t.fillcolor = 'seagreen';
      go(12.91, -283.99);
      t.begin_fill();
      arco(57.88, 975.08, 16.39);
      arco(74.27, 6.20, 157.41);
      arco(231.68, 579.02, 27.92);
      arco(259.6, 7.27, 158.28);
      t.end_fill();
  
      go(-28.71, -266.66);
      t.begin_fill();
      arco(88.05, 692.83, 25.07);
      arco(113.12, 5.18, 157.34);
      arco(270.46, 938.83, 18.39);
      arco(288.85, 7.64, 159.19);
      t.end_fill();
  
      go(-18.47, -282.60);
      t.begin_fill();
      arco(96.21, 326.86, 31.73);
      arco(127.94, 5.56, 153.41);
      arco(281.35, 501.08, 20.41);
      arco(301.77, 6.36, 154.44);
      t.end_fill();
  
      t.fillcolor = 'limegreen';
      go(-6.31, -268.99);
      t.begin_fill();
      arco(73.43, 1017.87, 14.17);
      arco(87.61, 6.01, 157.08);
      arco(244.69, 469.17, 31.28);
      arco(275.7, 6.45, 157.46);
      t.end_fill();
  
      go(-8.02, -285.56);
      t.begin_fill();
      arco(52.56, 381.13, 26.67);
      arco(79.23, 6.86, 145.51);
      arco(224.73, 236.72, 44.06);
      arco(268.79, 5.47, 143.76);
      t.end_fill();
  
      go(-43.74, -282.89);
      t.begin_fill();
      arco(101.25, 312.61, 33.09);
      arco(134.34, 5.53, 142.29);
      arco(276.63, 243.40, 43.13);
      arco(319.76, 4.88, 141.49);
      t.end_fill();
  
      go(-6.51, 30.43); petalo1(0);
      go(1.64, 36.70); petalo2(0);
      go(-6, 136.45); petalo3(0);
      go(2.17, 149.56); petalo4(0);
  
      go(103.65, 73.72); petalo1(-29.4);
      go(117.8, 79.99); petalo2(-29.4);
      go(156.16, 167.74); petalo3(-29.4);
      go(170, 177); petalo4(-29.4);
  
      go(-132.53, 159.47); petalo1(12.14);
      go(-124.38, 169.74); petalo2(12.14);
      go(-152.02, 261.49); petalo3(12.14);
      go(-148, 278); petalo4(12.14);
    }
  
    // ---------------------------------------------------------------------
    // Playback: reveal the recorded ops progressively so it looks like it's
    // being drawn, then fill shapes solid once their outline is complete.
    // ---------------------------------------------------------------------
    let rafId = null;
  
    function play() {
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      buildOps();
  
      let i = 0;
      const segsPerFrame = 8;
  
      function step() {
        let count = 0;
        while (i < ops.length && count < segsPerFrame) {
          const op = ops[i];
          if (op.type === 'seg') {
            const [cx1, cy1] = toCanvas(op.x1, op.y1);
            const [cx2, cy2] = toCanvas(op.x2, op.y2);
            ctx.beginPath();
            ctx.moveTo(cx1, cy1);
            ctx.lineTo(cx2, cy2);
            ctx.lineWidth = op.width;
            ctx.strokeStyle = op.color;
            ctx.lineCap = 'round';
            ctx.stroke();
            count++;
          } else if (op.type === 'fill') {
            ctx.beginPath();
            const [sx, sy] = toCanvas(op.points[0][0], op.points[0][1]);
            ctx.moveTo(sx, sy);
            for (let k = 1; k < op.points.length; k++) {
              const [px, py] = toCanvas(op.points[k][0], op.points[k][1]);
              ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = op.color;
            ctx.fill();
            count++;
          }
          i++;
        }
        if (i < ops.length) {
          rafId = requestAnimationFrame(step);
        }
      }
      step();
    }
  
    document.getElementById('replayBtn').addEventListener('click', play);
    window.addEventListener('load', play);
  })();