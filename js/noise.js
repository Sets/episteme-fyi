// ══════════════════════════════════════════════════════════
// SIMPLEX NOISE
// ══════════════════════════════════════════════════════════

class SimplexNoise {
  constructor() {
    this.grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];
    const p = [];
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    this.perm = new Array(512);
    this.pm12 = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.pm12[i] = this.perm[i] % 12;
    }
  }

  noise3D(xin, yin, zin) {
    const { grad3: g, perm: p, pm12 } = this;
    const F3 = 1/3, G3 = 1/6;
    const s = (xin+yin+zin)*F3;
    const i = Math.floor(xin+s), j = Math.floor(yin+s), k = Math.floor(zin+s);
    const t = (i+j+k)*G3;
    const x0=xin-(i-t), y0=yin-(j-t), z0=zin-(k-t);
    let i1,j1,k1,i2,j2,k2;
    if (x0>=y0) {
      if (y0>=z0)      { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0>=z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else             { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0<z0)       { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0<z0)  { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else             { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }
    const x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3;
    const x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3;
    const x3=x0-1+0.5, y3=y0-1+0.5, z3=z0-1+0.5;
    const ii=i&255, jj=j&255, kk=k&255;
    let n0=0,n1=0,n2=0,n3=0;
    let t0=0.6-x0*x0-y0*y0-z0*z0;
    if(t0>0){const gi=pm12[ii+p[jj+p[kk]]];t0*=t0;n0=t0*t0*(g[gi][0]*x0+g[gi][1]*y0+g[gi][2]*z0);}
    let t1=0.6-x1*x1-y1*y1-z1*z1;
    if(t1>0){const gi=pm12[ii+i1+p[jj+j1+p[kk+k1]]];t1*=t1;n1=t1*t1*(g[gi][0]*x1+g[gi][1]*y1+g[gi][2]*z1);}
    let t2=0.6-x2*x2-y2*y2-z2*z2;
    if(t2>0){const gi=pm12[ii+i2+p[jj+j2+p[kk+k2]]];t2*=t2;n2=t2*t2*(g[gi][0]*x2+g[gi][1]*y2+g[gi][2]*z2);}
    let t3=0.6-x3*x3-y3*y3-z3*z3;
    if(t3>0){const gi=pm12[ii+1+p[jj+1+p[kk+1]]];t3*=t3;n3=t3*t3*(g[gi][0]*x3+g[gi][1]*y3+g[gi][2]*z3);}
    return 32*(n0+n1+n2+n3);
  }
}

export const noise = new SimplexNoise();
