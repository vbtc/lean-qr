"use strict";const t=[.2,3/8,5/9,2/3],o=(o,e)=>r=>{const n=4*o+r-4,s="*-04-39?2$%%$%%'$%''%'''%')(%'))%(++'(++'(+.'+-.',/3',33)-/5)-43).36)058*18<+37<+4:<,4:E,5<A-7>C/8@F/:EH/<EK0=FM1?IP2@KS3BNV4DPY5FS\\6HV_6IXb7K[e8N^i9Pam;Rdp<Tgt".charCodeAt(n)-35,f=n>8?s:1,c=e/f|0,l=e%f,i=f-l,a=n>8?c*t[r]+(o>5)&-2:s,u=c-a;return{t:8*(i*u+l*(u+1)),o:l?[[i,u],[l,u+1]]:[[i,u]],l:a}},e={min:0,L:0,M:1,Q:2,H:3,max:3},r=t=>new Uint8Array(t),n=t=>{const o=new Error(`lean-qr error ${t}`);throw o.code=t,o},s=t=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(t),f=t=>t.charCodeAt(0),c=(...t)=>(o,e)=>t.forEach((t=>t(o,e))),l=t=>o=>{o.eci!==t&&(o.push(7,4),o.push(t,8),o.eci=t)},i=t=>(o,e)=>{o.push(4,4),o.push(t.length,8+8*(e>9)),t.forEach((t=>o.push(t,8)))},a=(t,o,e,r,n=(r?o=>c(l(r),t(o)):t))=>(n.test=o,n.est=e,n.eci=r,n),u=a((t=>(o,e)=>{o.push(1,4),o.push(t.length,10+2*(e>26)+2*(e>9));let r=0;for(;r<t.length-2;r+=3)o.push(+t.slice(r,r+3),10);r<t.length-1?o.push(+t.slice(r,r+2),7):r<t.length&&o.push(+t[r],4)}),/./.test.bind(/[0-9]/),((t,o)=>14+2*(o>26)+2*(o>9)+10*t.length/3)),_=a((t=>(o,e)=>{o.push(2,4),o.push(t.length,9+2*(e>26)+2*(e>9));let r=0;for(;r<t.length-1;r+=2)o.push(45*s(t[r])+s(t[r+1]),11);r<t.length&&o.push(s(t[r]),6)}),(t=>s(t)>=0),((t,o)=>13+2*(o>26)+2*(o>9)+5.5*t.length)),d=a((t=>i([...t].map(f))),(t=>f(t)<128),((t,o)=>12+8*(o>9)+8*t.length)),p=a(d,(t=>f(t)<256),d.est,3),m=new TextEncoder,h=a((t=>i(m.encode(t))),(()=>1),((t,o)=>12+8*(o>9)+8*m.encode(t).length),26);let x=()=>{const t=new Map,o=new TextDecoder("sjis"),e=r(2);for(const[r,n,s]of[[33088,40957,33088],[57408,60352,49472]])for(let f=r;f<n;++f)e[0]=f>>8,e[1]=255&f,t.set(o.decode(e),192*(f-s>>8)+(f-s&255));return t.delete("\ufffd"),x=()=>t,t};const g=a((t=>(o,e)=>{o.push(8,4),o.push(t.length,8+2*(e>26)+2*(e>9));for(const e of t)o.push(x().get(e),13)}),(t=>x().has(t)),((t,o)=>12+2*(o>26)+2*(o>9)+13*t.length)),y=t=>t.reduce(((t,o)=>o.u<t.u?o:t)),w=[u,_,d,p,g,h],E={auto:(t,{modes:o=w}={})=>(e,r)=>{let s=[{u:0}];for(let e=0;e<t.length;++e)s=o.filter((o=>o.test(t[e]))).map((o=>y(s.map((n=>{const s=n._===o?n.m:e,f=n._===o?n.h:n,c=t.slice(s,e+1),l=o.eci??f.g;return{_:o,h:f,m:s,v:c,u:f.u+12*(l!==f.i)+Math.ceil(o.est(c,r)),g:l}}))))),s.length||n(5);const f=[];for(let t=y(s);t._;t=t.h)f.unshift(t._(t.v));f.forEach((t=>t(e,r)))},multi:c,eci:l,numeric:u,alphaNumeric:_,bytes:i,ascii:d,iso8859_1:p,shift_jis:g,utf8:h},M=()=>({C:r(2956),D:0,push(t,o){for(let e=o,r=8-(7&this.D);e>0;e-=r,r=8)this.C[this.D>>3]|=t<<r>>e,this.D+=e<r?e:r}}),v=(t,o=t*t,e=r(o))=>({size:t,S:e,get:(o,r)=>o>=0&&o<t&&!!(1&e[r*t+o]),V(o,r,n){e[r*t+o]=n},toString({on:o="##",off:e="  ",lf:r="\n",padX:n=4,padY:s=4}={}){let f="";for(let c=-s;c<t+s;++c){for(let r=-n;r<t+n;++r)f+=this.get(r,c)?o:e;f+=r}return f},toImageData(o,{on:e=[0,0,0],off:r=[0,0,0,0],padX:n=4,padY:s=4}={}){const f=t+2*n,c=t+2*s,l=o.createImageData(f,c),i=new Uint32Array(l.data.buffer);l.data.set([...e,255]);const a=i[0];l.data.set([...r,255]);const u=i[0];for(let t=0;t<c;++t)for(let o=0;o<f;++o)i[t*f+o]=this.get(o-n,t-s)?a:u;return l},toCanvas(t,o){const e=t.getContext("2d"),r=this.toImageData(e,o);t.width=r.width,t.height=r.height,e.putImageData(r,0,0)},toDataURL({type:t="image/png",scale:o=1,...e}={}){const r=document.createElement("canvas"),n=r.getContext("2d"),s=this.toImageData(n,e);return r.width=s.width*o,r.height=s.height*o,n.putImageData(s,0,0),n.imageSmoothingEnabled=!1,n.globalCompositeOperation="copy",n.drawImage(r,0,0,s.width,s.height,0,0,r.width,r.height),r.toDataURL(t,1)}}),z=[(t,o)=>!(1&(t^o)),(t,o)=>!(1&o),t=>!(t%3),(t,o)=>!((t+o)%3),(t,o)=>!(1&((t/3|0)^o>>1)),(t,o)=>!((t&o&1)+t*o%3),(t,o)=>!((t&o&1)+t*o%3&1),(t,o)=>!((1&(t^o))+t*o%3&1)],C=r(512);C[0]=1;for(let t=0,o=1;t<255;C[++t]=o)C[o+256]=t,o*=2,256&o&&(o^=285);const D=t=>C[t%255],L=t=>C[t+256],S=(t,o)=>{const e=r(t.length+o.length-1);for(let r=0;r<t.length;++r)for(let n=0;n<o.length;++n)e[r+n]^=D(t[r]+o[n]);return e.map(L)},V=(t,o)=>{const e=r(t.length+o.length-1);e.set(t,0);for(let r=0;r<t.length;++r)if(e[r]){const t=L(e[r]);for(let n=0;n<o.length;++n)e[r+n]^=D(o[n]+t)}return e.slice(t.length)},$=[[0],[0,0]];for(let t=1,o=$[1];t<30;++t){const e=S(o,[0,t]);$.push(e),o=e}const b=(t,o)=>{const e=[[],[]];let n=0,s=0;for(const[r,f]of o.o)for(let c=0;c<r;++c,n+=f){const r=t.slice(n,n+f);e[0].push(r),e[1].push(V(r,$[o.l])),s+=f+o.l}const f=r(s);let c=0;for(const t of e)for(let o,e=0;c!==o;++e){o=c;for(const o of t)e<o.length&&(f[c++]=o[e])}return f},A=(t,o,e)=>{let r=t<<e-1;for(let t=134217728;t;t>>=1)r&t&&(r^=o*(t>>e-1));return r},F=({size:t,S:o,V:e},r)=>{const n=(e,r,n,s,f)=>{for(;s-- >0;){const c=(r+s)*t+e;o.fill(f,c,c+n)}},s=(t,o)=>{n(t-3,o-3,7,7,3),n(t-2,o-2,5,5,2),n(t-1,o-1,3,3,3)},f=(t,o)=>{n(t-2,o-2,5,5,3),n(t-1,o-1,3,3,2),e(t,o,3)};n(7,0,2,9,2),n(t-8,0,8,9,2);for(let o=0;o<t;++o)e(o,6,3^1&o);if(s(3,3),s(t-4,3),r>1){const o=1+(r/7|0),e=2*((t-13)/o/2+.75|0);for(let r=0;r<o;++r){const n=t-7-r*e;r&&f(n,6);for(let r=0;r<o;++r)f(n,t-7-r*e)}}if(r>6)for(let o=r<<12|A(r,7973,13),n=0;n<6;++n)for(let r=12;r-- >9;o>>=1)e(t-r,n,2|1&o);for(let e=0;e<t;++e)for(let r=e;r<t;++r)o[r*t+e]=o[e*t+r];e(8,t-8,3)},H=({size:t,S:o})=>{const e=[];for(let r=t-2,n=t,s=-1;r>=0;r-=2){for(5===r&&(r=4);n+=s,-1!==n&&n!==t;){const s=n*t+r;o[s+1]<2&&e.push(s+1),o[s]<2&&e.push(s)}s*=-1}return e},I=({S:t},o,e)=>o.forEach(((o,r)=>t[o]=e[r>>3]>>7-(7&r)&1)),K=({size:t,S:o,V:e},r,n,s)=>{for(let e=0;e<t;++e)for(let n=0;n<t;++n){const s=e*t+n;o[s]^=r(n,e)&(o[s]>>1^1)}const f=(1^s)<<3|n;let c=21522^(f<<10|A(f,1335,11));for(let o=8;o-- >0;c>>=1)e(8,(o>1?7:8)-o,c),e(t-8+o,8,c);for(let o=7;o-- >0;c>>=1)e(o>5?7:o,8,c),e(8,t-o-1,c)},N=(t,o,e)=>{for(let r=0;r<t.size;++r)for(let n=0,s=o,f=o;n<t.size;++n)s=e(s,t.get(n,r)),f=e(f,t.get(r,n))},P=t=>((t,o=0)=>(N(t,[0],(([t,e],r)=>r!==e?[1,r]:(4===t?o+=3:t>4&&++o,[t+1,e]))),o))(t)+3*((t,o=0)=>{for(let e=1;e<t.size;++e)for(let r=1,n=t.get(e-1,0),s=t.get(e,0)===n;r<t.size;++r){const f=t.get(e-1,r),c=t.get(e,r)===f;o+=s&&c&&n===f,n=f,s=c}return o})(t)+40*((t,o=0)=>(N(t,0,((t,e)=>{const r=(t>>1|2098176)&(3047517^e-1);return 2049&r&&++o,r})),o))(t)+10*((t,o=0)=>(N(t,0,((t,e)=>o+=e)),20*Math.abs(o/(t.size*t.size*2)-.5)|0))(t),T=[],U=(t=n(1),{minCorrectionLevel:r=e.min,maxCorrectionLevel:s=e.max,minVersion:f=1,maxVersion:c=40,mask:l,trailer:i=60433,...a}={})=>{s<r&&n(3),c<f&&n(2),"string"==typeof t&&(t=E.auto(t,a));for(let e=f,n=0;e<=c;++e){let f=T[e];f||(T[e]=f=v(4*e+17),F(f,e),f.p=H(f));const c=o(e,f.p.length>>3);if(c(r).t<n)continue;const a=M();t(a,e),n=a.D;for(let t=s;t>=r;--t){const o=c(t);if(o.t<n)continue;for(a.push(0,4),a.D=a.D+7&-8;a.D<o.t;)a.push(i,16);const e=v(f.size,f.S);return I(e,f.p,b(a.C,o)),(z[l??-1]?[z[l]]:z).map(((o,r)=>{const n=v(e.size,e.S);return K(n,o,l??r,t),n.s=P(n),n})).reduce(((t,o)=>o.s<t.s?o:t))}}n(4)};U.with=(...t)=>(o,e)=>U(o,{modes:[...w,...t],...e}),exports.correction=e,exports.generate=U,exports.mode=E;
