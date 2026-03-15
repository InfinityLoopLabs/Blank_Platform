import type { StoryObj } from '@storybook/react';
import { type TypographyType } from '../components/atoms/Typography';
declare const meta: {
    title: string;
    component: {
        ({ typography, element, className: clsname, children, ...props }: {
            typography: TypographyType;
            element?: import('../../../../node_modules/react').ElementType;
            className?: string;
        } & import('../../../../node_modules/react').HTMLAttributes<HTMLElement>): import('../../../../node_modules/react').ReactElement<any, string | import('../../../../node_modules/react').JSXElementConstructor<any>>;
        displayName: string;
    };
    tags: string[];
};
export default meta;
type StoryType = StoryObj<typeof meta>;
export declare const Guide: StoryType;
export declare const Action: StoryType;
export declare const Subheader: StoryType;
export declare const Caption: StoryType;
