import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: ({ className, typography, element, isEditModeDisabled, inputProps, children, }: {
        className?: string;
        typography?: import('../components/atoms/Typography').TypographyType;
        element?: import('../../../../node_modules/react').ElementType;
        isEditModeDisabled?: boolean;
        inputProps?: React.ComponentProps<typeof import("..").Input>;
        children?: React.ReactNode;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    tags: string[];
    decorators: ((Story: import("@storybook/core/csf").PartialStoryFn<import("@storybook/react").ReactRenderer, {
        className?: string | undefined;
        typography?: import('../components/atoms/Typography').TypographyType | undefined;
        element?: import('../../../../node_modules/react').ElementType | undefined;
        isEditModeDisabled?: boolean | undefined;
        inputProps?: React.ComponentProps<typeof import("..").Input> | undefined;
        children?: import('../../../../node_modules/react').ReactNode;
    }>) => import('../../../../node_modules/react/jsx-runtime').JSX.Element)[];
    args: {
        typography: "Heading16";
        element: "p";
        isEditModeDisabled: false;
        inputProps: {
            defaultValue: string;
            placeholder: string;
        };
    };
    argTypes: {
        typography: {
            control: "select";
            options: import('../components/atoms/Typography').TypographyType[];
        };
        element: {
            control: "text";
        };
        inputProps: {
            control: false;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
