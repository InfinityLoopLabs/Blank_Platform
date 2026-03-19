import{j as i}from"./jsx-runtime-9bc08dc0.js";import{f as S}from"./index-43965908.js";import{S as u}from"./index-081190c9.js";import{g as I,m as P,M as W,a as A,c as F,d as G,B as K,b as E,e as p}from"./examples-6ce7dd52.js";import"./index-0b625b07.js";import"./utils-0998f52b.js";import"./chevron-left-c761184d.js";import"./createLucideIcon-00f6dee4.js";import"./chevron-right-3e52afdc.js";import"./index-4f5fd3dc.js";import"./index-75ff7cb7.js";import"./index.es-32ff2151.js";import"./index-68fbcb4b.js";import"./index-6ce60cf9.js";import"./index-99726b4a.js";import"./index-1e60d2d8.js";const le={title:"Molecules/Slider/Slides",tags:["autodocs"],args:{isEditModeEnabled:!1,isEditModeDisabled:!1,onTagClick:S(),onTagLabelChange:S()},argTypes:{isEditModeEnabled:{control:"boolean"},isEditModeDisabled:{control:"boolean"},onTagClick:{table:{disable:!0}},onTagLabelChange:{table:{disable:!0}}}},r={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const e=p[0],{tags:m,tagText:g}=I("two-tags",e.id,e.tagText);return i.jsx("div",{className:"w-full p-4",children:i.jsx("div",{className:P,children:i.jsx(W,{...e,tagText:g,tags:m,isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})})})}},o={render:({isEditModeEnabled:s,isEditModeDisabled:d})=>{const a=p[0];return i.jsx("div",{className:"w-full p-4",children:i.jsx("div",{className:A,children:i.jsx(F,{coverImageSrc:a.coverImageSrc,brandName:a.brandName,heading:a.heading,viewsText:"661 просмотры",tagText:"NEW",isEditModeEnabled:s,isEditModeDisabled:d})})})}},t={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const e=p[0],{tags:m,tagText:g}=I("two-other-tags",e.id,e.tagText);return i.jsx("div",{className:"w-full p-4",children:i.jsx("div",{className:G,children:i.jsx(K,{coverImageSrc:e.coverImageSrc,brandName:e.brandName,heading:e.heading,description:e.description,tagText:g,tags:m,isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})})})}},n={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const e=E({componentType:"MediumVerticalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return i.jsx("div",{className:"w-full p-4",children:i.jsx(u,{slides:e,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!1})})}},c={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const e=E({componentType:"BigHorizontalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return i.jsx("div",{className:"w-full p-4",children:i.jsx(u,{slides:e,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!1})})}},b={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const e=E({componentType:"MediumHorizontalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return i.jsx("div",{className:"w-full p-4",children:i.jsx(u,{slides:e,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!1})})}};var M,T,h;r.parameters={...r.parameters,docs:{...(M=r.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange
  }) => {
    const slide = courseSlideData[0];
    const {
      tags,
      tagText
    } = getTagsByVariant('two-tags', slide.id, slide.tagText);
    return <div className="w-full p-4">
        <div className={mediumVerticalSlideWidthClassName}>
          <MediumVerticalSlide {...slide} tagText={tagText} tags={tags} isEditModeEnabled={isEditModeEnabled} isEditModeDisabled={isEditModeDisabled} onTagClick={onTagClick} onTagLabelChange={onTagLabelChange} />
        </div>
      </div>;
  }
}`,...(h=(T=r.parameters)==null?void 0:T.docs)==null?void 0:h.source}}};var v,w,x;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: ({
    isEditModeEnabled,
    isEditModeDisabled
  }) => {
    const slide = courseSlideData[0];
    return <div className="w-full p-4">
        <div className={mediumHorizontalSlideWidthClassName}>
          <MediumHorizontalSlide coverImageSrc={slide.coverImageSrc} brandName={slide.brandName} heading={slide.heading} viewsText="661 просмотры" tagText="NEW" isEditModeEnabled={isEditModeEnabled} isEditModeDisabled={isEditModeDisabled} />
        </div>
      </div>;
  }
}`,...(x=(w=o.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};var C,N,V;t.parameters={...t.parameters,docs:{...(C=t.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange
  }) => {
    const slide = courseSlideData[0];
    const {
      tags,
      tagText
    } = getTagsByVariant('two-other-tags', slide.id, slide.tagText);
    return <div className="w-full p-4">
        <div className={bigHorizontalSlideWidthClassName}>
          <BigHorizontalSlide coverImageSrc={slide.coverImageSrc} brandName={slide.brandName} heading={slide.heading} description={slide.description} tagText={tagText} tags={tags} isEditModeEnabled={isEditModeEnabled} isEditModeDisabled={isEditModeDisabled} onTagClick={onTagClick} onTagLabelChange={onTagLabelChange} />
        </div>
      </div>;
  }
}`,...(V=(N=t.parameters)==null?void 0:N.docs)==null?void 0:V.source}}};var f,D,z;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange
  }) => {
    const slides = buildSliderSlides({
      componentType: 'MediumVerticalSlide',
      isEditModeEnabled,
      isEditModeDisabled,
      onTagClick,
      onTagLabelChange
    });
    return <div className="w-full p-4">
        <Slider slides={slides} slidesPerView="auto" spaceBetween={16} isLoopEnabled={false} isPaginationVisible isNavigationEnabled isArrowsVisible isMousewheelEnabled isKeyboardEnabled isGrabCursorVisible isFreeScrollEnabled={false} />
      </div>;
  }
}`,...(z=(D=n.parameters)==null?void 0:D.docs)==null?void 0:z.source}}};var H,L,B;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange
  }) => {
    const slides = buildSliderSlides({
      componentType: 'BigHorizontalSlide',
      isEditModeEnabled,
      isEditModeDisabled,
      onTagClick,
      onTagLabelChange
    });
    return <div className="w-full p-4">
        <Slider slides={slides} slidesPerView="auto" spaceBetween={16} isLoopEnabled={false} isPaginationVisible isNavigationEnabled isArrowsVisible isMousewheelEnabled isKeyboardEnabled isGrabCursorVisible isFreeScrollEnabled={false} />
      </div>;
  }
}`,...(B=(L=c.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var j,y,k;b.parameters={...b.parameters,docs:{...(j=b.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange
  }) => {
    const slides = buildSliderSlides({
      componentType: 'MediumHorizontalSlide',
      isEditModeEnabled,
      isEditModeDisabled,
      onTagClick,
      onTagLabelChange
    });
    return <div className="w-full p-4">
        <Slider slides={slides} slidesPerView="auto" spaceBetween={16} isLoopEnabled={false} isPaginationVisible isNavigationEnabled isArrowsVisible isMousewheelEnabled isKeyboardEnabled isGrabCursorVisible isFreeScrollEnabled={false} />
      </div>;
  }
}`,...(k=(y=b.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};const re=["MediumVerticalExample","MediumHorizontalExample","BigHorizontalExample","MediumVerticalInSlider","BigHorizontalInSlider","MediumHorizontalInSlider"];export{t as BigHorizontalExample,c as BigHorizontalInSlider,o as MediumHorizontalExample,b as MediumHorizontalInSlider,r as MediumVerticalExample,n as MediumVerticalInSlider,re as __namedExportsOrder,le as default};
