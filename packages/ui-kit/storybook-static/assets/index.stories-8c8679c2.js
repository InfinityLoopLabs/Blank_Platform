import{j as e}from"./jsx-runtime-9bc08dc0.js";import{B as S}from"./breadcrumbs-3d36bebd.js";import{P as j}from"./index-7638d0dd.js";import"./index-0b625b07.js";import"./utils-0998f52b.js";import"./createLucideIcon-00f6dee4.js";import"./index.es-0af5970b.js";import"./index-68fbcb4b.js";const m=({to:t,children:C})=>e.jsx("a",{href:t,children:C}),I=[{label:"Home",href:"#"},{label:"Catalog",href:"#"},{label:"Sneakers",href:"#"},{label:"Air Max 90"}],k=[e.jsx(m,{to:"/",children:"Home"},"home"),{component:e.jsx(m,{to:"/catalog",children:"Catalog"})},{component:e.jsx(m,{to:"/catalog/sneakers",children:"Sneakers"})},{label:"Air Max 90"}],y=[{label:"Home",href:"#"},{label:"Categories",href:"#"},{label:"Shoes",href:"#"},{label:"Running",href:"#"},{label:"Nike",href:"#"},{label:"Air Max 90"}],_={title:"Atoms/Breadcrumbs",component:S,tags:["autodocs"],decorators:[t=>e.jsx(j,{type:"dark",className:"w-[520px] p-6",children:e.jsx(t,{})})],args:{items:I},argTypes:{items:{table:{disable:!0}},maxItems:{control:{type:"number",min:2,max:10,step:1}},separator:{control:"text"}}},r={},s={args:{items:y,maxItems:3}},a={args:{separator:"/"}},o={args:{items:k}};var n,c,l;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:"{}",...(l=(c=r.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var p,i,d;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    items: longItems,
    maxItems: 3
  }
}`,...(d=(i=s.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var u,g,x;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    separator: '/'
  }
}`,...(x=(g=a.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var b,h,f;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    items: customComponentItems
  }
}`,...(f=(h=o.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};const w=["Playground","Collapsed","CustomSeparator","CustomComponents"];export{s as Collapsed,o as CustomComponents,a as CustomSeparator,r as Playground,w as __namedExportsOrder,_ as default};
