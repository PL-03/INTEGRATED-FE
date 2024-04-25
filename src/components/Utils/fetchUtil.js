async function getTask(url) {
    try{
    const data = await fetch(url)
    const tasks = await data.json()
    return tasks
    } catch(error){
        console.error(`Error fetching Tasks: , ${error}`);
    }
}

export {getTask};