"use strict";const t=t=>t.match(/.{4}/g).map((t=>{const e=t.charCodeAt(0)-35,s=t.charCodeAt(1)-35,r=92*t.charCodeAt(2)+t.charCodeAt(3)-3255,n=r>>5;return{c:8*(s*n+e*(n+1)),g:e?[[s,n],[e,n+1]]:[[s,n]],s:31&r}})),e=[{id:1,v:t("#$)b#$.y#$6>#$?'#$Hq#%:q#%>C#%E##%Ka%%:q#'?G%%C;#'HQ$&KA$(AQ$(EC($HS$(M)'&J[(&HS''K_*%Iw('MI')L%'+H1%-J{'+Mi-&L%**Ka-(KA&0KA#4KA$4KA)0KA*/MI1)MI'4Mi5'Mi'7L%)6LE")},{id:0,v:t("#$(a#$,w#$2Y#%.A#%27#',W#'-}%%0M%&/i$'29'$4e%)/i$+0-('13((1S&*2{$-3?',29.&2Y0&1U#41u#43?1'3_1)2{0+3_'63?&92{:&2{*82{-63_@%3?:-3?813?:13?=/3_E)3_1@3?C03?*K3_B53_")},{id:3,v:t("#$'`#$*u#%)-#%+]%%(I#')s'%()%')Q''(k%))s''*{)'*9'+*7(.(k*(+a%2)s2$*{$4*{'4*Y(2+a)4*{3*+a1.+a3.+a9*+a)?*{=++AB'+aH$+A<2+a$M+aF-+a6@+a*O+a1J+a-Q+a-T+a1S+a9N+aEE+a")},{id:2,v:t("#$&@#$(s#%'i#'&?%%')#'(S$''m%'(1'''K%)(S+&'K'*(3'/')(.'K*.'K0&(U4%(36%(33,'m-2(S)6(u#E'k13(U%A(u09(U'D(u?/(UB.(U=6(U<:(U?:(UF6(UQ.(U$^(uL9(Uc%(UQ;(UCM(Uf-(U`7(U")}],s={min:0,L:0,M:1,Q:2,H:3,max:3},r=t=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(t),n=(...t)=>(e,s)=>t.forEach((t=>t(e,s))),o=t=>e=>{e.eci!==t&&(e.push(7,4),e.push(t,8),e.eci=t)},i=t=>(e,s)=>{e.push(4,4),e.push(t.length,s<10?8:16),t.forEach((t=>e.push(t,8)))},a=t=>(e,s)=>{e.push(1,4),e.push(t.length,s<10?10:s<27?12:14);let r=0;for(;r<t.length-2;r+=3)e.push(+t.slice(r,r+3),10);r<t.length-1?e.push(+t.slice(r,r+2),7):r<t.length&&e.push(+t[r],4)};a.reg=/[0-9]/,a.est=(t,e)=>4+(e<10?10:e<27?12:14)+10*t.length/3;const h=t=>(e,s)=>{e.push(2,4),e.push(t.length,s<10?9:s<27?11:13);let n=0;for(;n<t.length-1;n+=2)e.push(45*r(t[n])+r(t[n+1]),11);n<t.length&&e.push(r(t[n]),6)};h.reg=/[0-9A-Z $%*+./:-]/,h.est=(t,e)=>4+(e<10?9:e<27?11:13)+5.5*t.length;const l=t=>i([...t].map((t=>t.codePointAt(0))));l.reg=/[\u0000-\u007F]/,l.est=(t,e)=>4+(e<10?8:16)+8*t.length;const c=t=>n(o(3),l(t));c.reg=/[\u0000-\u00FF]/,c.est=l.est,c.eci=3;const u=new TextEncoder,f=t=>n(o(26),i(u.encode(t)));f.reg=/[^]/,f.est=(t,e)=>4+(e<10?8:16)+8*u.encode(t).length,f.eci=26;const g=t=>t.reduce(((t,e)=>e.e<t.e?e:t)),d=[a,h,l,c,f];var p={auto:(t,{modes:e=d}={})=>(s,r)=>{let o=[{e:0}];for(let s=0;s<t.length;++s)if(o=e.filter((e=>e.reg.test(t[s]))).map((e=>g(o.map((n=>{const o=n.m===e?n.s:s,i=n.m===e?n.p:n,a=t.slice(o,s+1),h=e.eci??i.i;return{m:e,p:i,s:o,v:a,e:i.e+12*(h!==i.i)+Math.ceil(e.est(a,r)),i:h}}))))),!o.length)throw new Error("Unencodable");const i=[];for(let t=g(o);t.m;t=t.p)i.unshift(t.m(t.v));n(...i)(s,r)},multi:n,eci:o,numeric:a,alphaNumeric:h,bytes:i,ascii:l,iso8859_1:c,utf8:f};class m{constructor(t){this.bytes=new Uint8Array(t),this.bits=0}push(t,e){for(let s=e,r=8-(7&this.bits);s>0;s-=r,r=8)this.bytes[this.bits>>>3]|=t<<r>>>s,this.bits+=s<r?s:r}}function w(t){Array.isArray(t)||(t=[255&t,t>>>8&255,t>>>16&255,t>>>24]);const e=new Uint8Array([...t,255]);return new Uint32Array(e.buffer,0,1)[0]}class U{constructor({size:t,d:e}){this.size=t,this.d=new Uint8Array(e||t*t)}get(t,e){return t>=0&&e>=0&&t<this.size&&e<this.size&&!!(1&this.d[e*this.size+t])}masked(t,e){return 2&this.d[e*this.size+t]}set(t,e,s,r=1){this.d[e*this.size+t]=2*r|!!s}inv(t,e){this.d[e*this.size+t]^=1}toString({on:t="##",off:e="  ",lf:s="\n",padX:r=4,padY:n=4}={}){let o="";for(let i=-n;i<this.size+n;++i){for(let s=-r;s<this.size+r;++s)o+=this.get(s,i)?t:e;o+=s}return o}toImageData(t,{on:e=4278190080,off:s=0,padX:r=4,padY:n=4}={}){const o=this.size+2*r,i=this.size+2*n,a=t.createImageData(o,i),h=new Uint32Array(a.data.buffer),l=w(e),c=w(s);for(let t=0;t<i;++t)for(let e=0;e<o;++e)h[t*o+e]=this.get(e-r,t-n)?l:c;return a}toCanvas(t,e){const s=t.getContext("2d"),r=this.toImageData(s,e);t.width=r.width,t.height=r.height,s.putImageData(r,0,0)}toDataURL({type:t="image/png",scale:e=1,...s}={}){const r=document.createElement("canvas"),n=r.getContext("2d"),o=this.toImageData(n,s);return r.width=o.width*e,r.height=o.height*e,n.putImageData(o,0,0),n.imageSmoothingEnabled=!1,n.globalCompositeOperation="copy",n.drawImage(r,0,0,o.width,o.height,0,0,r.width,r.height),r.toDataURL(t,1)}}var $=[(t,e)=>!(1&(t^e)),(t,e)=>!(1&e),t=>!(t%3),(t,e)=>!((t+e)%3),(t,e)=>!(1&((t/3|0)^e>>1)),(t,e)=>!((t&e&1)+t*e%3),(t,e)=>!((t&e&1)+t*e%3&1),(t,e)=>!((1&(t^e))+t*e%3&1)];const A=new Uint8Array(512);A[0]=1;for(let t=0,e=1;t<255;A[++t]=e)A[e+256]=t,e*=2,256&e&&(e^=285);const z=t=>A[t%255],v=t=>A[t+256],b=(t,e)=>{const s=new Uint8Array(t.length+e.length-1);for(let r=0;r<t.length;++r)for(let n=0;n<e.length;++n)s[r+n]^=z(t[r]+e[n]);return s.map(v)},y=(t,e)=>{const s=new Uint8Array(t.length+e.length-1);s.set(t,0);for(let r=0;r<t.length;++r)if(s[r]){const t=v(s[r]);for(let n=0;n<e.length;++n)s[r+n]^=z(e[n]+t)}return s.slice(t.length)},E=[[0],[0,0]];for(let t=1,e=E[1];t<30;++t){const s=b(e,[0,t]);E.push(s),e=s}var C=(t,e)=>{const s=[[],[]];let r=0,n=0;for(const[o,i]of e.g)for(let a=0;a<o;++a,r+=i){const o=t.slice(r,r+i);s[0].push(o),s[1].push(y(o,E[e.s])),n+=i+e.s}const o=new Uint8Array(n);let i=0;for(const t of s)for(let e,s=0;i!==e;++s){e=i;for(const e of t)s<e.length&&(o[i++]=e[s])}return o};const I=(t,e,s)=>{let r=t<<s-1;for(let t=134217728;t;t>>>=1)r&t&&(r^=e*(t>>>s-1));return r},K=(t,e,s,r,n,o)=>{for(let i=s;i<n;++i)for(let s=e;s<r;++s)t.set(s,i,o)},M=(t,e,s)=>{K(t,e-3,s-3,e+4,s+4,1),K(t,e-2,s-2,e+3,s+3,0),K(t,e-1,s-1,e+2,s+2,1)},x=(t,e,s)=>{K(t,e-2,s-2,e+3,s+3,1),K(t,e-1,s-1,e+2,s+2,0),t.set(e,s,1)},L=t=>{const e=t.size,s=[];for(let r=e-2,n=e,o=-1;r>=0;r-=2){for(5===r&&(r=4);n+=o,-1!==n&&n!==e;)t.masked(r+1,n)||s.push([r+1,n]),t.masked(r,n)||s.push([r,n]);o*=-1}return s},D=(t,e,s)=>{e.forEach((([e,r],n)=>t.set(e,r,s[n>>3]<<(7&n)&128,0)))},S=(t,e,s,r)=>{const n=t.size;for(let s=0;s<n;++s)for(let r=0;r<n;++r)e(r,s)&&!t.masked(r,s)&&t.inv(r,s);const o=r<<3|s;let i=21522^(o<<10|I(o,1335,11));for(let e=8;e-- >0;i>>=1)t.set(8,(e>1?7:8)-e,1&i),t.set(n-8+e,8,1&i);for(let e=7;e-- >0;i>>=1)t.set(e>5?7:e,8,1&i),t.set(8,n-e-1,1&i)},_=(t,e,s)=>{for(let r=0;r<t.size;++r){let n=e,o=e;for(let e=0;e<t.size;++e)n=s(n,t.get(e,r)),o=s(o,t.get(r,e))}};var k=t=>(t=>{let e=0;return _(t,[0],(([t,s],r)=>r!==s?[1,r]:(4===t?e+=3:t>4&&++e,[t+1,s]))),e})(t)+3*(t=>{let e=0;for(let s=1;s<t.size;++s){let r=t.get(s-1,0),n=t.get(s,0)===r;for(let o=1;o<t.size;++o){const i=t.get(s-1,o),a=t.get(s,o)===i;e+=n&&a&&r===i,r=i,n=a}}return e})(t)+40*(t=>{let e=0;return _(t,0,((t,s)=>{const r=(t>>>1|2098176)&(3047517^(s?0:-1));return 2049&r&&++e,r})),e})(t)+(t=>{let e=0;for(let s=0;s<t.size;++s)for(let r=0;r<t.size;++r)e+=t.get(r,s);return 10*(20*Math.abs(e/(t.size*t.size)-.5)|0)})(t);const H=[],Q=t=>{let e=H[t];if(!e){const s=new U({size:4*t+17});((t,e)=>{const s=4*e+17;M(t,3,3),M(t,s-4,3),M(t,3,s-4),K(t,0,7,9,9,0),K(t,7,0,9,7,0),K(t,s-8,7,s,9,0),K(t,s-8,0,s-7,7,0),K(t,7,s-8,9,s,0),K(t,0,s-8,7,s-7,0),t.set(8,s-8,1);for(let e=8;e<s-8;++e)t.set(e,6,!(1&e)),t.set(6,e,!(1&e));if(e>=2){const r=1+(e/7|0),n=2*((s-13)/r/2+.75|0),o=[6];for(let t=r;t-- >0;)o.push(s-7-t*n);for(let e=0;e<=r;++e)for(let s=0;s<=r;++s)!e&&!s||!e&&s===r||e===r&&!s||x(t,o[e],o[s])}if(e>=7)for(let r=e<<12|I(e,7973,13),n=0;n<6;++n)for(let e=12;e-- >9;r>>>=1)t.set(n,s-e,1&r),t.set(s-e,n,1&r)})(s,t),H[t]=e=[s,L(s)]}return[new U(e[0]),e[1]]},F=(t,{minCorrectionLevel:r=s.min,maxCorrectionLevel:n=s.max,minVersion:o=1,maxVersion:i=40,mask:a=null,...h}={})=>{if(n<r)throw new Error("Invalid correction level range");if(i<o)throw new Error("Invalid version range");"string"==typeof t&&(t=p.auto(t,h));let l=0;for(let s=o;s<=i;++s){if(e[r].v[s-1].c<l)continue;const o=new m(2956);t(o,s),l=o.bits;for(let t=n;t>=r;--t){const r=e[t],n=r.v[s-1];if(n.c<l)continue;for(o.push(0,4),o.bits=o.bits+7&-8;o.bits<n.c;)o.push(60433,16);const[i,h]=Q(s);return D(i,h,C(o.bytes,n)),null!==a?(S(i,$[a],a,r.id),i):$.map(((t,e)=>{const s=new U(i);return S(s,t,e,r.id),s.s=k(s),s})).reduce(((t,e)=>e.s<t.s?e:t))}}throw new Error("Too much data")};F.with=(...t)=>(e,s)=>F(e,{modes:[...d,...t],...s}),exports.correction=s,exports.generate=F,exports.mode=p;
