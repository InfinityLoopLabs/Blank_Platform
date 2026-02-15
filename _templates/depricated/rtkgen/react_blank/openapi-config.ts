import type { ConfigFile } from '@npm.piece/generate-hooks-rtk/types/export'

// Выбираем куда добавлять хуки
const getName = (name: string) => `./src/features/generated/hooks/${name}.ts`
const setOrderName = (name: string) => `${name}Store`
const setFilterName = (name: string) => [new RegExp(name, 'i')]

const getControllers = (names: string[]) =>
  names.reduce(
    (acc, name) => ({
      ...acc,
      [getName(name)]: {
        filterEndpoints: setFilterName(name),
        exportName: setOrderName(name),
        tag: name,
      },
    }),
    {}
  )

const controllers = ['pet', 'order', 'user']
const config: ConfigFile = {
  schemaFile: 'https://petstore3.swagger.io/api/v3/openapi.json',
  // schemaFile: './swagger.json',
  apiFile: '@app/api/RTK',
  // tag: true, // по итогу лучше без тегов
  hooks: true,
  // outputFile: getName('api'),
  outputFiles: { ...getControllers(controllers) },
}

// eslint-disable-next-line import/no-default-export
export default config
