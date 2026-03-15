import{j as c}from"./jsx-runtime-9bc08dc0.js";import{r as s}from"./index-0b625b07.js";import{B as h,a as C}from"./index-04a4e98e.js";import"./index.es-0af5970b.js";import"./index-68fbcb4b.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),b=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,o)=>o?o.toUpperCase():t.toLowerCase()),d=r=>{const e=b(r);return e.charAt(0).toUpperCase()+e.slice(1)},f=(...r)=>r.filter((e,t,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===t).join(" ").trim(),N=r=>{for(const e in r)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var A={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=s.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:o,className:n="",children:a,iconNode:g,...i},w)=>s.createElement("svg",{ref:w,...A,width:e,height:e,stroke:r,strokeWidth:o?Number(t)*24/Number(e):t,className:f("lucide",n),...!a&&!N(i)&&{"aria-hidden":"true"},...i},[...g.map(([y,k])=>s.createElement(y,k)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=(r,e)=>{const t=s.forwardRef(({className:o,...n},a)=>s.createElement(j,{ref:a,iconNode:e,className:f(`lucide-${v(d(r))}`,`lucide-${r}`,o),...n}));return t.displayName=d(r),t};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],_=x("arrow-right",I);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],R=x("sparkles",B),z=[["primary","secondary","accent","muted"],["constructive","cautionary","destructive"],["chart-1","chart-2","chart-3","chart-4","chart-5"]],S={title:"Atoms/Button",component:h,tags:["autodocs"],args:{animation:"default",size:"default",color:"chart-1"},argTypes:{animation:{control:"select",options:["default","active"]},color:{control:"select",options:C},size:{control:"select",options:["default","sm","lg","icon","icon-sm","icon-lg"]}}},l={render:r=>c.jsx("div",{className:"w-full max-w-5xl rounded-xl border border-(--border) bg-(--card) p-4",children:c.jsx("div",{className:"flex flex-col gap-3",children:z.map((e,t)=>c.jsx("div",{className:"flex flex-wrap gap-3",children:e.map(o=>s.createElement(h,{...r,color:o,key:o,leftIcon:c.jsx(R,{className:"size-4"}),rightIcon:c.jsx(_,{className:"size-4"})},o))},t))})})};var m,p,u;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => <div className="w-full max-w-5xl rounded-xl border border-(--border) bg-(--card) p-4">
      <div className="flex flex-col gap-3">
        {buttonColorRows.map((row, rowIndex) => <div className="flex flex-wrap gap-3" key={rowIndex}>
            {row.map(color => <Button {...args} color={color} key={color} leftIcon={<Sparkles className="size-4" />} rightIcon={<ArrowRight className="size-4" />}>
                {color}
              </Button>)}
          </div>)}
      </div>
    </div>
}`,...(u=(p=l.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};const T=["AllColors"];export{l as AllColors,T as __namedExportsOrder,S as default};
