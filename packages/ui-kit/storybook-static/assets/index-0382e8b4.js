import{j as e}from"./jsx-runtime-9bc08dc0.js";import{r as a}from"./index-0b625b07.js";import{a as J}from"./index-e77e949e.js";import{P as Q}from"./index-7638d0dd.js";import{T as j}from"./index-1d2dca81.js";import{a as b}from"./index-0309eb31.js";import{E as v}from"./index-45397552.js";import{c as l}from"./utils-0998f52b.js";const n=o=>typeof o=="string"||typeof o=="number"?String(o):"",Z=({className:o,isSetModeEnabled:E=!1,setModelEnabled:M,isEditModeForcedDisabled:k=!1,isLoading:r=!1,coverImageSrc:u,coverImageAlt:L="Video slide cover image",isImageLoading:O,imageProps:D,imageAccept:H="image/*",onImageChange:m,brandName:d,brandIcon:T,heading:c,viewsText:p,tagText:U="NEW",tagType:A="default",durationText:B="2:13",...F})=>{const t=(E||!!M)&&!k&&!r,{isEditModeDisabled:_,isLoading:W,...z}=D??{},f=r||O||W||!1,Y=k||(_??!t),h=a.useRef(null),i=a.useRef(null),[X,x]=a.useState(u),[q,V]=a.useState(()=>n(d)),[N,R]=a.useState(()=>n(c)),[S,C]=a.useState(()=>n(p??"")),w=n(U??""),I=n(B??"");a.useEffect(()=>{x(u)},[u]),a.useEffect(()=>{V(n(d))},[d]),a.useEffect(()=>{R(n(c))},[c]),a.useEffect(()=>{C(n(p??""))},[p]),a.useEffect(()=>()=>{i.current&&URL.revokeObjectURL(i.current)},[]);const G=()=>{var s;f||(s=h.current)==null||s.click()},K=s=>{var P;const g=(P=s.currentTarget.files)==null?void 0:P[0];if(!g)return;i.current&&URL.revokeObjectURL(i.current);const y=URL.createObjectURL(g);i.current=y,x(y),m==null||m({file:g,objectUrl:y}),s.currentTarget.value=""};return e.jsxs(Q,{as:"article",type:"gradient",isRoundedCornersDisabled:!0,className:l("group relative flex h-[430px] w-full flex-col gap-3 border-0 p-3",o),...F,children:[e.jsxs("div",{className:"relative h-[240px] w-full overflow-hidden rounded-lg",children:[e.jsx(J,{alt:L,src:X,isLoading:f,isEditModeDisabled:Y,className:l("h-full w-full","[&>img]:transition-transform [&>img]:duration-500 group-hover:[&>img]:scale-[1.02]"),...z}),w?e.jsx(j,{label:w,type:A,className:"absolute top-2 left-2",isLoading:r}):null,I?e.jsx(j,{label:I,type:"time",className:"absolute right-2 bottom-2",isLoading:r}):null,t?e.jsxs(e.Fragment,{children:[e.jsx("input",{ref:h,type:"file",accept:H,className:"hidden",onChange:K}),e.jsx("button",{type:"button",onClick:G,disabled:f,className:l("absolute top-2 right-2 rounded-md bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur","disabled:cursor-not-allowed disabled:opacity-60","transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--chart-1)/50"),children:"Upload image"})]}):null]}),e.jsxs("div",{className:"flex flex-1 flex-col gap-2 px-1",children:[e.jsxs("div",{className:"flex min-h-[28px] items-center gap-2",children:[T?e.jsx("span",{className:"inline-flex size-5 items-center justify-center overflow-hidden rounded-sm",children:T}):null,t?e.jsx(v,{value:q,onValueChange:V,typography:"Action",isEditModeDisabled:!t,isLoading:r,className:"!h-auto"}):e.jsx(b,{typography:"Action",element:"p",isLoading:r,className:"font-semibold uppercase tracking-wide",children:q})]}),t?e.jsx(v,{value:N,onValueChange:R,typography:"SectionHeader",isEditModeDisabled:!t,isLoading:r,className:"!h-auto min-h-[78px]"}):e.jsx(b,{typography:"SectionHeader",element:"h3",isLoading:r,className:l("min-h-[78px] leading-[1.15]","overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"),children:N}),t?e.jsx(v,{value:S,onValueChange:C,placeholder:"Views text",typography:"BodySmall",isEditModeDisabled:!t,isLoading:r,className:"!h-auto"}):e.jsx(b,{typography:"BodySmall",element:"p",isLoading:r,color:"muted-foreground",className:"mt-auto",children:S})]})]})};Z.__docgenInfo={description:"",methods:[],displayName:"VideoSlide",props:{isSetModeEnabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},setModelEnabled:{required:!1,tsType:{name:"boolean"},description:""},isEditModeForcedDisabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},coverImageSrc:{required:!0,tsType:{name:"string"},description:""},coverImageAlt:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Video slide cover image'",computed:!1}},isImageLoading:{required:!1,tsType:{name:"boolean"},description:""},imageProps:{required:!1,tsType:{name:"Omit",elements:[{name:"intersection",raw:`Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'className'
> & {
  className?: string
  isLoading?: boolean
  maskType?: ImageMaskType
  isEditModeDisabled?: boolean
  imagePosition?: string
  isSquareCrop?: boolean
  cropX?: number
  cropY?: number
  cropPositionValue?: ImageCropPositionValueType
  defaultCropPositionValue?: ImageCropPositionValueType
  onCropPositionChange?: (value: ImageCropPositionValueType) => void
  maskSize?: string
  maskPositionValue?: ImageMaskPositionValueType
  maskFillColor?: string
  maskStrokeColor?: string
  maskStrokeWidth?: number
  isTopShadeVisible?: boolean
  topShadeColor?: string
  isBottomShadeVisible?: boolean
  bottomShadeColor?: string
}`,elements:[{name:"Omit",elements:[{name:"ReactImgHTMLAttributes",raw:"React.ImgHTMLAttributes<HTMLImageElement>",elements:[{name:"HTMLImageElement"}]},{name:"literal",value:"'className'"}],raw:`Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'className'
>`},{name:"signature",type:"object",raw:`{
  className?: string
  isLoading?: boolean
  maskType?: ImageMaskType
  isEditModeDisabled?: boolean
  imagePosition?: string
  isSquareCrop?: boolean
  cropX?: number
  cropY?: number
  cropPositionValue?: ImageCropPositionValueType
  defaultCropPositionValue?: ImageCropPositionValueType
  onCropPositionChange?: (value: ImageCropPositionValueType) => void
  maskSize?: string
  maskPositionValue?: ImageMaskPositionValueType
  maskFillColor?: string
  maskStrokeColor?: string
  maskStrokeWidth?: number
  isTopShadeVisible?: boolean
  topShadeColor?: string
  isBottomShadeVisible?: boolean
  bottomShadeColor?: string
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"isLoading",value:{name:"boolean",required:!1}},{key:"maskType",value:{name:"unknown[number]['value']",raw:"(typeof IMAGE_MASK_OPTIONS)[number]['value']",required:!1}},{key:"isEditModeDisabled",value:{name:"boolean",required:!1}},{key:"imagePosition",value:{name:"string",required:!1}},{key:"isSquareCrop",value:{name:"boolean",required:!1}},{key:"cropX",value:{name:"number",required:!1}},{key:"cropY",value:{name:"number",required:!1}},{key:"cropPositionValue",value:{name:"signature",type:"object",raw:`{
  x: number
  y: number
}`,signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}}]},required:!1}},{key:"defaultCropPositionValue",value:{name:"signature",type:"object",raw:`{
  x: number
  y: number
}`,signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}}]},required:!1}},{key:"onCropPositionChange",value:{name:"signature",type:"function",raw:"(value: ImageCropPositionValueType) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  x: number
  y: number
}`,signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}}]},required:!1},name:"value"}],return:{name:"void"}},required:!1}},{key:"maskSize",value:{name:"string",required:!1}},{key:"maskPositionValue",value:{name:"signature",type:"object",raw:`{
  x: number
  y: number
}`,signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}}]},required:!1}},{key:"maskFillColor",value:{name:"string",required:!1}},{key:"maskStrokeColor",value:{name:"string",required:!1}},{key:"maskStrokeWidth",value:{name:"number",required:!1}},{key:"isTopShadeVisible",value:{name:"boolean",required:!1}},{key:"topShadeColor",value:{name:"string",required:!1}},{key:"isBottomShadeVisible",value:{name:"boolean",required:!1}},{key:"bottomShadeColor",value:{name:"string",required:!1}}]}}]},{name:"union",raw:"'src' | 'alt' | 'className'",elements:[{name:"literal",value:"'src'"},{name:"literal",value:"'alt'"},{name:"literal",value:"'className'"}]}],raw:"Omit<ImagePropertyType, 'src' | 'alt' | 'className'>"},description:""},imageAccept:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'image/*'",computed:!1}},onImageChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(payload: VideoSlideImageChangePayloadType) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  file: File
  objectUrl: string
}`,signature:{properties:[{key:"file",value:{name:"File",required:!0}},{key:"objectUrl",value:{name:"string",required:!0}}]}},name:"payload"}],return:{name:"void"}}},description:""},brandName:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},brandIcon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},heading:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},viewsText:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},tagText:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"",defaultValue:{value:"'NEW'",computed:!1}},tagType:{required:!1,tsType:{name:"unknown[number]",raw:"(typeof TAG_TYPE_OPTIONS)[number]"},description:"",defaultValue:{value:"'default'",computed:!1}},durationText:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"",defaultValue:{value:"'2:13'",computed:!1}}}};export{Z as V};
