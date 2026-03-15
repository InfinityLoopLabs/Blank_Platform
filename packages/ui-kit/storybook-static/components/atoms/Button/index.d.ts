import type { ButtonHTMLAttributes, MouseEvent, PropsWithChildren, ReactNode } from '../../../../../../node_modules/react';
type ButtonStateType = 'default' | 'active';
type ButtonVariantType = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSizeType = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
type ButtonPropertyType = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    state?: ButtonStateType;
    variant?: ButtonVariantType;
    size?: ButtonSizeType;
    isGlow?: boolean;
    isFullWidth?: boolean;
}>;
export declare const Button: ({ icon, leftIcon, rightIcon, onClick, state, variant, size, isGlow, isFullWidth, className, children, ...property }: ButtonPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
