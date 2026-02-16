const fs = require('fs')
const path = require('path')

const replaceTextInFiles = (dir, from, to) => {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const fileExtension = path.extname(file)

    if (
      file === 'node_modules' ||
      file === '.git' ||
      file === 'replace.cjs' ||
      [
        '.png',
        '.img',
        '.ico',
        '.jpg',
        '.gif',
        '.pdf',
        '.jpeg',
        '.webp',
        '.svg',
      ].includes(fileExtension)
    ) {
      continue
    }

    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      replaceTextInFiles(filePath, from, to)
    } else {
      let content = fs.readFileSync(filePath, 'utf-8')
      const updatedContent = content.replace(new RegExp(from, 'g'), to)
      fs.writeFileSync(filePath, updatedContent)
    }
  }
}

const main = () => {
  const from = 'neon-orange' // Замените на текст, который нужно заменить
  const to = 'neon-main' // Замените на текст, на который нужно заменить
  const startDir = '.' // Замените на папку, в которой нужно начать

  replaceTextInFiles(startDir, from, to)
}

main()
