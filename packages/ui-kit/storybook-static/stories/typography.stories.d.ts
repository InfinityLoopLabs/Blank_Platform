import type { StoryObj } from '@storybook/react';
import { type TypographyType } from '../components/atoms/Typography';
declare const meta: {
    title: string;
    component: import('../../../../node_modules/react').FC<{
        typography: TypographyType;
        element?: "div" | "a" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
        className?: string;
    } & import('../../../../node_modules/react').AnchorHTMLAttributes<HTMLAnchorElement>>;
    tags: string[];
};
export default meta;
type StoryType = StoryObj<typeof meta>;
export declare const Guide: StoryType;
export declare const Action: StoryType;
export declare const Subheader: StoryType;
export declare const Caption: StoryType;
