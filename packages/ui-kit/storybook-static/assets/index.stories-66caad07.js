import{j as d}from"./jsx-runtime-9bc08dc0.js";import{r as p}from"./index-0b625b07.js";import{C as a}from"./index-5f96d35f.js";import"./utils-0998f52b.js";import"./chevron-left-c761184d.js";import"./createLucideIcon-00f6dee4.js";import"./chevron-right-3e52afdc.js";const h={title:"Atoms/Calendar",component:a,tags:["autodocs"],args:{isLoading:!1},argTypes:{isLoading:{control:"boolean",description:"Включает loading-режим календаря."}},parameters:{layout:"centered"}},r={render:e=>{const[o,s]=p.useState(new Date),n=e.isLoading?void 0:o;return d.jsx("div",{className:"rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm",children:d.jsx(a,{...e,mode:"single",selected:n,onSelect:s})})}},t={render:e=>{const[o,s]=p.useState({from:new Date,to:new Date(Date.now()+3456e5)}),n=e.isLoading?void 0:o;return d.jsx("div",{className:"rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm",children:d.jsx(a,{...e,mode:"range",selected:n,onSelect:s,numberOfMonths:2})})}};var c,l,i;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: args => {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    const resolvedSelected = args.isLoading ? undefined : selected;
    return <div className="rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm">
        <Calendar {...args} mode="single" selected={resolvedSelected} onSelect={setSelected} />
      </div>;
  }
}`,...(i=(l=r.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};var m,g,u;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => {
    const [selected, setSelected] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    });
    const resolvedSelected = args.isLoading ? undefined : selected;
    return <div className="rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm">
        <Calendar {...args} mode="range" selected={resolvedSelected} onSelect={setSelected} numberOfMonths={2} />
      </div>;
  }
}`,...(u=(g=t.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const j=["SingleDate","Range"];export{t as Range,r as SingleDate,j as __namedExportsOrder,h as default};
