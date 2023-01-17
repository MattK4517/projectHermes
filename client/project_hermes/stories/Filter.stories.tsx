import React from "react";
import Filter from "../src/components/general/Filter";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "general/Filter",
  component: Filter,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Filter {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  filterList: {
    filterValue: "role",
    defaultValue: "Solo",
    filterOptions: [
      { optionName: "Solo" },
      { optionName: "Jungle" },
      { optionName: "Mid" },
      { optionName: "Carry" },
      { optionName: "Support" },
    ],
  },
};
