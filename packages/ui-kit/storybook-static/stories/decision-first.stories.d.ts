import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: ({ className, cancelText, acceptText, ...property }: import('../../../../node_modules/react').HTMLAttributes<HTMLDivElement> & {
        cancelText?: string;
        acceptText?: string;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    parameters: {
        docs: {
            disable: boolean;
        };
        controls: {
            disable: boolean;
        };
    };
    render: (args: import('../../../../node_modules/react').HTMLAttributes<HTMLDivElement> & {
        cancelText?: string;
        acceptText?: string;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    args: {
        cancelText: string;
        acceptText: string;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
