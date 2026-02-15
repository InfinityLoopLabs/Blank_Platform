import React from 'react'
import { ImportedContainer } from '@app/entry/container'

// Модуль для импорта через Module Federation Plugin
const ExportedModule = props => <ImportedContainer {...props} />

export default ExportedModule
