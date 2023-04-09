const { glob } = require('glob')
const path = require('path')

async function deleteCachedFile(file) {
  const filePath = path.resolve(file)
  if (require.cache[filePath]) {
    delete require.cache[filePath]
  }
}

async function loadFiles(dirName) {
  try {
    const files = await glob(
      path.join(process.cwd(), dirName, '**/*.js').replace(/\\/g, '/')
    )
    const jsFiles = files.filter((file) => path.extname(file) === '.js')
    await Promise.all(jsFiles.map(deleteCachedFile))
    return jsFiles
  } catch (error) {
    // Ou eu to contratando teu namorado como pedreiro, salário de 10 mil por mês - Cauã 08/04/2023
    console.error(`Erro carregando uns arquivo ${dirName}: ${error}`)
    throw error
  }
}

module.exports = { loadFiles }
