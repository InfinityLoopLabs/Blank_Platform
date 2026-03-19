import * as React from '../../../../../../node_modules/react';
export type Slider2PropertyType = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    children: React.ReactNode;
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    isLoopEnabled?: boolean;
    isPaginationVisible?: boolean;
    isNavigationEnabled?: boolean;
    isArrowsVisible?: boolean;
    isMousewheelEnabled?: boolean;
    isKeyboardEnabled?: boolean;
    isGrabCursorVisible?: boolean;
    isFreeScrollEnabled?: boolean;
    onSlideChange?: (activeSlideIndex: number) => void;
};
export declare const Slider2: ({ children, className, slidesPerView, spaceBetween, isLoopEnabled, isPaginationVisible, isNavigationEnabled, isArrowsVisible, isMousewheelEnabled, isKeyboardEnabled, isGrabCursorVisible, isFreeScrollEnabled, onSlideChange, ...property }: Slider2PropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
