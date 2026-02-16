const path = require('path')

const useAppActionsFile = './app/utils/hooks/useAppActions.ts'
const reducersFile = './app/application/store/reducers.ts'
const routerFile = './app/application/router/utils/pages.ts'

const pathToWidgetTemplate = './_template/widget/'
const pathToServiceTemplate = './_template/service/'
const pathToPageTemplate =  './_template/page/'

const pathToPasteWidget = './app/features/widgets/'
const pathToPasteService = './app/features/services/'
const pathToPastePage = './app/pages/'

module.exports = {
  filePath: {
    reducersList: path.resolve(__dirname, reducersFile),
    useAppActions: path.resolve(__dirname, useAppActionsFile),
    router: path.resolve(__dirname, routerFile)
  },
  regexp: {
    useAppActions: {
      hooks: 'insert hook here',
      actions: 'insert actions here'
    },
    reducersList: {
      service: 'Services: Начало',
      widget: 'Widgets: Начало'
    },
    router: {
      import: 'insert page imports here',
    }
  },
  importPath: {
    useAppActions: {
      service: '@services/',
      widget: '@widgets/'
    },
    reducersList: {
      service: '@services/',
      widget: '@widgets/'
    },
    router: {
      page:`
   export const Sample = lazy(() =>
  import('@pages/Sample').then(module => ({
    default: module.Page,
  }))
)
    `
    }
  },
  pathToTemplate: {
    service: path.resolve(__dirname, pathToServiceTemplate),
    widget: path.resolve(__dirname, pathToWidgetTemplate),
    page: path.resolve(__dirname, pathToPageTemplate)
  },
  pathToPaste: {
    service: path.resolve(__dirname, pathToPasteService),
    widget: path.resolve(__dirname, pathToPasteWidget),
    page: path.resolve(__dirname, pathToPastePage)
  },
  // NOTE: CLI runs this after scaffolding/injections. Keep it aligned with package.json scripts.
  eslintCommand: 'npm run lint'
}
