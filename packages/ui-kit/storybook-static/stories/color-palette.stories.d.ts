import type { StoryObj } from "@storybook/react";
declare function TailwindPalettePage(): import('../../../../node_modules/react/jsx-runtime').JSX.Element;
declare const meta: {
    title: string;
    component: typeof TailwindPalettePage;
    tags: string[];
    parameters: {
        layout: string;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Palette: Story;
