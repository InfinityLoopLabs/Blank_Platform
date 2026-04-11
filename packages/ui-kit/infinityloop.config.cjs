const TEMPLATE_REPO = 'https://github.com/InfinityLoopLabs/frontend-vite-lib-template.git'
const TEMPLATE_REF = 'main'

module.exports = {
  commands: {
    initCli: [
      {
        type: 'copy',
        from: '.cli.example',
        to: '.cli',
      },
    ],
    sync: [
      {
        type: 'merge-template',
        repo: TEMPLATE_REPO,
        ref: TEMPLATE_REF,
      },
      {
        type: 'read',
        file: '.cli',
      },
      {
        type: 'replace',
        when: 'PROJECT_NAME',
        file: 'package.json',
        optional: true,
        search: '"name": "@infinityloop.labs/frontend-vite-lib-template"',
        replace: '"name": "${PROJECT_NAME}"',
      },
    ],
  },
}
