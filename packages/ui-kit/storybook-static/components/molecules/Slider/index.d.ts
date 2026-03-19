import * as React from '../../../../../../node_modules/react';
type SliderPropertyType = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    slides?: React.ReactNode[];
    children?: React.ReactNode;
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    isLoopEnabled?: boolean;
    isPaginationVisible?: boolean;
    isNavigationVisible?: boolean;
    isNavigationEnabled?: boolean;
    isArrowsVisible?: boolean;
    isMousewheelEnabled?: boolean;
    isKeyboardEnabled?: boolean;
    isGrabCursorVisible?: boolean;
    isFreeScrollEnabled?: boolean;
    onSlideChange?: (activeSlideIndex: number) => void;
};
export declare const Slider: ({ slides, children, className, slidesPerView, spaceBetween, isLoopEnabled, isPaginationVisible, isNavigationVisible, isNavigationEnabled, isArrowsVisible, isMousewheelEnabled, isKeyboardEnabled, isGrabCursorVisible, isFreeScrollEnabled, onSlideChange, ...property }: SliderPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
