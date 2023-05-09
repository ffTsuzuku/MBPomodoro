enum PlayerStates {
    Unplayed,
    Playing,
    Paused,
    Ended,
}

interface AdvancedAudioPlayerProps {
    src: string
    name?: string
    loop?: boolean
}

class AdvancedAudioPlayer {
    player: HTMLAudioElement
    playCount: number
    state: PlayerStates
    name: string
    constructor({
        src,
        loop = false,
        name,
    }: AdvancedAudioPlayerProps) {
        this.player = new Audio(src)
        this.player.loop = loop
        this.state = PlayerStates.Unplayed
        this.playCount = 0
        this.name = name ?? src
    }

    play() {
        this.state = PlayerStates.Playing
        this.player.play()
    }

    pause() {
        if (
            this.state === PlayerStates.Unplayed ||
            this.state === PlayerStates.Paused
        ) {
            return
        }
        console.log(`Pausing ${this.name}`, this.player)
        this.player.pause()
        this.state = PlayerStates.Paused
    }

    end() {
        this.player.pause()
        this.player.currentTime = 0
        this.state = PlayerStates.Ended
        this.playCount++
    }

    addEventListener(
        type: keyof HTMLMediaElementEventMap,
        callback: () => any
    ) {
        this.player.addEventListener(type, callback)
    }

    setVolume(volume: number) {
        this.player.volume = volume
    }
}

export default AdvancedAudioPlayer

export { PlayerStates }
