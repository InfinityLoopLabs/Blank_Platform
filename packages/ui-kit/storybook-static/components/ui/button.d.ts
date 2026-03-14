import * as React from '../../../../../node_modules/react';
import { type VariantProps } from "class-variance-authority";
declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Button({ className, variant, size, isGlow, asChild, leftIcon, rightIcon, children, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isGlow?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
export { Button, buttonVariants };
