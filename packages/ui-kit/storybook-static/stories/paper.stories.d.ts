import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: <T extends import('../../../../node_modules/react').ElementType = "div">({ as, type, className, children, isColored, ...property }: {
        as?: T | undefined;
        type?: "light" | "dark";
        className?: string;
        isColored?: boolean;
    } & Omit<import('../../../../node_modules/react').PropsWithoutRef<import('../../../../node_modules/react').ComponentProps<T>>, "className" | "children" | "as"> & {
        children?: import('../../../../node_modules/react').ReactNode | undefined;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    tags: string[];
    render: (args: {
        as?: import('../../../../node_modules/react').ElementType | undefined;
        type?: "light" | "dark";
        className?: string;
        isColored?: boolean;
    } & Omit<Omit<any, "ref">, "className" | "children" | "as"> & {
        children?: import('../../../../node_modules/react').ReactNode | undefined;
    }) => import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    args: {
        className: string;
        type: "light";
        isColored: true;
        children: import('../../../../node_modules/react/jsx-runtime').JSX.Element;
    };
    argTypes: {
        type: {
            control: "select";
            options: string[];
        };
        isColored: {
            control: "boolean";
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const Colored: Story;
export declare const FlatDark: Story;
