import{j as o}from"./jsx-runtime-9bc08dc0.js";import{P as b}from"./index-95800dec.js";import{T as s}from"./index-3666adec.js";import"./index.es-0af5970b.js";import"./index-0b625b07.js";import"./index-68fbcb4b.js";const T=[{label:"Action",type:"Action",sample:"Infinity Loop Launch Control",usage:"Использовать для action-текста: кнопки, компактные интерактивные элементы."},{label:"Subheader",type:"Subheader",sample:"Infinity Loop subheader and helper copy",usage:"Использовать для supporting-контента: subheader, placeholder, helper text."},{label:"Caption",type:"Caption",sample:"Infinity Loop photo caption",usage:"Использовать для подписей: caption, tagline, label над контентом."}];function x(){return o.jsx("div",{className:"w-[640px] max-w-full space-y-3",children:T.map(e=>o.jsxs(b,{type:"dark",className:"space-y-2",children:[o.jsx(s,{typography:"Caption",element:"p",children:e.label}),o.jsx(s,{typography:e.type,children:e.sample}),o.jsx("p",{className:"text-sm text-muted-foreground",children:e.usage})]},e.type))})}const N={title:"Design/Typography",component:s,tags:["autodocs"]},r={args:{typography:"Action"},render:()=>o.jsx(x,{})},p={args:{typography:"Action",children:"Infinity Loop Launch Control"},parameters:{docs:{source:{code:'<Typography typography="Action">Infinity Loop Launch Control</Typography>'}}}},a={args:{typography:"Subheader",children:"Infinity Loop subheader and helper copy"},parameters:{docs:{source:{code:'<Typography typography="Subheader">Infinity Loop subheader and helper copy</Typography>'}}}},t={args:{typography:"Caption",children:"Infinity Loop photo caption"},parameters:{docs:{source:{code:'<Typography typography="Caption">Infinity Loop photo caption</Typography>'}}}};var n,c,y;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    typography: 'Action'
  },
  render: () => <TypographyShowcase />
}`,...(y=(c=r.parameters)==null?void 0:c.docs)==null?void 0:y.source}}};var i,h,d;p.parameters={...p.parameters,docs:{...(i=p.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    typography: 'Action',
    children: 'Infinity Loop Launch Control'
  },
  parameters: {
    docs: {
      source: {
        code: '<Typography typography="Action">Infinity Loop Launch Control</Typography>'
      }
    }
  }
}`,...(d=(h=p.parameters)==null?void 0:h.docs)==null?void 0:d.source}}};var g,u,l;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    typography: 'Subheader',
    children: 'Infinity Loop subheader and helper copy'
  },
  parameters: {
    docs: {
      source: {
        code: '<Typography typography="Subheader">Infinity Loop subheader and helper copy</Typography>'
      }
    }
  }
}`,...(l=(u=a.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var m,f,L;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    typography: 'Caption',
    children: 'Infinity Loop photo caption'
  },
  parameters: {
    docs: {
      source: {
        code: '<Typography typography="Caption">Infinity Loop photo caption</Typography>'
      }
    }
  }
}`,...(L=(f=t.parameters)==null?void 0:f.docs)==null?void 0:L.source}}};const E=["Guide","Action","Subheader","Caption"];export{p as Action,t as Caption,r as Guide,a as Subheader,E as __namedExportsOrder,N as default};
