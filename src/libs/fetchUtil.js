async function getTask(url) {
    try {
        const data = await fetch(url)
        const items = await data.json()
        console.log(items)
        return items
      } catch (error) {
        console.log(`error: ${error}`)
      }
}

export {getTask};