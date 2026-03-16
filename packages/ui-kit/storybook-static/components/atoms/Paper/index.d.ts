import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from '../../../../../../node_modules/react';
declare const paperStyleDictionary: {
    readonly light: "bg-(--card)";
    readonly dark: "bg-(--background)";
    readonly gradient: "bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_oklab,var(--chart-1)_10%,transparent),transparent_55%),linear-gradient(180deg,color-mix(in_oklab,var(--card)_93%,black_7%),var(--card))]";
};
type PaperType = keyof typeof paperStyleDictionary;
type PaperBasePropertyType<T extends ElementType> = {
    as?: T;
    type?: PaperType;
    className?: string;
    isColored?: boolean;
    isRoundedCornersDisabled?: boolean;
    isLoading?: boolean;
};
type PaperPropertyType<T extends ElementType> = PropsWithChildren<PaperBasePropertyType<T> & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>>;
declare const defaultElement = "div";
export declare const Paper: <T extends ElementType = typeof defaultElement>({ as, type, className, children, isColored, isRoundedCornersDisabled, isLoading, ...property }: PaperPropertyType<T>) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
