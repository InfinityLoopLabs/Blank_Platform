import{j as t}from"./jsx-runtime-9bc08dc0.js";import{r as n}from"./index-0b625b07.js";import{B as s,a as p,b as x}from"./index-6a105713.js";import"./index.es-0af5970b.js";import"./index-68fbcb4b.js";import"./index-7f113b69.js";const c=[["primary","secondary","accent","muted"],["constructive","cautionary","destructive"],["chart-1","chart-2","chart-3","chart-4","chart-5"]],b={title:"Atoms/Button",component:s,tags:["autodocs"],args:{animation:"default",size:"default",variant:"filled",color:"chart-1"},argTypes:{animation:{control:"select",options:["default","active"]},color:{control:"select",options:p},variant:{control:"select",options:x},size:{control:"select",options:["default","sm","lg","icon","icon-sm","icon-lg"]}}},r={render:l=>t.jsx("div",{className:"w-full max-w-5xl rounded-xl border border-(--border) bg-(--card) p-4",children:t.jsxs("div",{className:"flex flex-col gap-6",children:[t.jsxs("div",{className:"space-y-3",children:[t.jsx("p",{className:"text-sm font-semibold uppercase tracking-wide text-muted-foreground",children:"Filled"}),c.map((a,o)=>t.jsx("div",{className:"flex flex-wrap gap-3",children:a.map(e=>n.createElement(s,{...l,variant:"filled",color:e,key:`filled-${e}`},e))},`filled-${o}`))]}),t.jsxs("div",{className:"space-y-3",children:[t.jsx("p",{className:"text-sm font-semibold uppercase tracking-wide text-muted-foreground",children:"Outline"}),c.map((a,o)=>t.jsx("div",{className:"flex flex-wrap gap-3",children:a.map(e=>n.createElement(s,{...l,variant:"outline",color:e,key:`outline-${e}`},e))},`outline-${o}`))]}),t.jsxs("div",{className:"space-y-3",children:[t.jsx("p",{className:"text-sm font-semibold uppercase tracking-wide text-muted-foreground",children:"Text"}),c.map((a,o)=>t.jsx("div",{className:"flex flex-wrap gap-3",children:a.map(e=>n.createElement(s,{...l,variant:"text",color:e,key:`text-${e}`},e))},`text-${o}`))]})]})})};var i,d,m;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: args => <div className="w-full max-w-5xl rounded-xl border border-(--border) bg-(--card) p-4">
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Filled</p>
          {buttonColorRows.map((row, rowIndex) => <div className="flex flex-wrap gap-3" key={\`filled-\${rowIndex}\`}>
              {row.map(color => <Button {...args} variant="filled" color={color} key={\`filled-\${color}\`}>
                  {color}
                </Button>)}
            </div>)}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Outline</p>
          {buttonColorRows.map((row, rowIndex) => <div className="flex flex-wrap gap-3" key={\`outline-\${rowIndex}\`}>
              {row.map(color => <Button {...args} variant="outline" color={color} key={\`outline-\${color}\`}>
                  {color}
                </Button>)}
            </div>)}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Text</p>
          {buttonColorRows.map((row, rowIndex) => <div className="flex flex-wrap gap-3" key={\`text-\${rowIndex}\`}>
              {row.map(color => <Button {...args} variant="text" color={color} key={\`text-\${color}\`}>
                  {color}
                </Button>)}
            </div>)}
        </div>
      </div>
    </div>
}`,...(m=(d=r.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const y=["AllColors"];export{r as AllColors,y as __namedExportsOrder,b as default};
