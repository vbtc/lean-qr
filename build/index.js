"use strict";const t=t=>t.match(/.{4}/g).map((t=>{const e=t.charCodeAt(0)-35,r=t.charCodeAt(1)-35,s=92*t.charCodeAt(2)+t.charCodeAt(3)-3255,n=s>>5;return{c:8*(r*n+e*(n+1)),g:e?[[r,n],[e,n+1]]:[[r,n]],s:31&s}})),e=[{id:1,v:t("#$)b#$.y#$6>#$?'#$Hq#%:q#%>C#%E##%Ka%%:q#'?G%%C;#'HQ$&KA$(AQ$(EC($HS$(M)'&J[(&HS''K_*%Iw('MI')L%'+H1%-J{'+Mi-&L%**Ka-(KA&0KA#4KA$4KA)0KA*/MI1)MI'4Mi5'Mi'7L%)6LE")},{id:0,v:t("#$(a#$,w#$2Y#%.A#%27#',W#'-}%%0M%&/i$'29'$4e%)/i$+0-('13((1S&*2{$-3?',29.&2Y0&1U#41u#43?1'3_1)2{0+3_'63?&92{:&2{*82{-63_@%3?:-3?813?:13?=/3_E)3_1@3?C03?*K3_B53_")},{id:3,v:t("#$'`#$*u#%)-#%+]%%(I#')s'%()%')Q''(k%))s''*{)'*9'+*7(.(k*(+a%2)s2$*{$4*{'4*Y(2+a)4*{3*+a1.+a3.+a9*+a)?*{=++AB'+aH$+A<2+a$M+aF-+a6@+a*O+a1J+a-Q+a-T+a1S+a9N+aEE+a")},{id:2,v:t("#$&@#$(s#%'i#'&?%%')#'(S$''m%'(1'''K%)(S+&'K'*(3'/')(.'K*.'K0&(U4%(36%(33,'m-2(S)6(u#E'k13(U%A(u09(U'D(u?/(UB.(U=6(U<:(U?:(UF6(UQ.(U$^(uL9(Uc%(UQ;(UCM(Uf-(U`7(U")}],r={min:0,L:0,M:1,Q:2,H:3,max:3},s=t=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(t),n=(...t)=>(e,r)=>t.forEach((t=>t(e,r))),o=t=>(e,r)=>{e.push(1,4),e.push(t.length,r<10?10:r<27?12:14);let s=0;for(;s<t.length-2;s+=3)e.push(Number(t.slice(s,s+3)),10);s<t.length-1?e.push(Number(t.slice(s,s+2)),7):s<t.length&&e.push(Number(t[s]),4)},i=t=>(e,r)=>{e.push(2,4),e.push(t.length,r<10?9:r<27?11:13);let n=0;for(;n<t.length-1;n+=2)e.push(45*s(t[n])+s(t[n+1]),11);n<t.length&&e.push(s(t[n]),6)},a=t=>(e,r)=>{e.push(4,4),e.push(t.length,r<10?8:16),t.forEach((t=>e.push(t,8)))},h=t=>e=>{e.push(7,4),e.push(t,8)},l=t=>a([...t].map((t=>t.codePointAt(0)))),c=t=>n(h(26),a((new TextEncoder).encode(t))),u=t=>t.reduce(((t,e)=>e.e<t.e?e:t));o.reg=/[0-9]/,o.est=(t,e)=>4+(e<10?10:e<27?12:14)+10*t.length/3,i.reg=/[0-9A-Z $%*+./:-]/,i.est=(t,e)=>4+(e<10?9:e<27?11:13)+5.5*t.length,l.reg=/[\u0000-\u00FF]/,l.est=(t,e)=>4+(e<10?8:16)+8*t.length;var f={auto:(t,{modes:e=[o,i,l,c]}={})=>{const r=new Set(e),s=r.delete(c);return s&&(e=[...r]),(r,n)=>{let o=[{c:0,e:0}];for(let i=0;i<t.length;++i)if(o=e.filter((e=>e.reg.test(t[i]))).map((e=>u(o.map((r=>{const s={c:e,p:r.c===e?r.p:r,s:r.c===e?r.s:i};return s.v=t.slice(s.s,i+1),s.e=s.p.e+Math.ceil(e.est(s.v,n)),s}))))),!o.length){if(s)return void c(t)(r,n);throw new Error("Unencodable")}const i=[];for(let t=u(o);t.c;t=t.p)i.unshift(t.c(t.v));i.forEach((t=>t(r,n)))}},multi:n,eci:h,numeric:o,alphaNumeric:i,bytes:a,iso8859_1:l,utf8:c};class g{constructor(t){this.bytes=new Uint8Array(t),this.bits=0}push(t,e){for(let r=e,s=8-(7&this.bits);r>0;r-=s,s=8)this.bytes[this.bits>>>3]|=t<<s>>>r,this.bits+=r<s?r:s}}function d(t){Array.isArray(t)||(t=[255&t,t>>>8&255,t>>>16&255,t>>>24]);const e=new Uint8Array([...t,255]);return new Uint32Array(e.buffer,0,1)[0]}class p{constructor({size:t,d:e}){this.size=t,this.d=new Uint8Array(e||t*t)}get(t,e){return t>=0&&e>=0&&t<this.size&&e<this.size&&!!(1&this.d[e*this.size+t])}masked(t,e){return 2&this.d[e*this.size+t]}set(t,e,r,s=1){this.d[e*this.size+t]=2*s|!!r}inv(t,e){this.d[e*this.size+t]^=1}toString({on:t="##",off:e="  ",lf:r="\n",padX:s=4,padY:n=4}={}){let o="";for(let i=-n;i<this.size+n;++i){for(let r=-s;r<this.size+s;++r)o+=this.get(r,i)?t:e;o+=r}return o}toImageData(t,{on:e=4278190080,off:r=0,padX:s=4,padY:n=4}={}){const o=this.size+2*s,i=this.size+2*n,a=t.createImageData(o,i),h=new Uint32Array(a.data.buffer),l=d(e),c=d(r);for(let t=0;t<i;++t)for(let e=0;e<o;++e)h[t*o+e]=this.get(e-s,t-n)?l:c;return a}toCanvas(t,e){const r=t.getContext("2d"),s=this.toImageData(r,e);t.width=s.width,t.height=s.height,r.putImageData(s,0,0)}toDataURL({type:t="image/png",scale:e=1,...r}={}){const s=document.createElement("canvas"),n=s.getContext("2d"),o=this.toImageData(n,r);return s.width=o.width*e,s.height=o.height*e,n.putImageData(o,0,0),n.imageSmoothingEnabled=!1,n.globalCompositeOperation="copy",n.drawImage(s,0,0,o.width,o.height,0,0,s.width,s.height),s.toDataURL(t,1)}}var m=[(t,e)=>!(1&(t^e)),(t,e)=>!(1&e),t=>!(t%3),(t,e)=>!((t+e)%3),(t,e)=>!(1&((t/3|0)^e>>1)),(t,e)=>!((t&e&1)+t*e%3),(t,e)=>!((t&e&1)+t*e%3&1),(t,e)=>!((1&(t^e))+t*e%3&1)];const w=new Uint8Array(512);w[0]=1;for(let t=0,e=1;t<255;w[++t]=e)w[e+256]=t,e*=2,256&e&&(e^=285);const U=t=>w[t%255],$=t=>w[t+256],A=(t,e)=>{const r=new Uint8Array(t.length+e.length-1);for(let s=0;s<t.length;++s)for(let n=0;n<e.length;++n)r[s+n]^=U(t[s]+e[n]);return r.map($)},v=(t,e)=>{const r=new Uint8Array(t.length+e.length-1);r.set(t,0);for(let s=0;s<t.length;++s)if(r[s]){const t=$(r[s]);for(let n=0;n<e.length;++n)r[s+n]^=U(e[n]+t)}return r.slice(t.length)},z=[[0],[0,0]];for(let t=1,e=z[1];t<30;++t){const r=A(e,[0,t]);z.push(r),e=r}const b=(t,e,r)=>{let s=e;const n=Math.max(...r.map((t=>t.length)));for(let e=0;e<n;++e)r.forEach((r=>{e<r.length&&(t[s++]=r[e])}));return s};var E=(t,e)=>{const r=[],s=[];let n=0,o=0;e.g.forEach((([i,a])=>{for(let o=0;o<i;++o,n+=a){const o=t.slice(n,n+a);r.push(o),s.push(v(o,z[e.s]))}o+=i*(a+e.s)}));const i=new Uint8Array(o),a=b(i,0,r);return b(i,a,s),i};const y=(t,e,r)=>{let s=t<<r-1;for(let t=134217728;t;t>>>=1)s&t&&(s^=e*(t>>>r-1));return s},C=(t,e,r,s,n,o)=>{for(let i=r;i<n;++i)for(let r=e;r<s;++r)t.set(r,i,o)},I=(t,e,r)=>{C(t,e-3,r-3,e+4,r+4,1),C(t,e-2,r-2,e+3,r+3,0),C(t,e-1,r-1,e+2,r+2,1)},K=(t,e,r)=>{C(t,e-2,r-2,e+3,r+3,1),C(t,e-1,r-1,e+2,r+2,0),t.set(e,r,1)},M=t=>{const e=t.size,r=[];for(let s=e-2,n=e,o=-1;s>=0;s-=2){for(5===s&&(s=4);n+=o,-1!==n&&n!==e;)t.masked(s+1,n)||r.push([s+1,n]),t.masked(s,n)||r.push([s,n]);o*=-1}return r},x=(t,e,r)=>{e.forEach((([e,s],n)=>t.set(e,s,r[n>>3]<<(7&n)&128,0)))},L=(t,e,r,s)=>{const n=t.size;for(let r=0;r<n;++r)for(let s=0;s<n;++s)e(s,r)&&!t.masked(s,r)&&t.inv(s,r);const o=s<<3|r;let i=21522^(o<<10|y(o,1335,11));for(let e=8;e-- >0;i>>=1)t.set(8,(e>1?7:8)-e,1&i),t.set(n-8+e,8,1&i);for(let e=7;e-- >0;i>>=1)t.set(e>5?7:e,8,1&i),t.set(8,n-e-1,1&i)},S=(t,e,r)=>{for(let s=0;s<t.size;++s){let n=e,o=e;for(let e=0;e<t.size;++e)n=r(n,t.get(e,s)),o=r(o,t.get(s,e))}};var D=t=>(t=>{let e=0;return S(t,[0],(([t,r],s)=>s!==r?[1,s]:(4===t?e+=3:t>4&&++e,[t+1,r]))),e})(t)+3*(t=>{let e=0;for(let r=1;r<t.size;++r){let s=t.get(r-1,0),n=t.get(r,0)===s;for(let o=1;o<t.size;++o){const i=t.get(r-1,o),a=t.get(r,o)===i;e+=n&&a&&s===i,s=i,n=a}}return e})(t)+40*(t=>{let e=0;return S(t,0,((t,r)=>{const s=(t>>>1|2098176)&(3047517^(r?0:-1));return 2049&s&&++e,s})),e})(t)+(t=>{let e=0;for(let r=0;r<t.size;++r)for(let s=0;s<t.size;++s)e+=t.get(s,r);return 10*(20*Math.abs(e/(t.size*t.size)-.5)|0)})(t);const _=[],k=t=>{let e=_[t];if(!e){const r=new p({size:4*t+17});((t,e)=>{const r=4*e+17;I(t,3,3),I(t,r-4,3),I(t,3,r-4),C(t,0,7,9,9,0),C(t,7,0,9,7,0),C(t,r-8,7,r,9,0),C(t,r-8,0,r-7,7,0),C(t,7,r-8,9,r,0),C(t,0,r-8,7,r-7,0),t.set(8,r-8,1);for(let e=8;e<r-8;++e)t.set(e,6,!(1&e)),t.set(6,e,!(1&e));if(e>=2){const s=1+(e/7|0),n=2*((r-13)/s/2+.75|0),o=[6];for(let t=s;t-- >0;)o.push(r-7-t*n);for(let e=0;e<=s;++e)for(let r=0;r<=s;++r)!e&&!r||!e&&r===s||e===s&&!r||K(t,o[e],o[r])}if(e>=7)for(let s=e<<12|y(e,7973,13),n=0;n<6;++n)for(let e=12;e-- >9;s>>>=1)t.set(n,r-e,1&s),t.set(r-e,n,1&s)})(r,t),_[t]=e=[r,M(r)]}return[new p(e[0]),e[1]]};exports.correction=r,exports.generate=(t,{minCorrectionLevel:s=r.min,maxCorrectionLevel:n=r.max,minVersion:o=1,maxVersion:i=40,mask:a=null}={})=>{if(n<s)throw new Error("Invalid correction level range");if(i<o)throw new Error("Invalid version range");"string"==typeof t&&(t=f.auto(t));let h=0;for(let r=o;r<=i;++r){if(e[s].v[r-1].c<h)continue;const o=new g(2956);t(o,r),h=o.bits;for(let t=n;t>=s;--t){const s=e[t],n=s.v[r-1];if(n.c<h)continue;for(o.push(0,4),o.bits=o.bits+7&-8;o.bits<n.c;)o.push(60433,16);const[i,l]=k(r);return x(i,l,E(o.bytes,n)),null!==a?(L(i,m[a],a,s.id),i):m.map(((t,e)=>{const r=new p(i);return L(r,t,e,s.id),r.s=D(r),r})).reduce(((t,e)=>e.s<t.s?e:t))}}throw new Error("Too much data")},exports.mode=f;
