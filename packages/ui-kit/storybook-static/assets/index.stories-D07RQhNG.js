import{j as t}from"./iframe-EEWUujUr.js";import{P as d}from"./index-Bh0QwztN.js";import{T as u,c as i}from"./index-CQrq4_CI.js";import{E as n}from"./index-Bm85qUxl.js";import"./preload-helper-C1FmrZbK.js";import"./index.es-Ck4uLIAB.js";const{useArgs:g}=__STORYBOOK_MODULE_PREVIEW_API__,m=["span","p","div","h1","h2","h3","h4"],T={title:"Molecules/EditableTypography",component:n,tags:["autodocs"],decorators:[o=>t.jsx(d,{type:"dark",className:"w-[520px] p-6",children:t.jsx(o,{})})],args:{typography:"Subheader",element:"p",value:"Click this text to edit",placeholder:"Type value...",isEditModeDisabled:!1,isLoading:!1},argTypes:{typography:{control:"select",options:i},color:{control:"select",options:u},element:{control:"select",options:m},value:{control:"text"},placeholder:{control:"text"},isLoading:{control:"boolean"}}},e={render:o=>{const[{value:l},p]=g();return t.jsx(n,{...o,value:l,onValueChange:c=>p({value:c})})}};var a,r,s;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: args => {
    const [{
      value
    }, updateArgs] = useArgs();
    return <EditableTypography {...args} value={value} onValueChange={nextValue => updateArgs({
      value: nextValue
    })} />;
  }
}`,...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const v=["Playground"];export{e as Playground,v as __namedExportsOrder,T as default};
