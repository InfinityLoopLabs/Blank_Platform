import type { StoryObj } from "@storybook/react";
declare const meta: {
    title: string;
    component: ({ icon, leftIcon, rightIcon, onClick, animation, color, variant, size, className, children, style, ...property }: import('../../../../node_modules/react').ButtonHTMLAttributes<HTMLButtonElement> & {
        icon?: import('../../../../node_modules/react').ReactNode;
        leftIcon?: import('../../../../node_modules/react').ReactNode;
        rightIcon?: import('../../../../node_modules/react').ReactNode;
        onClick?: (event: import('../../../../node_modules/react').MouseEvent<HTMLButtonElement>) => void;
        animation?: "default" | "active";
        color?: import('../components/atoms/Button').ButtonColorType;
        variant?: import('../components/atoms/Button').ButtonVariantType;
        size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
    } & {
        children?: import('../../../../node_modules/react').ReactNode | undefined;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    tags: string[];
    args: {
        animation: "default";
        size: "default";
        variant: "filled";
        color: "chart-1";
    };
    argTypes: {
        animation: {
            control: "select";
            options: string[];
        };
        color: {
            control: "select";
            options: readonly ["primary", "secondary", "accent", "muted", "constructive", "cautionary", "destructive", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
        };
        variant: {
            control: "select";
            options: readonly ["filled", "outline", "text"];
        };
        size: {
            control: "select";
            options: string[];
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const AllColors: Story;
