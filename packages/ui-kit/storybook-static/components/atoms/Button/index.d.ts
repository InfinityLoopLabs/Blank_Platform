import type { ButtonHTMLAttributes, MouseEvent, PropsWithChildren, ReactNode } from '../../../../../../node_modules/react';
type ButtonAnimationType = 'default' | 'active';
type ButtonSizeType = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
export declare const BUTTON_COLOR_OPTIONS: readonly ["primary", "secondary", "accent", "muted", "constructive", "cautionary", "destructive", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
export type ButtonColorType = (typeof BUTTON_COLOR_OPTIONS)[number];
type ButtonPropertyType = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    animation?: ButtonAnimationType;
    color?: ButtonColorType;
    size?: ButtonSizeType;
}>;
export declare const Button: ({ icon, leftIcon, rightIcon, onClick, animation, color, size, className, children, ...property }: ButtonPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
