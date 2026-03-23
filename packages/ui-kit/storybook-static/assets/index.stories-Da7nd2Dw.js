import{r as p,j as t}from"./iframe-EEWUujUr.js";import{C as a}from"./index-CPbt8dfY.js";import"./preload-helper-C1FmrZbK.js";import"./chevron-left-7sB2-fEY.js";import"./chevron-right-DwMaQSlY.js";const w={title:"Atoms/Calendar",component:a,tags:["autodocs"],args:{isLoading:!1},argTypes:{isLoading:{control:"boolean",description:"Включает loading-режим календаря."}},parameters:{layout:"centered"}},r={render:e=>{const[o,s]=p.useState(new Date),n=e.isLoading?void 0:o;return t.jsx("div",{className:"rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm",children:t.jsx(a,{...e,mode:"single",selected:n,onSelect:s})})}},d={render:e=>{const[o,s]=p.useState({from:new Date,to:new Date(Date.now()+3456e5)}),n=e.isLoading?void 0:o;return t.jsx("div",{className:"rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm",children:t.jsx(a,{...e,mode:"range",selected:n,onSelect:s,numberOfMonths:2})})}};var c,l,i;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: args => {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    const resolvedSelected = args.isLoading ? undefined : selected;
    return <div className="rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm">
        <Calendar {...args} mode="single" selected={resolvedSelected} onSelect={setSelected} />
      </div>;
  }
}`,...(i=(l=r.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};var m,g,u;d.parameters={...d.parameters,docs:{...(m=d.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(u=(g=d.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const D=["SingleDate","Range"];export{d as Range,r as SingleDate,D as __namedExportsOrder,w as default};
