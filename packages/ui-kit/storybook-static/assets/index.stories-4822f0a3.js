import{j as e}from"./jsx-runtime-9bc08dc0.js";import{f as v}from"./index-43965908.js";import{g as P,m as W,M as A,a as F,c as G,d as K,B as _,b as p,S as E,e as S}from"./examples-5979f950.js";import"./index-0b625b07.js";import"./utils-0998f52b.js";import"./chevron-left-c761184d.js";import"./createLucideIcon-00f6dee4.js";import"./chevron-right-3e52afdc.js";import"./index-4f5fd3dc.js";import"./index-75ff7cb7.js";import"./index.es-32ff2151.js";import"./index-68fbcb4b.js";import"./index-6ce60cf9.js";import"./index-99726b4a.js";import"./index-1e60d2d8.js";const r="mx-auto w-[760px] max-w-full px-10",le={title:"Molecules/Slider/Slides",tags:["autodocs"],args:{isEditModeEnabled:!1,isEditModeDisabled:!1,onTagClick:v(),onTagLabelChange:v()},argTypes:{isEditModeEnabled:{control:"boolean"},isEditModeDisabled:{control:"boolean"},onTagClick:{table:{disable:!0}},onTagLabelChange:{table:{disable:!0}}}},o={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=S[0],{tags:g,tagText:u}=P("two-tags",i.id,i.tagText);return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx("div",{style:W,children:e.jsx(A,{...i,tagText:u,tags:g,isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})})})})}},t={render:({isEditModeEnabled:s,isEditModeDisabled:d})=>{const a=S[0];return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx("div",{style:F,children:e.jsx(G,{coverImageSrc:a.coverImageSrc,brandName:a.brandName,heading:a.heading,viewsText:"661 просмотры",tagText:"NEW",isEditModeEnabled:s,isEditModeDisabled:d})})})})}},n={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=S[0],{tags:g,tagText:u}=P("two-other-tags",i.id,i.tagText);return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx("div",{style:K,children:e.jsx(_,{coverImageSrc:i.coverImageSrc,brandName:i.brandName,heading:i.heading,description:i.description,tagText:u,tags:g,isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})})})})}},c={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=p({componentType:"MediumVerticalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx(E,{slides:i,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!0})})})}},m={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=p({componentType:"BigHorizontalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx(E,{slides:i,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!0})})})}},b={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=p({componentType:"MediumHorizontalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx(E,{slides:i,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!0})})})}};var M,T,h;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
        <div className={sliderDocsContainerClassName}>
          <div style={mediumVerticalSlideWidthStyle}>
            <MediumVerticalSlide {...slide} tagText={tagText} tags={tags} isEditModeEnabled={isEditModeEnabled} isEditModeDisabled={isEditModeDisabled} onTagClick={onTagClick} onTagLabelChange={onTagLabelChange} />
          </div>
        </div>
      </div>;
  }
}`,...(h=(T=o.parameters)==null?void 0:T.docs)==null?void 0:h.source}}};var x,C,N;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: ({
    isEditModeEnabled,
    isEditModeDisabled
  }) => {
    const slide = courseSlideData[0];
    return <div className="w-full p-4">
        <div className={sliderDocsContainerClassName}>
          <div style={mediumHorizontalSlideWidthStyle}>
            <MediumHorizontalSlide coverImageSrc={slide.coverImageSrc} brandName={slide.brandName} heading={slide.heading} viewsText="661 просмотры" tagText="NEW" isEditModeEnabled={isEditModeEnabled} isEditModeDisabled={isEditModeDisabled} />
          </div>
        </div>
      </div>;
  }
}`,...(N=(C=t.parameters)==null?void 0:C.docs)==null?void 0:N.source}}};var w,V,y;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
        <div className={sliderDocsContainerClassName}>
          <div style={bigHorizontalSlideWidthStyle}>
            <BigHorizontalSlide coverImageSrc={slide.coverImageSrc} brandName={slide.brandName} heading={slide.heading} description={slide.description} tagText={tagText} tags={tags} isEditModeEnabled={isEditModeEnabled} isEditModeDisabled={isEditModeDisabled} onTagClick={onTagClick} onTagLabelChange={onTagLabelChange} />
          </div>
        </div>
      </div>;
  }
}`,...(y=(V=n.parameters)==null?void 0:V.docs)==null?void 0:y.source}}};var D,f,j;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
        <div className={sliderDocsContainerClassName}>
          <Slider slides={slides} slidesPerView="auto" spaceBetween={16} isLoopEnabled={false} isPaginationVisible isNavigationEnabled isArrowsVisible isMousewheelEnabled isKeyboardEnabled isGrabCursorVisible isFreeScrollEnabled />
        </div>
      </div>;
  }
}`,...(j=(f=c.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var z,H,L;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
        <div className={sliderDocsContainerClassName}>
          <Slider slides={slides} slidesPerView="auto" spaceBetween={16} isLoopEnabled={false} isPaginationVisible isNavigationEnabled isArrowsVisible isMousewheelEnabled isKeyboardEnabled isGrabCursorVisible isFreeScrollEnabled />
        </div>
      </div>;
  }
}`,...(L=(H=m.parameters)==null?void 0:H.docs)==null?void 0:L.source}}};var B,k,I;b.parameters={...b.parameters,docs:{...(B=b.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
        <div className={sliderDocsContainerClassName}>
          <Slider slides={slides} slidesPerView="auto" spaceBetween={16} isLoopEnabled={false} isPaginationVisible isNavigationEnabled isArrowsVisible isMousewheelEnabled isKeyboardEnabled isGrabCursorVisible isFreeScrollEnabled />
        </div>
      </div>;
  }
}`,...(I=(k=b.parameters)==null?void 0:k.docs)==null?void 0:I.source}}};const re=["MediumVerticalExample","MediumHorizontalExample","BigHorizontalExample","MediumVerticalInSlider","BigHorizontalInSlider","MediumHorizontalInSlider"];export{n as BigHorizontalExample,m as BigHorizontalInSlider,t as MediumHorizontalExample,b as MediumHorizontalInSlider,o as MediumVerticalExample,c as MediumVerticalInSlider,re as __namedExportsOrder,le as default};
