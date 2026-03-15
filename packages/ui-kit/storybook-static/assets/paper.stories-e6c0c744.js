import{j as e}from"./jsx-runtime-9bc08dc0.js";import{K as o}from"./index.es-0af5970b.js";import"./index-0b625b07.js";import"./index-68fbcb4b.js";const g={light:"bg-(--card)",dark:"bg-(--background)"},b="div",s=({as:r,type:n="dark",className:i,children:c,isColored:p,...m})=>{const u=r||b,x=p?"flat-paper--colored border border-(--shani-ember-dim) rounded-sm transition-colors":o("border-(--border)",g[n]);return e.jsx(u,{className:o("rounded-(--radius) border px-6 py-4 ",x,i),...m,children:c})};s.__docgenInfo={description:"",methods:[],displayName:"Paper",props:{type:{defaultValue:{value:"'dark'",computed:!1},required:!1}}};const v={title:"Atoms/Paper",component:s,tags:["autodocs"],render:r=>e.jsx("div",{className:"w-[520px] rounded-[var(--radius)] border border-(--border) bg-(--background) p-6",children:e.jsx(s,{...r})}),args:{className:"max-w-xl",type:"dark",isColored:!1,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Paper Header"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Flat reusable surface with light/dark mode and optional colored overlay."})]})},argTypes:{type:{control:"select",options:["dark","light"]},isColored:{control:"boolean"}}},a={render:r=>e.jsxs("div",{className:"grid w-[860px] grid-cols-3 gap-4 rounded-[var(--radius)] border border-(--border) bg-(--background) p-6",children:[e.jsx(s,{...r,type:"dark",isColored:!1,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Flat Dark"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:'type="dark", isColored=false'})]})}),e.jsx(s,{...r,type:"light",isColored:!1,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Flat Light"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:'type="light", isColored=false'})]})}),e.jsx(s,{...r,isColored:!0,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Colored"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"isColored=true"})]})})]})};var d,t,l;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(l=(t=a.parameters)==null?void 0:t.docs)==null?void 0:l.source}}};const C=["AllVariations"];export{a as AllVariations,C as __namedExportsOrder,v as default};
