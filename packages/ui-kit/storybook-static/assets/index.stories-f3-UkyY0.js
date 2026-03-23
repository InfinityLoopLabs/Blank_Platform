import{j as o,r as n}from"./iframe-EEWUujUr.js";import{B as p,a as x,b as s}from"./index-BbmR5OoP.js";import"./preload-helper-C1FmrZbK.js";import"./index.es-Ck4uLIAB.js";import"./index-CQrq4_CI.js";const c=[["primary","secondary","accent","muted"],["constructive","cautionary","destructive"],["chart-1","chart-2","chart-3","chart-4","chart-5"]],N={title:"Atoms/Button",component:s,tags:["autodocs"],args:{animation:"default",isLoading:!1,size:"m",variant:"filled",color:"chart-1"},argTypes:{animation:{control:"select",options:["default","active"]},isLoading:{control:"boolean"},color:{control:"select",options:x},variant:{control:"select",options:p},size:{control:"select",options:["s","m","l","icon-s","icon-m","icon-l","icon-circle"]}}},r={render:l=>o.jsx("div",{className:"w-full max-w-5xl rounded-xl border border-(--border) bg-(--card) p-4",children:o.jsxs("div",{className:"flex flex-col gap-6",children:[o.jsxs("div",{className:"space-y-3",children:[o.jsx("p",{className:"text-sm font-semibold uppercase tracking-wide text-muted-foreground",children:"Filled"}),c.map((t,a)=>o.jsx("div",{className:"flex flex-wrap gap-3",children:t.map(e=>n.createElement(s,{...l,variant:"filled",color:e,key:`filled-${e}`},e))},`filled-${a}`))]}),o.jsxs("div",{className:"space-y-3",children:[o.jsx("p",{className:"text-sm font-semibold uppercase tracking-wide text-muted-foreground",children:"Outline"}),c.map((t,a)=>o.jsx("div",{className:"flex flex-wrap gap-3",children:t.map(e=>n.createElement(s,{...l,variant:"outline",color:e,key:`outline-${e}`},e))},`outline-${a}`))]}),o.jsxs("div",{className:"space-y-3",children:[o.jsx("p",{className:"text-sm font-semibold uppercase tracking-wide text-muted-foreground",children:"Text"}),c.map((t,a)=>o.jsx("div",{className:"flex flex-wrap gap-3",children:t.map(e=>n.createElement(s,{...l,variant:"text",color:e,key:`text-${e}`},e))},`text-${a}`))]})]})})};var i,d,m;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(m=(d=r.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const b=["AllColors"];export{r as AllColors,b as __namedExportsOrder,N as default};
