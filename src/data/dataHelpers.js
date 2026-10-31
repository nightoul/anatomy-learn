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

// Checks the entries of a data file: unique ids, and for each key in `allowed`
// a value from its list. Also warns about image files no entry uses (a typo in
// a file name). `file` and `folder` are only for the messages.
export function checkEntries({ file, entries, allowed, imageUrls, folder }) {
  const ids = new Set()
  for (const entry of entries) {
    if (ids.has(entry.id)) reportDataError(`${file}: duplicate id "${entry.id}"`)
    ids.add(entry.id)
    for (const [key, values] of Object.entries(allowed)) {
      if (!values.includes(entry[key])) {
        reportDataError(`${file}: "${entry.id}" has an unknown ${key}: ${JSON.stringify(entry[key])}`)
      }
    }
  }
  const usedImages = new Set(entries.map((e) => e.image))
  for (const name of Object.keys(imageUrls)) {
    if (!usedImages.has(name)) console.warn(`${folder}/${name} isn't used by any entry — check the file name.`)
  }
}
