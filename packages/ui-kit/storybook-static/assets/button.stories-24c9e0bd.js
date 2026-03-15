import{j as t}from"./jsx-runtime-9bc08dc0.js";import{K as n}from"./index.es-0af5970b.js";import{r as c}from"./index-0b625b07.js";import"./index-68fbcb4b.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),se=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,a,s)=>s?s.toUpperCase():a.toLowerCase()),S=r=>{const e=se(r);return e.charAt(0).toUpperCase()+e.slice(1)},Y=(...r)=>r.filter((e,a,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===a).join(" ").trim(),ne=r=>{for(const e in r)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ie={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=c.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:a=2,absoluteStrokeWidth:s,className:i="",children:o,iconNode:x,...l},w)=>c.createElement("svg",{ref:w,...ie,width:e,height:e,stroke:r,strokeWidth:s?Number(a)*24/Number(e):a,className:Y("lucide",i),...!o&&!ne(l)&&{"aria-hidden":"true"},...l},[...x.map(([k,d])=>c.createElement(k,d)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=(r,e)=>{const a=c.forwardRef(({className:s,...i},o)=>c.createElement(ce,{ref:o,iconNode:e,className:Y(`lucide-${oe(S(r))}`,`lucide-${r}`,s),...i}));return a.displayName=S(r),a};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],de=ee("arrow-right",le);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],pe=ee("sparkles",ue),me={default:"h-9 px-4 py-2 text-sm has-[>svg]:px-3",sm:"h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5",lg:"h-10 px-6 text-sm has-[>svg]:px-4",icon:"size-9 p-0","icon-sm":"size-8 p-0","icon-lg":"size-10 p-0"},ge={default:"bg-(--neon-main) text-(--background) hover:bg-(--neon-main-bright)",destructive:"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",outline:"border border-(--border) bg-(--card) text-(--foreground) hover:bg-(--muted)",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},re=({icon:r,leftIcon:e,rightIcon:a,onClick:s,state:i="default",variant:o="default",size:x="default",isGlow:l=!1,isFullWidth:w=!1,className:k,children:d,...te})=>{const j=i==="active"||l?"active":"default",N=e??r,ae=o==="default";return t.jsxs("button",{onClick:s,"data-state":j,"data-variant":o,className:n("group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-(--radius) font-medium","transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]","focus:outline-none focus:ring-2 focus:ring-(--neon-main) focus:ring-offset-2 focus:ring-offset-(--card)","disabled:pointer-events-none disabled:opacity-50",me[x],ge[o],w&&"w-full",j==="active"&&o==="default"&&"neon-pulse-ring",k),...te,children:[ae?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:n("pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100","bg-gradient-to-b from-transparent via-(--neon-main)/10 to-transparent"),style:{animation:"scan-button 2s linear infinite"}}),t.jsx("div",{className:n("absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-(--neon-main)","opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100")}),t.jsx("div",{className:n("absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-(--neon-main)","opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100")}),t.jsx("div",{className:n("absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-(--neon-main)","opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100")}),t.jsx("div",{className:n("absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-(--neon-main)","opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100")}),t.jsx("div",{className:n("pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100","bg-gradient-to-r from-(--neon-main)/0 via-(--neon-main)/5 to-(--neon-main)/0"),style:{animation:"pulse-button 2s ease-in-out infinite"}})]}):null,N?t.jsx("span",{className:"relative z-10",children:N}):null,d?t.jsx("span",{className:"relative z-10",children:d}):null,a?t.jsx("span",{className:"relative z-10",children:a}):null]})};re.__docgenInfo={description:"",methods:[],displayName:"Button",props:{state:{defaultValue:{value:"'default'",computed:!1},required:!1},variant:{defaultValue:{value:"'default'",computed:!1},required:!1},size:{defaultValue:{value:"'default'",computed:!1},required:!1},isGlow:{defaultValue:{value:"false",computed:!1},required:!1},isFullWidth:{defaultValue:{value:"false",computed:!1},required:!1}}};const be={title:"Atoms/Button",component:re,tags:["autodocs"],args:{children:"Infinityloop",state:"default",variant:"default",size:"default"},argTypes:{state:{control:"select",options:["default","active"]},variant:{control:"select",options:["default","destructive","outline","secondary","ghost","link"]},size:{control:"select",options:["default","sm","lg","icon","icon-sm","icon-lg"]}}},u={},p={args:{state:"active",children:"Infinityloop"}},m={args:{variant:"outline",children:"Outline",state:"default"}},g={args:{variant:"destructive",children:"Delete"}},h={args:{variant:"secondary",children:"Secondary"}},f={args:{variant:"ghost",children:"Ghost"}},v={args:{variant:"link",children:"Learn more"}},y={args:{children:"∞",size:"icon",state:"active",className:"text-lg font-bold","aria-label":"Infinity logo button"}},b={args:{children:"Infinityloop",leftIcon:t.jsx(pe,{className:"size-4"}),rightIcon:t.jsx(de,{className:"size-4"})}};var z,I,C;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:"{}",...(C=(I=u.parameters)==null?void 0:I.docs)==null?void 0:C.source}}};var A,L,q;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    state: "active",
    children: "Infinityloop"
  }
}`,...(q=(L=p.parameters)==null?void 0:L.docs)==null?void 0:q.source}}};var _,B,D;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: "outline",
    children: "Outline",
    state: "default"
  }
}`,...(D=(B=m.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};var E,O,G;g.parameters={...g.parameters,docs:{...(E=g.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    variant: "destructive",
    children: "Delete"
  }
}`,...(G=(O=g.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};var R,V,W;h.parameters={...h.parameters,docs:{...(R=h.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    children: "Secondary"
  }
}`,...(W=(V=h.parameters)==null?void 0:V.docs)==null?void 0:W.source}}};var $,M,P;f.parameters={...f.parameters,docs:{...($=f.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    variant: "ghost",
    children: "Ghost"
  }
}`,...(P=(M=f.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};var K,F,U;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    variant: "link",
    children: "Learn more"
  }
}`,...(U=(F=v.parameters)==null?void 0:F.docs)==null?void 0:U.source}}};var Z,T,H;y.parameters={...y.parameters,docs:{...(Z=y.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    children: "∞",
    size: "icon",
    state: "active",
    className: "text-lg font-bold",
    "aria-label": "Infinity logo button"
  }
}`,...(H=(T=y.parameters)==null?void 0:T.docs)==null?void 0:H.source}}};var J,Q,X;b.parameters={...b.parameters,docs:{...(J=b.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    children: "Infinityloop",
    leftIcon: <Sparkles className="size-4" />,
    rightIcon: <ArrowRight className="size-4" />
  }
}`,...(X=(Q=b.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const xe=["Playground","Active","Outline","Destructive","Secondary","Ghost","Link","LogoSquare","WithBothIcons"];export{p as Active,g as Destructive,f as Ghost,v as Link,y as LogoSquare,m as Outline,u as Playground,h as Secondary,b as WithBothIcons,xe as __namedExportsOrder,be as default};
