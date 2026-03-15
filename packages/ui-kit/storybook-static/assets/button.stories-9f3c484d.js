import{j as o}from"./jsx-runtime-9bc08dc0.js";import{r as m}from"./index-0b625b07.js";import{c,B as l,a as p}from"./index-5733ff7d.js";import"./index.es-0af5970b.js";import"./index-68fbcb4b.js";import"./index-bb71b0ad.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],u=c("arrow-right",x);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],f=c("sparkles",h),g=[["primary","secondary","accent","muted"],["constructive","cautionary","destructive"],["chart-1","chart-2","chart-3","chart-4","chart-5"]],j={title:"Atoms/Button",component:l,tags:["autodocs"],args:{animation:"default",size:"default",color:"chart-1"},argTypes:{animation:{control:"select",options:["default","active"]},color:{control:"select",options:p},size:{control:"select",options:["default","sm","lg","icon","icon-sm","icon-lg"]}}},r={render:n=>o.jsx("div",{className:"w-full max-w-5xl rounded-xl border border-(--border) bg-(--card) p-4",children:o.jsx("div",{className:"flex flex-col gap-3",children:g.map((i,d)=>o.jsx("div",{className:"flex flex-wrap gap-3",children:i.map(e=>m.createElement(l,{...n,color:e,key:e,leftIcon:o.jsx(f,{className:"size-4"}),rightIcon:o.jsx(u,{className:"size-4"})},e))},d))})})};var a,t,s;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: args => <div className="w-full max-w-5xl rounded-xl border border-(--border) bg-(--card) p-4">
      <div className="flex flex-col gap-3">
        {buttonColorRows.map((row, rowIndex) => <div className="flex flex-wrap gap-3" key={rowIndex}>
            {row.map(color => <Button {...args} color={color} key={color} leftIcon={<Sparkles className="size-4" />} rightIcon={<ArrowRight className="size-4" />}>
                {color}
              </Button>)}
          </div>)}
      </div>
    </div>
}`,...(s=(t=r.parameters)==null?void 0:t.docs)==null?void 0:s.source}}};const z=["AllColors"];export{r as AllColors,z as __namedExportsOrder,j as default};
