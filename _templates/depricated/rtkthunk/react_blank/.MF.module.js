const path = require('path')

module.exports = {
  imported: {
    RenameImportedModuleHere: `red@${process.env.REACT_APP_IP_MF}`,
  },
  exported: {
    './RenameExportedModuleHere': path.resolve(__dirname, 'src/modules/export/Exported'),
  },
}
