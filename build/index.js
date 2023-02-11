"use strict";const t=t=>{const e=t>>18,r=t>>12&63,s=t>>5&127;return{capBits:8*(r*s+e*(s+1)),groups:e?[[r,s],[e,s+1]]:[[r,s]],ecsize:31&t}},e=[{id:1,v:[4711,5194,5871,6676,7578,10386,10708,11320,11934,534674,18996,535448,19834,278142,285430,285784,1318268,286494,1064508,1326460,1068700,1846780,1331006,1076926,1084762,568924,1085278,2637502,1867422,2645630,843390,73342,335486,1629822,1888062,3698494,1122142,4738910,1134270,1654494].map(t)},{id:0,v:[4618,5008,5530,9234,9592,17264,17394,533718,537750,279930,1054302,550038,296118,1328408,1332536,816572,304604,1086842,2897306,3421498,71002,71132,3687932,3696060,3442172,1127900,878012,6043068,1922492,2700796,7611868,6071772,5563868,6088156,6866428,8939004,3790300,8443356,2000380,8201724].map(t)},{id:3,v:[4525,4822,8754,8986,532978,17016,1057234,541270,1065492,549496,1065692,1589914,1082008,1356308,1856286,586360,3936988,332508,1118906,1372958,1643228,4223774,3715870,4240158,5796638,1688284,6849278,8143646,9704190,6615838,434974,9216798,5100318,2016030,3830558,2810654,2822942,3867422,5944094,9052958].map(t)},{id:2,v:[4401,4636,8630,16688,532854,16892,278970,541146,1065368,549372,2109848,1077724,1098102,1356184,1880472,3420670,4465116,4989404,4231610,2683388,1651230,139704,3736062,647710,3498494,1184286,7389694,8172030,6894078,6648318,7434750,9253374,12104190,504350,10838526,16785918,12157438,8561150,17605118,16073214].map(t)}],r={min:0,L:0,M:1,Q:2,H:3,max:3},s=t=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(t),n=(...t)=>(e,r)=>t.forEach((t=>t(e,r))),o=t=>(e,r)=>{e.push(1,4),e.push(t.length,r<10?10:r<27?12:14);let s=0;for(;s<t.length-2;s+=3)e.push(Number(t.substr(s,3)),10);s<t.length-1?e.push(Number(t.substr(s,2)),7):s<t.length&&e.push(Number(t.substr(s,1)),4)},i=t=>(e,r)=>{e.push(2,4),e.push(t.length,r<10?9:r<27?11:13);let n=0;for(;n<t.length-1;n+=2)e.push(45*s(t[n])+s(t[n+1]),11);n<t.length&&e.push(s(t[n]),6)},h=t=>(e,r)=>{e.push(4,4),e.push(t.length,r<10?8:16),t.forEach((t=>e.push(t,8)))},a=t=>e=>{e.push(7,4),e.push(t,8)},l=t=>h([...t].map((t=>t.codePointAt(0)))),c=t=>n(a(26),h((new TextEncoder).encode(t))),u=t=>t.reduce(((t,e)=>e.e<t.e?e:t));o.reg=/[0-9]/,o.est=(t,e)=>4+(e<10?10:e<27?12:14)+10*t.length/3,i.reg=/[0-9A-Z $%*+./:-]/,i.est=(t,e)=>4+(e<10?9:e<27?11:13)+5.5*t.length,l.reg=/[\u0000-\u00FF]/,l.est=(t,e)=>4+(e<10?8:16)+8*t.length;var f={auto:(t,{modes:e=[o,i,l,c]}={})=>{const r=new Set(e),s=r.delete(c);return s&&(e=[...r]),(r,n)=>{let o=[{c:0,e:0}];for(let i=0;i<t.length;++i)if(o=e.filter((e=>e.reg.test(t[i]))).map((e=>u(o.map((r=>{const s={c:e,p:r.c===e?r.p:r,s:r.c===e?r.s:i};return s.v=t.substring(s.s,i+1),s.e=s.p.e+Math.ceil(e.est(s.v,n)),s}))))),!o.length){if(s)return void c(t)(r,n);throw new Error("Unencodable")}const i=[];for(let t=u(o);t.c;t=t.p)i.unshift(t.c(t.v));i.forEach((t=>t(r,n)))}},multi:n,eci:a,numeric:o,alphaNumeric:i,bytes:h,iso8859_1:l,utf8:c};class g{constructor(t){this.bytes=new Uint8Array(t),this.bits=0}push(t,e){for(let r=e,s=8-(7&this.bits);r>0;r-=s,s=8)this.bytes[this.bits>>>3]|=t<<s>>>r,this.bits+=Math.min(r,s)}}function p(t){Array.isArray(t)||(t=[255&t,t>>>8&255,t>>>16&255,t>>>24]);const e=new Uint8Array([...t,255]);return new Uint32Array(e.buffer,0,1)[0]}class m{constructor({size:t,d:e}){this.size=t,this.d=new Uint8Array(e||t*t)}get(t,e){return t>=0&&e>=0&&t<this.size&&e<this.size&&!!(1&this.d[e*this.size+t])}masked(t,e){return 2&this.d[e*this.size+t]}set(t,e,r,s=1){this.d[e*this.size+t]=2*s|!!r}inv(t,e){this.d[e*this.size+t]^=1}toString({on:t="##",off:e="  ",lf:r="\n",padX:s=4,padY:n=4}={}){let o="";for(let i=-n;i<this.size+n;++i){for(let r=-s;r<this.size+s;++r)o+=this.get(r,i)?t:e;o+=r}return o}toImageData(t,{on:e=4278190080,off:r=0,padX:s=4,padY:n=4}={}){const o=this.size+2*s,i=this.size+2*n,h=t.createImageData(o,i),a=new Uint32Array(h.data.buffer),l=p(e),c=p(r);for(let t=0;t<i;++t)for(let e=0;e<o;++e)a[t*o+e]=this.get(e-s,t-n)?l:c;return h}toCanvas(t,e){const r=t.getContext("2d"),s=this.toImageData(r,e);t.width=s.width,t.height=s.height,r.putImageData(s,0,0)}toDataURL({type:t="image/png",scale:e=1,...r}={}){const s=document.createElement("canvas"),n=s.getContext("2d"),o=this.toImageData(n,r);return s.width=o.width*e,s.height=o.height*e,n.putImageData(o,0,0),n.imageSmoothingEnabled=!1,n.globalCompositeOperation="copy",n.drawImage(s,0,0,o.width,o.height,0,0,s.width,s.height),s.toDataURL(t,1)}}var d=[(t,e)=>!(1&(t^e)),(t,e)=>!(1&e),t=>!(t%3),(t,e)=>!((t+e)%3),(t,e)=>!(1&(Math.floor(t/3)^Math.floor(e/2))),(t,e)=>!((t&e&1)+t*e%3),(t,e)=>!((t&e&1)+t*e%3&1),(t,e)=>!((1&(t^e))+t*e%3&1)];const w=new Uint8Array(512);w[0]=1;for(let t=0,e=1;t<255;w[++t]=e)w[e+256]=t,e*=2,256&e&&(e^=285);const b=t=>w[t%255],z=t=>w[t+256],v=(t,e)=>{const r=new Uint8Array(t.length+e.length-1);for(let s=0;s<t.length;++s)for(let n=0;n<e.length;++n)r[s+n]^=b(t[s]+e[n]);return r.map(z)},y=(t,e)=>{const r=new Uint8Array(t.length+e.length-1);r.set(t,0);for(let s=0;s<t.length;++s)if(r[s]){const t=z(r[s]);for(let n=0;n<e.length;++n)r[s+n]^=b(e[n]+t)}return r.slice(t.length)},A=[[0],[0,0]];for(let t=1,e=A[1];t<30;++t){const r=v(e,[0,t]);A.push(r),e=r}const E=(t,e,r)=>{let s=e;const n=Math.max(...r.map((t=>t.length)));for(let e=0;e<n;++e)r.forEach((r=>{e<r.length&&(t[s++]=r[e])}));return s};var U=(t,{groups:e,ecsize:r})=>{const s=[],n=[];let o=0,i=0;e.forEach((([e,h])=>{for(let i=0;i<e;++i,o+=h){const e=t.slice(o,o+h);s.push(e),n.push(y(e,A[r]))}i+=e*(h+r)}));const h=new Uint8Array(i),a=E(h,0,s);return E(h,a,n),h};const x=(t,e,r)=>{let s=t<<r-1;for(let t=134217728;t;t>>>=1)s&t&&(s^=e*(t>>>r-1));return s},M=(t,e,r,s,n,o)=>{for(let i=r;i<n;++i)for(let r=e;r<s;++r)t.set(r,i,o)},I=(t,e,r)=>{M(t,e-3,r-3,e+4,r+4,1),M(t,e-2,r-2,e+3,r+3,0),M(t,e-1,r-1,e+2,r+2,1)},D=(t,e,r)=>{M(t,e-2,r-2,e+3,r+3,1),M(t,e-1,r-1,e+2,r+2,0),t.set(e,r,1)},C=t=>{const e=t.size,r=[];for(let s=e-2,n=e,o=-1;s>=0;s-=2){for(5===s&&(s=4);n+=o,-1!==n&&n!==e;)t.masked(s+1,n)||r.push([s+1,n]),t.masked(s,n)||r.push([s,n]);o*=-1}return r},L=(t,e,r)=>{e.forEach((([e,s],n)=>t.set(e,s,r[n>>3]<<(7&n)&128,0)))},k=(t,e,r,s)=>{const n=t.size;for(let r=0;r<n;++r)for(let s=0;s<n;++s)e(s,r)&&!t.masked(s,r)&&t.inv(s,r);const o=s<<3|r;let i=21522^(o<<10|x(o,1335,11));for(let e=8;e-- >0;i>>=1)t.set(8,(e>1?7:8)-e,1&i),t.set(n-8+e,8,1&i);for(let e=7;e-- >0;i>>=1)t.set(e>5?7:e,8,1&i),t.set(8,n-e-1,1&i)},B=(t,e,r)=>{for(let s=0;s<t.size;++s){let n=e,o=e;for(let e=0;e<t.size;++e)n=r(n,t.get(e,s)),o=r(o,t.get(s,e))}};var N=t=>(t=>{let e=0;return B(t,[0],(([t,r],s)=>s!==r?[1,s]:(4===t?e+=3:t>4&&++e,[t+1,r]))),e})(t)+3*(t=>{let e=0;for(let r=1;r<t.size;++r){let s=t.get(r-1,0),n=t.get(r,0)===s;for(let o=1;o<t.size;++o){const i=t.get(r-1,o),h=t.get(r,o)===i;e+=n&&h&&s===i,s=i,n=h}}return e})(t)+40*(t=>{let e=0;return B(t,0,((t,r)=>{const s=(t>>>1|2098176)&(3047517^(r?0:-1));return 2049&s&&++e,s})),e})(t)+(t=>{let e=0;for(let r=0;r<t.size;++r)for(let s=0;s<t.size;++s)e+=t.get(s,r);return 10*Math.floor(20*Math.abs(e/(t.size*t.size)-.5))})(t);const S=[],F=t=>{let e=S[t];if(!e){const r=new m({size:4*t+17});((t,e)=>{const r=4*e+17;I(t,3,3),I(t,r-4,3),I(t,3,r-4),M(t,0,7,9,9,0),M(t,7,0,9,7,0),M(t,r-8,7,r,9,0),M(t,r-8,0,r-7,7,0),M(t,7,r-8,9,r,0),M(t,0,r-8,7,r-7,0),t.set(8,r-8,1);for(let e=8;e<r-8;++e)t.set(e,6,!(1&e)),t.set(6,e,!(1&e));if(e>=2){const s=Math.floor(e/7)+1,n=2*Math.ceil((r-13)/s/2-.25),o=[6];for(let t=s;t-- >0;)o.push(r-7-t*n);for(let e=0;e<=s;++e)for(let r=0;r<=s;++r)!e&&!r||!e&&r===s||e===s&&!r||D(t,o[e],o[r])}if(e>=7)for(let s=e<<12|x(e,7973,13),n=0;n<6;++n)for(let e=12;e-- >9;s>>>=1)t.set(n,r-e,1&s),t.set(r-e,n,1&s)})(r,t),S[t]=e=[r,C(r)]}return[new m(e[0]),e[1]]};exports.correction=r,exports.generate=(t,{minCorrectionLevel:s=r.min,maxCorrectionLevel:n=r.max,minVersion:o=1,maxVersion:i=40,mask:h=null}={})=>{if(n<s)throw new Error("Invalid correction level range");if(i<o)throw new Error("Invalid version range");"string"==typeof t&&(t=f.auto(t));let a=0;for(let r=o;r<=i;++r){if(e[s].v[r-1].capBits<a)continue;const o=new g(2956);t(o,r),a=o.bits;for(let t=n;t>=s;--t){const s=e[t],n=s.v[r-1];if(n.capBits<a)continue;for(o.push(0,4),o.bits=o.bits+7&-8;o.bits<n.capBits;)o.push(60433,16);const[i,l]=F(r);return L(i,l,U(o.bytes,n)),null!==h?(k(i,d[h],h,s.id),i):d.map(((t,e)=>{const r=new m(i);return k(r,t,e,s.id),r.s=N(r),r})).reduce(((t,e)=>e.s<t.s?e:t))}}throw new Error("Too much data")},exports.mode=f;
