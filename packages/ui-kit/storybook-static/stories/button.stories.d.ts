import type { StoryObj } from "@storybook/react";
declare const meta: {
    title: string;
    component: ({ icon, leftIcon, rightIcon, onClick, state, variant, size, isGlow, isFullWidth, className, children, ...property }: import('../../../../node_modules/react').ButtonHTMLAttributes<HTMLButtonElement> & {
        icon?: import('../../../../node_modules/react').ReactNode;
        leftIcon?: import('../../../../node_modules/react').ReactNode;
        rightIcon?: import('../../../../node_modules/react').ReactNode;
        onClick?: (event: import('../../../../node_modules/react').MouseEvent<HTMLButtonElement>) => void;
        state?: "default" | "active";
        variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
        size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
        isGlow?: boolean;
        isFullWidth?: boolean;
    } & {
        children?: import('../../../../node_modules/react').ReactNode | undefined;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    tags: string[];
    args: {
        children: string;
        state: "default";
        variant: "default";
        size: "default";
    };
    argTypes: {
        state: {
            control: "select";
            options: string[];
        };
        variant: {
            control: "select";
            options: string[];
        };
        size: {
            control: "select";
            options: string[];
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const Active: Story;
export declare const Outline: Story;
export declare const Destructive: Story;
export declare const Secondary: Story;
export declare const Ghost: Story;
export declare const Link: Story;
export declare const LogoSquare: Story;
export declare const WithBothIcons: Story;
