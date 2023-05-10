const formatUserInput = (userInput: string, removeUnusedHoursAndMins = false) => {
    if (!removeUnusedHoursAndMins) {
        const time = userInput.padStart(6, '0')
        const hours = time.slice(0, 2) || '00'
        const mins = time.slice(2, 4) || '00'
        const secs = time.slice(4, 6) || '00'
        return `${hours}h ${mins}m ${secs}s`
    }

    let fromatedString = ''
    const [hours, minutes, seconds] = parseUserInputIntoNumbers(
        userInput
    )

    if (hours) fromatedString += `${hours}h `
    if (minutes) fromatedString += `${minutes}m `
    fromatedString += `${seconds.toString().padStart(2, '0')}s`

    return fromatedString
}

// convert what the user types in to [hours, mins, secods]
const parseUserInputIntoNumbers = (userInput: string): [
    number,
    number,
    number
] => {
    if (!userInput) return [0, 0, 0]
    const time = userInput.padStart(6, '0')

    let secsAsNumber = parseInt(time.slice(4, 6) || '0')
    let minsAsNumber = parseInt(time.slice(2, 4) || '0')
    let hoursAsNumber = parseInt(time.slice(0, 2) || '0')

    const secsOverflow = Math.floor(secsAsNumber / 60)
    const secsRemainder = secsAsNumber % 60
    secsAsNumber = secsRemainder
    minsAsNumber = minsAsNumber + secsOverflow

    const minsOverflow = Math.floor(minsAsNumber / 60)
    const minsRemainder = minsAsNumber % 60
    minsAsNumber = minsRemainder
    hoursAsNumber = hoursAsNumber + minsOverflow

    return [hoursAsNumber, minsAsNumber, secsAsNumber]
}

export {
    formatUserInput,
    parseUserInputIntoNumbers
}