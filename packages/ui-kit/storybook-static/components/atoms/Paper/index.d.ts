import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from '../../../../../../node_modules/react';
declare const paperStyleDictionary: {
    readonly light: "bg-(--card)";
    readonly dark: "bg-(--background)";
};
type PaperType = keyof typeof paperStyleDictionary;
type PaperBasePropertyType<T extends ElementType> = {
    as?: T;
    type?: PaperType;
    className?: string;
    isColored?: boolean;
};
type PaperPropertyType<T extends ElementType> = PropsWithChildren<PaperBasePropertyType<T> & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>>;
declare const defaultElement = "div";
export declare const Paper: <T extends ElementType = typeof defaultElement>({ as, type, className, children, isColored, ...property }: PaperPropertyType<T>) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
