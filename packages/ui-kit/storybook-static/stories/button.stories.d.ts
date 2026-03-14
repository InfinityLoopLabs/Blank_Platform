import type { StoryObj } from "@storybook/react";
import { Button } from '../components/ui/button';
declare const meta: {
    title: string;
    component: typeof Button;
    tags: string[];
    args: {
        children: string;
        variant: "default";
        size: "default";
        isGlow: false;
        disabled: false;
    };
    argTypes: {
        variant: {
            control: "select";
            options: string[];
        };
        size: {
            control: "select";
            options: string[];
        };
        isGlow: {
            control: "boolean";
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const Destructive: Story;
export declare const Outline: Story;
export declare const Glow: Story;
export declare const LogoSquare: Story;
export declare const WithLeftIcon: Story;
export declare const WithRightIcon: Story;
export declare const WithBothIcons: Story;
