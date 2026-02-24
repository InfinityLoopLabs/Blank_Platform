module.exports = {
  commands: {
    createWidget: [
      {
        type: "add",
        from: "_templates/react_template/_template/widget",
        to: ".tmp-generated/widgets/$name",
        replace: [{ Sample: "$name" }, { sample: "$name" }],
      },
    ],
    removeWidget: [
      {
        type: "remove",
        target: ".tmp-generated/widgets/$name",
      },
    ],
  },
};
