import{j as t}from"./jsx-runtime-9bc08dc0.js";import{P as b}from"./index-95800dec.js";import{T as w,b as I}from"./index-3666adec.js";import{r as u}from"./index-0b625b07.js";import{K as S}from"./index.es-0af5970b.js";import{I as j}from"./index-456b9be1.js";import"./index-68fbcb4b.js";import"./utils-0998f52b.js";const f=a=>a==null?"":Array.isArray(a)?a.join(", "):String(a),R=({className:a,typography:c="Subheader",element:h="span",isEditModeDisabled:n=!1,inputProps:e,children:H})=>{const[d,o]=u.useState(!1),[M,s]=u.useState(()=>f(e==null?void 0:e.defaultValue)),T=(e==null?void 0:e.typography)??c,m=(e==null?void 0:e.value)!==void 0,g=m?f(e==null?void 0:e.value):M;u.useEffect(()=>{n&&d&&o(!1)},[n,d]);const x=()=>{n||o(!0)},E=l=>{var r;m||s(l.currentTarget.value),(r=e==null?void 0:e.onBlur)==null||r.call(e,l),o(!1)},V=l=>{var r;(r=e==null?void 0:e.onKeyDown)==null||r.call(e,l),!(l.defaultPrevented||e!=null&&e.isTextarea)&&(l.key==="Enter"||l.key==="Escape")&&(m||s(l.currentTarget.value),o(!1),l.currentTarget.blur())};return d&&!n?t.jsx("div",{className:S("w-full",a),children:t.jsx(j,{...e,autoFocus:!0,variant:"text",typography:T,...m?{}:{defaultValue:g},onBlur:E,onKeyDown:V})}):t.jsx(w,{typography:c,element:h,className:S("block w-full cursor-text py-0",!n&&"hover:opacity-90",a),onClick:x,children:g||H||(e==null?void 0:e.placeholder)||"Click to edit"})};R.__docgenInfo={description:"",methods:[],displayName:"EditableTypography",props:{className:{required:!1,tsType:{name:"string"},description:""},typography:{required:!1,tsType:{name:"union",raw:`| 'H1SemiBold' // 24 / 140% / 600
| 'H2SemiBold' // 20 / 140% / 600
| 'H3Medium' // 18 / 148% / 500
| 'H3SemiBold' // 18 / 148% / 600
| 'H4SemiBold' // 16 / 148% / 600
| 'MRegular' // 16 / 148% / 400
| 'MMedium' // 16 / 148% / 500
| 'MSemiBold' // 16 / 148% / 600
| 'SRegular' // 14 / 148% / 400
| 'SMedium' // 14 / 148% / 500
| 'SSemiBold' // 14 / 148% / 600
| 'XSMedium' // 12 / 130% / 500
| 'MonoMRegular' // mono 16 / 140% / 400
| 'MonoSRegular' // mono 14 / 140% / 400
/*  */
| 'Heading32'
| 'Heading24'
| 'Heading20'
| 'Heading16'
| 'Heading14'
| 'Heading12'
| 'SemiBold52'
| 'SemiBold48'
| 'SemiBold40'
| 'SemiBold32'
| 'SemiBold24'
| 'SemiBold20'
| 'SemiBold16'
| 'SemiBold14'
| 'Regular24'
| 'Regular20'
| 'Regular16'
| 'Regular14'
| 'Regular12'
| 'Mono16'
| 'Action'
| 'Subheader'
| 'Caption'`,elements:[{name:"literal",value:"'H1SemiBold'"},{name:"literal",value:"'H2SemiBold'"},{name:"literal",value:"'H3Medium'"},{name:"literal",value:"'H3SemiBold'"},{name:"literal",value:"'H4SemiBold'"},{name:"literal",value:"'MRegular'"},{name:"literal",value:"'MMedium'"},{name:"literal",value:"'MSemiBold'"},{name:"literal",value:"'SRegular'"},{name:"literal",value:"'SMedium'"},{name:"literal",value:"'SSemiBold'"},{name:"literal",value:"'XSMedium'"},{name:"literal",value:"'MonoMRegular'"},{name:"literal",value:"'MonoSRegular'"},{name:"literal",value:"'Heading32'"},{name:"literal",value:"'Heading24'"},{name:"literal",value:"'Heading20'"},{name:"literal",value:"'Heading16'"},{name:"literal",value:"'Heading14'"},{name:"literal",value:"'Heading12'"},{name:"literal",value:"'SemiBold52'"},{name:"literal",value:"'SemiBold48'"},{name:"literal",value:"'SemiBold40'"},{name:"literal",value:"'SemiBold32'"},{name:"literal",value:"'SemiBold24'"},{name:"literal",value:"'SemiBold20'"},{name:"literal",value:"'SemiBold16'"},{name:"literal",value:"'SemiBold14'"},{name:"literal",value:"'Regular24'"},{name:"literal",value:"'Regular20'"},{name:"literal",value:"'Regular16'"},{name:"literal",value:"'Regular14'"},{name:"literal",value:"'Regular12'"},{name:"literal",value:"'Mono16'"},{name:"literal",value:"'Action'"},{name:"literal",value:"'Subheader'"},{name:"literal",value:"'Caption'"}]},description:"",defaultValue:{value:"'Subheader'",computed:!1}},element:{required:!1,tsType:{name:"ElementType"},description:"",defaultValue:{value:"'span'",computed:!1}},isEditModeDisabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},inputProps:{required:!1,tsType:{name:"ReactComponentProps",raw:"React.ComponentProps<typeof Input>",elements:[{name:"Input"}]},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const X={title:"Molecules/EditableTypography",component:R,tags:["autodocs"],decorators:[a=>t.jsx(b,{type:"dark",className:"w-[520px] p-6",children:t.jsx(a,{})})],args:{typography:"Heading16",element:"p",isEditModeDisabled:!1,inputProps:{defaultValue:"Click this text to edit",placeholder:"Type value..."}},argTypes:{typography:{control:"select",options:I},element:{control:"text"},inputProps:{control:!1}}},i={};var v,y,B;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:"{}",...(B=(y=i.parameters)==null?void 0:y.docs)==null?void 0:B.source}}};const Y=["Playground"];export{i as Playground,Y as __namedExportsOrder,X as default};
