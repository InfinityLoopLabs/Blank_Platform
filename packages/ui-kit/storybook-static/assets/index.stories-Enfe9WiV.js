import{j as e}from"./iframe-EEWUujUr.js";import{g as P,a as W,B as _,c as E,b as p,S,m as K,M as A,d as F,e as G}from"./examples-Ci9ESJrs.js";import"./preload-helper-C1FmrZbK.js";import"./chevron-left-7sB2-fEY.js";import"./chevron-right-DwMaQSlY.js";import"./index-Dk6702tq.js";import"./index-Bh0QwztN.js";import"./index.es-Ck4uLIAB.js";import"./index-DEXXSxe7.js";import"./index-CQrq4_CI.js";import"./index-Bm85qUxl.js";const{fn:v}=__STORYBOOK_MODULE_TEST__,r="mx-auto w-[760px] max-w-full px-10",ie={title:"Molecules/Slider/Slides",tags:["autodocs"],args:{isEditModeEnabled:!1,isEditModeDisabled:!1,onTagClick:v(),onTagLabelChange:v()},argTypes:{isEditModeEnabled:{control:"boolean"},isEditModeDisabled:{control:"boolean"},onTagClick:{table:{disable:!0}},onTagLabelChange:{table:{disable:!0}}}},o={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=E[0],{tags:g,tagText:u}=P("two-tags",i.id,i.tagText);return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx("div",{style:F,children:e.jsx(G,{...i,tagText:u,tags:g,isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})})})})}},t={render:({isEditModeEnabled:s,isEditModeDisabled:d})=>{const a=E[0];return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx("div",{style:K,children:e.jsx(A,{coverImageSrc:a.coverImageSrc,brandName:a.brandName,heading:a.heading,viewsText:"661 просмотры",tagText:"NEW",isEditModeEnabled:s,isEditModeDisabled:d})})})})}},n={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=E[0],{tags:g,tagText:u}=P("two-other-tags",i.id,i.tagText);return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx("div",{style:W,children:e.jsx(_,{coverImageSrc:i.coverImageSrc,brandName:i.brandName,heading:i.heading,description:i.description,tagText:u,tags:g,isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})})})})}},c={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=p({componentType:"MediumVerticalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx(S,{slides:i,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!0})})})}},b={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=p({componentType:"BigHorizontalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx(S,{slides:i,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!0})})})}},m={render:({isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l})=>{const i=p({componentType:"MediumHorizontalSlide",isEditModeEnabled:s,isEditModeDisabled:d,onTagClick:a,onTagLabelChange:l});return e.jsx("div",{className:"w-full p-4",children:e.jsx("div",{className:r,children:e.jsx(S,{slides:i,slidesPerView:"auto",spaceBetween:16,isLoopEnabled:!1,isPaginationVisible:!0,isNavigationEnabled:!0,isArrowsVisible:!0,isMousewheelEnabled:!0,isKeyboardEnabled:!0,isGrabCursorVisible:!0,isFreeScrollEnabled:!0})})})}};var M,T,h;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(N=(C=t.parameters)==null?void 0:C.docs)==null?void 0:N.source}}};var w,V,D;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(D=(V=n.parameters)==null?void 0:V.docs)==null?void 0:D.source}}};var y,f,j;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(j=(f=c.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var L,z,H;b.parameters={...b.parameters,docs:{...(L=b.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(H=(z=b.parameters)==null?void 0:z.docs)==null?void 0:H.source}}};var B,k,I;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(I=(k=m.parameters)==null?void 0:k.docs)==null?void 0:I.source}}};const ae=["MediumVerticalExample","MediumHorizontalExample","BigHorizontalExample","MediumVerticalInSlider","BigHorizontalInSlider","MediumHorizontalInSlider"];export{n as BigHorizontalExample,b as BigHorizontalInSlider,t as MediumHorizontalExample,m as MediumHorizontalInSlider,o as MediumVerticalExample,c as MediumVerticalInSlider,ae as __namedExportsOrder,ie as default};
