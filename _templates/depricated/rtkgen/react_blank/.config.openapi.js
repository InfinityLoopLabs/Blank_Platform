const path = require('path')

const createPath = (pathName) => path.resolve(__dirname, pathName)

const configFile = {
  // указываем путь к папке, в которой находятся файлы с хуками
  hooksFolder: createPath('./src/features/generated/hooks/'),
  // файл куда заберутся все импорты хуков
  exportFile: createPath('./src/features/generated/hooks.ts'),
  // приписка к импорту для файла хуков
  hooksImportFileSuffix: './hooks/',
  // путь до reducers файла
  reducersImportDestination: createPath(
    './src/app/store/generated/reducers.ts'
  ),
  // путь до middleware файла
  middlewaresImportDestination: createPath(
    './src/app/store/generated/middlewares.ts'
  ),
  // путь для импорта из файла reducers
  reducersImportFileSuffix: '@generated/hooks/',
  // путь для импорта из файла middlewares
  middlewaresImportFileSuffix: '@generated/hooks/',
  // название объекта куда вставлять импорты в файле reducers
  reducersObjectName: 'generatedReducersList',
  // название объекта куда вставлять импорты в файле middlewares
  middlewaresObjectName: 'generatedMiddlewaresList',
  // не обязательное поле, которое при наличии вызовет eslint fix в конце
  eslintCommand: 'yarn run eslint'
}

module.exports={
  configFile
}
