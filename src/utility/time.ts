const formatUserInput = (userInput: string) => {
    const time = userInput.padStart(6, '0')
    const hours = time.slice(0, 2) || '00'
    const mins = time.slice(2, 4) || '00'
    const secs = time.slice(4, 6) || '00'

    return `${hours}h ${mins}m ${secs}s`
}

export {
    formatUserInput
}