import{j as t}from"./jsx-runtime-9bc08dc0.js";import{P as d}from"./index-7638d0dd.js";import{T as i,b as u}from"./index-0309eb31.js";import{E as n}from"./index-45397552.js";import"./index.es-0af5970b.js";import"./index-0b625b07.js";import"./index-68fbcb4b.js";const{useArgs:m}=__STORYBOOK_MODULE_PREVIEW_API__,g=["span","p","div","h1","h2","h3","h4"],v={title:"Molecules/EditableTypography",component:n,tags:["autodocs"],decorators:[o=>t.jsx(d,{type:"dark",className:"w-[520px] p-6",children:t.jsx(o,{})})],args:{typography:"Subheader",element:"p",value:"Click this text to edit",placeholder:"Type value...",isEditModeDisabled:!1,isLoading:!1},argTypes:{typography:{control:"select",options:i},color:{control:"select",options:u},element:{control:"select",options:g},value:{control:"text"},placeholder:{control:"text"},isLoading:{control:"boolean"}}},e={render:o=>{const[{value:l},p]=m();return t.jsx(n,{...o,value:l,onValueChange:c=>p({value:c})})}};var a,r,s;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: args => {
    const [{
      value
    }, updateArgs] = useArgs();
    return <EditableTypography {...args} value={value} onValueChange={nextValue => updateArgs({
      value: nextValue
    })} />;
  }
}`,...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const E=["Playground"];export{e as Playground,E as __namedExportsOrder,v as default};
