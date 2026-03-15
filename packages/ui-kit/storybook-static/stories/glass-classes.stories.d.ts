import type { StoryObj } from "@storybook/react";
declare function CustomCssPage(): import('../../../../node_modules/react/jsx-runtime').JSX.Element;
declare const meta: {
    title: string;
    component: typeof CustomCssPage;
    tags: string[];
    parameters: {
        layout: string;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Classes: Story;
