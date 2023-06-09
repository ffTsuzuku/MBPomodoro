import { Preset } from '../components/Timer'
import { defaultPresets } from '../components/Timer'
import { TimeString } from './time'

class LocalStorageManager {
    constructor() {
        // if missing init presets.
        if (!localStorage.getItem('presets')) {
            localStorage.setItem('presets', JSON.stringify(defaultPresets))
        }

        // if missing clock volume setting
        if (!localStorage.getItem('clockVolume')) {
            localStorage.setItem('clockVolume', '1')
        }

        // if missing bell volume setting
        if (!localStorage.getItem('bellVolume')) {
            localStorage.setItem('bellVolume', '1')
        }
    }

    static fetchPresets(): Preset[] {
        const savedPresets = localStorage.getItem('presets')
        const presets = savedPresets ? JSON.parse(savedPresets) : defaultPresets
        return presets.map((preset: Preset) => {
            preset.time = new TimeString(preset.time.time)
            return preset
        })
    }

    static fetchClockVolume(): number {
        return parseFloat(localStorage.getItem('clockVolume') ?? '100')
    }

    static fetchBellVolume(): number {
        return parseFloat(localStorage.getItem('bellVolume') ?? '100')
    }

    setClockVolume(volume: number) {
        localStorage.setItem('clockVolume', volume.toString())
    }

    setBellVolume(volume: number) {
        localStorage.setItem('bellVolume', volume.toString())
    }

    setPresets(presets: Preset[]) {
        localStorage.setItem('presets', JSON.stringify(presets))
    }
}

export default LocalStorageManager
