// import dotenv from 'dotenv'

// фикс для windows
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const SWAGGER_URL = 'http://localhost:8080/swagger/doc.json'

const getName = (name) => `./app/features/generated/hooks/${name}.ts`

const config = {
  schemaFile: SWAGGER_URL,
  apiFile: '@application/api/rtk/instances/auth',
  // tag: true, // по итогу лучше без тегов
  hooks: {
    queries: true,
    lazyQueries: true,
    mutations: true,
  },
  outputFile: getName('auth'),
}

module.exports = config
