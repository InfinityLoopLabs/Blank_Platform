import type { ButtonHTMLAttributes, MouseEvent, PropsWithChildren, ReactNode } from '../../../../../../node_modules/react';
type GlowingButtonStateType = 'default' | 'active';
type GlowingButtonPropertyType = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    state?: GlowingButtonStateType;
    isFullWidth?: boolean;
}>;
export declare const GlowingButton: ({ icon, leftIcon, rightIcon, onClick, state, isFullWidth, className, children, ...property }: GlowingButtonPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
