import{j as e}from"./jsx-runtime-9bc08dc0.js";import{P as r}from"./index-95800dec.js";import"./index.es-0af5970b.js";import"./index-0b625b07.js";import"./index-68fbcb4b.js";const m={title:"Atoms/Paper",component:r,tags:["autodocs"],render:s=>e.jsx("div",{className:"w-[520px] rounded-[var(--radius)] border border-(--border) bg-(--background) p-6",children:e.jsx(r,{...s})}),args:{className:"max-w-xl",type:"dark",isColored:!1,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Paper Header"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Flat reusable surface with light/dark mode and optional colored overlay."})]})},argTypes:{type:{control:"select",options:["dark","light"]},isColored:{control:"boolean"}}},a={render:s=>e.jsxs("div",{className:"grid w-[860px] grid-cols-3 gap-4 rounded-[var(--radius)] border border-(--border) bg-(--background) p-6",children:[e.jsx(r,{...s,type:"dark",isColored:!1,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Flat Dark"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:'type="dark", isColored=false'})]})}),e.jsx(r,{...s,type:"light",isColored:!1,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Flat Light"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:'type="light", isColored=false'})]})}),e.jsx(r,{...s,isColored:!0,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Colored"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"isColored=true"})]})})]})};var o,t,d;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: args => <div className="grid w-[860px] grid-cols-3 gap-4 rounded-[var(--radius)] border border-(--border) bg-(--background) p-6">
      <Paper {...args} type="dark" isColored={false}>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Flat Dark</p>
          <p className="text-sm text-muted-foreground">type=&quot;dark&quot;, isColored=false</p>
        </div>
      </Paper>
      <Paper {...args} type="light" isColored={false}>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Flat Light</p>
          <p className="text-sm text-muted-foreground">type=&quot;light&quot;, isColored=false</p>
        </div>
      </Paper>
      <Paper {...args} isColored>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Colored</p>
          <p className="text-sm text-muted-foreground">isColored=true</p>
        </div>
      </Paper>
    </div>
}`,...(d=(t=a.parameters)==null?void 0:t.docs)==null?void 0:d.source}}};const x=["AllVariations"];export{a as AllVariations,x as __namedExportsOrder,m as default};
