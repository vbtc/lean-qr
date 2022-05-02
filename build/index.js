"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const t=t=>{const e=t>>18,r=t>>12&63,s=t>>5&127;return{capBits:8*(r*s+e*(s+1)),groups:e?[[r,s],[e,s+1]]:[[r,s]],ecsize:31&t}},e=[{id:1,v:[4711,5194,5871,6676,7578,10386,10708,11320,11934,534674,18996,535448,19834,278142,285430,285784,1318268,286494,1064508,1326460,1068700,1846780,1331006,1076926,1084762,568924,1085278,2637502,1867422,2645630,843390,73342,335486,1629822,1888062,3698494,1122142,4738910,1134270,1654494].map(t)},{id:0,v:[4618,5008,5530,9234,9592,17264,17394,533718,537750,279930,1054302,550038,296118,1328408,1332536,816572,304604,1086842,2897306,3421498,71002,71132,3687932,3696060,3442172,1127900,878012,6043068,1922492,2700796,7611868,6071772,5563868,6088156,6866428,8939004,3790300,8443356,2000380,8201724].map(t)},{id:3,v:[4525,4822,8754,8986,532978,17016,1057234,541270,1065492,549496,1065692,1589914,1082008,1356308,1856286,586360,3936988,332508,1118906,1372958,1643228,4223774,3715870,4240158,5796638,1688284,6849278,8143646,9704190,6615838,434974,9216798,5100318,2016030,3830558,2810654,2822942,3867422,5944094,9052958].map(t)},{id:2,v:[4401,4636,8630,16688,532854,16892,278970,541146,1065368,549372,2109848,1077724,1098102,1356184,1880472,3420670,4465116,4989404,4231610,2683388,1651230,139704,3736062,647710,3498494,1184286,7389694,8172030,6894078,6648318,7434750,9253374,12104190,504350,10838526,16785918,12157438,8561150,17605118,16073214].map(t)}],r={min:0,L:0,M:1,Q:2,H:3,max:3},s=t=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(t),n=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return(t,r)=>e.forEach((e=>e(t,r)))},o=t=>(e,r)=>{e.push(1,4),e.push(t.length,r<10?10:r<27?12:14);let s=0;for(;s<t.length-2;s+=3)e.push(Number(t.substr(s,3)),10);s<t.length-1?e.push(Number(t.substr(s,2)),7):s<t.length&&e.push(Number(t.substr(s,1)),4)},i=t=>(e,r)=>{e.push(2,4),e.push(t.length,r<10?9:r<27?11:13);let n=0;for(;n<t.length-1;n+=2)e.push(45*s(t[n])+s(t[n+1]),11);n<t.length&&e.push(s(t[n]),6)},l=t=>(e,r)=>{e.push(4,4),e.push(t.length,r<10?8:16),t.forEach((t=>e.push(t,8)))},h=t=>e=>{e.push(7,4),e.push(t,8)},a=t=>l([...t].map((t=>t.codePointAt(0)))),c=t=>n(h(26),l((new TextEncoder).encode(t))),u=t=>t.reduce(((t,e)=>e.e<t.e?e:t));o.reg=/[0-9]/,o.est=(t,e)=>4+(e<10?10:e<27?12:14)+10*t.length/3,i.reg=/[0-9A-Z $%*+./:-]/,i.est=(t,e)=>4+(e<10?9:e<27?11:13)+5.5*t.length,a.reg=/[\u0000-\u00FF]/,a.est=(t,e)=>4+(e<10?8:16)+8*t.length;var f={auto:function(t){let{modes:e=[o,i,a,c]}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const r=new Set(e),s=r.delete(c);return s&&(e=[...r]),(r,n)=>{let o=[{c:0,e:0}];for(let i=0;i<t.length;++i)if(o=e.filter((e=>e.reg.test(t[i]))).map((e=>u(o.map((r=>{const s={c:e,p:r.c===e?r.p:r,s:r.c===e?r.s:i};return s.v=t.substring(s.s,i+1),s.e=s.p.e+Math.ceil(e.est(s.v,n)),s}))))),!o.length){if(s)return void c(t)(r,n);throw new Error("Unencodable")}const i=[];for(let t=u(o);t.c;t=t.p)i.unshift(t.c(t.v));i.forEach((t=>t(r,n)))}},multi:n,eci:h,numeric:o,alphaNumeric:i,bytes:l,iso8859_1:a,utf8:c};class g{constructor(t){this.bytes=new Uint8Array(t),this.bits=0}push(t,e){for(let r=e,s=8-(7&this.bits);r>0;r-=s,s=8)this.bytes[this.bits>>>3]|=t<<s>>>r,this.bits+=Math.min(r,s)}}function p(t){Array.isArray(t)||(t=[255&t,t>>>8&255,t>>>16&255,t>>>24]);const e=new Uint8Array([...t,255]);return new Uint32Array(e.buffer,0,1)[0]}class d{constructor(t){let{size:e,d:r}=t;this.size=e,this.d=new Uint8Array(r||e*e)}get(t,e){return t>=0&&e>=0&&t<this.size&&e<this.size&&!!(1&this.d[e*this.size+t])}masked(t,e){return 2&this.d[e*this.size+t]}set(t,e,r){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;this.d[e*this.size+t]=2*s|!!r}inv(t,e){this.d[e*this.size+t]^=1}toString(){let{on:t="##",off:e="  ",lf:r="\n",padX:s=4,padY:n=4}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o="";for(let i=-n;i<this.size+n;++i){for(let r=-s;r<this.size+s;++r)o+=this.get(r,i)?t:e;o+=r}return o}toImageData(t){let{on:e=4278190080,off:r=0,padX:s=4,padY:n=4}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const o=this.size+2*s,i=this.size+2*n,l=t.createImageData(o,i),h=new Uint32Array(l.data.buffer),a=p(e),c=p(r);for(let t=0;t<i;++t)for(let e=0;e<o;++e)h[t*o+e]=this.get(e-s,t-n)?a:c;return l}toCanvas(t,e){const r=t.getContext("2d"),s=this.toImageData(r,e);t.width=s.width,t.height=s.height,r.putImageData(s,0,0)}toDataURL(){let{type:t="image/png",scale:e=1,...r}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const s=document.createElement("canvas"),n=s.getContext("2d"),o=this.toImageData(n,r);return s.width=o.width*e,s.height=o.height*e,n.putImageData(o,0,0),n.imageSmoothingEnabled=!1,n.globalCompositeOperation="copy",n.drawImage(s,0,0,o.width,o.height,0,0,s.width,s.height),s.toDataURL(t,1)}}var m=[(t,e)=>!(1&(t^e)),(t,e)=>!(1&e),t=>!(t%3),(t,e)=>!((t+e)%3),(t,e)=>!(1&(Math.floor(t/3)^Math.floor(e/2))),(t,e)=>!((t&e&1)+t*e%3),(t,e)=>!((t&e&1)+t*e%3&1),(t,e)=>!((1&(t^e))+t*e%3&1)];const v=new Uint8Array(512);v[0]=1;for(let t=0,e=1;t<255;v[++t]=e)v[e+256]=t,e*=2,256&e&&(e^=285);const w=t=>v[t%255],b=t=>v[t+256],z=(t,e)=>{const r=new Uint8Array(t.length+e.length-1);for(let s=0;s<t.length;++s)for(let n=0;n<e.length;++n)r[s+n]^=w(t[s]+e[n]);return r.map(b)},y=(t,e)=>{const r=new Uint8Array(t.length+e.length-1);r.set(t,0);for(let s=0;s<t.length;++s)if(r[s]){const t=b(r[s]);for(let n=0;n<e.length;++n)r[s+n]^=w(e[n]+t)}return r.slice(t.length)},A=[[0],[0,0]];for(let t=1,e=A[1];t<30;++t){const r=z(e,[0,t]);A.push(r),e=r}const E=(t,e,r)=>{let s=e;const n=Math.max(...r.map((t=>t.length)));for(let e=0;e<n;++e)r.forEach((r=>{e<r.length&&(t[s++]=r[e])}));return s};var x=(t,e)=>{let{groups:r,ecsize:s}=e;const n=[],o=[];let i=0,l=0;r.forEach((e=>{let[r,h]=e;for(let e=0;e<r;++e,i+=h){const e=t.slice(i,i+h);n.push(e),o.push(y(e,A[s]))}l+=r*(h+s)}));const h=new Uint8Array(l),a=E(h,0,n);return E(h,a,o),h};const U=(t,e,r)=>{let s=t<<r-1;for(let t=134217728;t;t>>>=1)s&t&&(s^=e*(t>>>r-1));return s},M=(t,e,r,s,n,o)=>{for(let i=r;i<n;++i)for(let r=e;r<s;++r)t.set(r,i,o)},I=(t,e,r)=>{M(t,e-3,r-3,e+4,r+4,1),M(t,e-2,r-2,e+3,r+3,0),M(t,e-1,r-1,e+2,r+2,1)},D=(t,e,r)=>{M(t,e-2,r-2,e+3,r+3,1),M(t,e-1,r-1,e+2,r+2,0),t.set(e,r,1)},C=t=>{const e=t.size,r=[];for(let s=e-2,n=e,o=-1;s>=0;s-=2){for(5===s&&(s=4);n+=o,-1!==n&&n!==e;)t.masked(s+1,n)||r.push([s+1,n]),t.masked(s,n)||r.push([s,n]);o*=-1}return r},L=(t,e,r)=>{e.forEach(((e,s)=>{let[n,o]=e;return t.set(n,o,r[s>>3]<<(7&s)&128,0)}))},k=(t,e,r,s)=>{const n=t.size;for(let r=0;r<n;++r)for(let s=0;s<n;++s)e(s,r)&&!t.masked(s,r)&&t.inv(s,r);const o=s<<3|r;let i=21522^(o<<10|U(o,1335,11));for(let e=8;e-- >0;i>>=1)t.set(8,(e>1?7:8)-e,1&i),t.set(n-8+e,8,1&i);for(let e=7;e-- >0;i>>=1)t.set(e>5?7:e,8,1&i),t.set(8,n-e-1,1&i)},B=(t,e,r)=>{for(let s=0;s<t.size;++s){let n=e,o=e;for(let e=0;e<t.size;++e)n=r(n,t.get(e,s)),o=r(o,t.get(s,e))}};var N=t=>(t=>{let e=0;return B(t,[0],((t,r)=>{let[s,n]=t;return r!==n?[1,r]:(4===s?e+=3:s>4&&++e,[s+1,n])})),e})(t)+3*(t=>{let e=0;for(let r=1;r<t.size;++r){let s=t.get(r-1,0),n=t.get(r,0)===s;for(let o=1;o<t.size;++o){const i=t.get(r-1,o),l=t.get(r,o)===i;e+=n&&l&&s===i,s=i,n=l}}return e})(t)+40*(t=>{let e=0;return B(t,0,((t,r)=>{const s=(t>>>1|2098176)&(3047517^(r?0:-1));return 2049&s&&++e,s})),e})(t)+(t=>{let e=0;for(let r=0;r<t.size;++r)for(let s=0;s<t.size;++s)e+=t.get(s,r);return 10*Math.floor(20*Math.abs(e/(t.size*t.size)-.5))})(t);const O=[],S=t=>{let e=O[t];if(!e){const r=new d({size:4*t+17});((t,e)=>{const r=4*e+17;I(t,3,3),I(t,r-4,3),I(t,3,r-4),M(t,0,7,9,9,0),M(t,7,0,9,7,0),M(t,r-8,7,r,9,0),M(t,r-8,0,r-7,7,0),M(t,7,r-8,9,r,0),M(t,0,r-8,7,r-7,0),t.set(8,r-8,1);for(let e=8;e<r-8;++e)t.set(e,6,!(1&e)),t.set(6,e,!(1&e));if(e>=2){const s=Math.floor(e/7)+1,n=2*Math.ceil((r-13)/s/2-.25),o=[6];for(let t=s;t-- >0;)o.push(r-7-t*n);for(let e=0;e<=s;++e)for(let r=0;r<=s;++r)!e&&!r||!e&&r===s||e===s&&!r||D(t,o[e],o[r])}if(e>=7)for(let s=e<<12|U(e,7973,13),n=0;n<6;++n)for(let e=12;e-- >9;s>>>=1)t.set(n,r-e,1&s),t.set(r-e,n,1&s)})(r,t),O[t]=e=[r,C(r)]}return[new d(e[0]),e[1]]};exports.correction=r,exports.generate=function(t){let{minCorrectionLevel:s=r.min,maxCorrectionLevel:n=r.max,minVersion:o=1,maxVersion:i=40,mask:l=null}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(n<s)throw new Error("Invalid correction level range");if(i<o)throw new Error("Invalid version range");"string"==typeof t&&(t=f.auto(t));let h=0;for(let r=o;r<=i;++r){if(e[s].v[r-1].capBits<h)continue;const o=new g(2956);t(o,r),h=o.bits;for(let t=n;t>=s;--t){const s=e[t],n=s.v[r-1];if(n.capBits<h)continue;for(o.push(0,4),o.bits=o.bits+7&-8;o.bits<n.capBits;)o.push(60433,16);const[i,a]=S(r);return L(i,a,x(o.bytes,n)),null!==l?(k(i,m[l],l,s.id),i):m.map(((t,e)=>{const r=new d(i);return k(r,t,e,s.id),r.s=N(r),r})).reduce(((t,e)=>e.s<t.s?e:t))}}throw new Error("Too much data")},exports.mode=f;
//# sourceMappingURL=index.js.map
