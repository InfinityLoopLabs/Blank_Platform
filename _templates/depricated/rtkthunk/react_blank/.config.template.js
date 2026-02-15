const path = require('path')

const useAppActionsFile = './src/utils/hooks/useAppActions.ts'
const reducersFile = './src/app/store/reducers.ts'

const pathToWidgetTemplate = '../../_templates/rtkthunk/widget/'
const pathToServiceTemplate = '../../_templates/rtkthunk/service/'

const pathToPasteWidget = './src/features/widgets/'
const pathToPasteService = './src/features/services/'

module.exports = {
  filePath: {
    reducersList: path.resolve(__dirname, reducersFile),
    useAppActions: path.resolve(__dirname, useAppActionsFile)
  },
  regexp: {
    useAppActions: {
      hooks: 'insert hook here',
      actions: 'insert actions here'
    },
    reducersList: {
      service: 'Services: Начало',
      widget: 'Widgets: Начало'
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
    }
  },
  pathToTemplate: {
    service: path.resolve(__dirname, pathToServiceTemplate),
    widget: path.resolve(__dirname, pathToWidgetTemplate)
  },
  pathToPaste: {
    service: path.resolve(__dirname, pathToPasteService),
    widget: path.resolve(__dirname, pathToPasteWidget)
  },
  eslintCommand: 'yarn run eslint'
}
