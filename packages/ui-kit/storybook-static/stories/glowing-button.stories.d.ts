import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: ({ icon, leftIcon, rightIcon, onClick, state, isFullWidth, className, children, ...property }: import('../../../../node_modules/react').ButtonHTMLAttributes<HTMLButtonElement> & {
        icon?: import('../../../../node_modules/react').ReactNode;
        leftIcon?: import('../../../../node_modules/react').ReactNode;
        rightIcon?: import('../../../../node_modules/react').ReactNode;
        onClick?: (event: import('../../../../node_modules/react').MouseEvent<HTMLButtonElement>) => void;
        state?: "default" | "active";
        isFullWidth?: boolean;
    } & {
        children?: import('../../../../node_modules/react').ReactNode | undefined;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    tags: string[];
    render: (args: import('../../../../node_modules/react').ButtonHTMLAttributes<HTMLButtonElement> & {
        icon?: import('../../../../node_modules/react').ReactNode;
        leftIcon?: import('../../../../node_modules/react').ReactNode;
        rightIcon?: import('../../../../node_modules/react').ReactNode;
        onClick?: (event: import('../../../../node_modules/react').MouseEvent<HTMLButtonElement>) => void;
        state?: "default" | "active";
        isFullWidth?: boolean;
    } & {
        children?: import('../../../../node_modules/react').ReactNode | undefined;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    args: {
        children: string;
        state: "default";
    };
    argTypes: {
        state: {
            control: "select";
            options: string[];
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const WithTwoIcons: Story;
