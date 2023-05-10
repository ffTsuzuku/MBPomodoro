class TimeString {
    readonly time: string
    readonly passed: boolean
    readonly defaultVal = '000000'

    constructor(time: string) {
        const numberRegex = /^\d+$/ // Matches one or more digits from start to end of string
        const passed = numberRegex.test(time) && time.length <= 6
        this.passed = passed
        this.time = passed ? time.padStart(6, '0') : this.defaultVal
    }

    format(removeUnusedHoursAndMins: boolean): string {
        if (!removeUnusedHoursAndMins) {
            const time = this.time
            const hours = time.slice(0, 2) || '00'
            const mins = time.slice(2, 4) || '00'
            const secs = time.slice(4, 6) || '00'
            return `${hours}h ${mins}m ${secs}s`
        }

        let fromatedString = ''
        const [hours, minutes, seconds] = this.parseTimeStringIntoNumbers()

        if (hours) fromatedString += `${hours}h `
        if (minutes) fromatedString += `${minutes}m `
        fromatedString += `${seconds.toString().padStart(2, '0')}s`

        return fromatedString
    }

    parseTimeStringIntoNumbers() {
        const time = this.time
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
}

export { TimeString }
