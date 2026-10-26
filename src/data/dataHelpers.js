// Turns the result of an eager `import.meta.glob(..., { import: 'default' })`
// into { 'FileName.png': url }. The glob itself has to stay in each data file,
// because Vite needs its pattern written out literally.
export function byFileName(globResult) {
  return Object.fromEntries(
    Object.entries(globResult).map(([path, url]) => [path.split('/').pop(), url]),
  )
}

// A typo in the data stops the app during development, so it gets noticed
// right away; on the live site it's only logged, so the rest keeps working.
export function reportDataError(message) {
  if (import.meta.env.DEV) throw new Error(message)
  console.error(message)
}
