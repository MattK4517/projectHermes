import React from "react";
import BuildPathsPage from "../src/pages/gods/[god]/build-paths";
import GodPageLayout from "../src/components/gods/GodPageLayout";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "god/Build Paths",
  component: BuildPathsPage,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <BuildPathsPage {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};

Primary.parameters = {
  //   layout: GodPageLayout,
  nextRouter: {
    path: "/gods/[god]/build-path",
    asPath: "/gods/Achilles/build-path",
    query: {
      god: "Achilles",
    },
  },
};
