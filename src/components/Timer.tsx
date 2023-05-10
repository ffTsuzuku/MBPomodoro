import { useEffect, useState, useRef } from 'react'
import { FiClock } from 'react-icons/fi'
import { GiGong } from 'react-icons/gi'

import AdvancedAudioPlayer, {
    PlayerStates,
} from '../utility/advancedAudioPlayer'

import { Button, Flex, Input } from '@chakra-ui/react'
import { CSSObject } from '@emotion/react'
import VolumeControl, { AudioSource } from '../components/VolumeControl'

import PresetMenu from './PresetMenu'

import { TimeString } from '../utility/time'

interface Preset {
    time: TimeString
    deletable: boolean
}

const Timer = () => {
    enum TimerStates {
        Started,
        Paused,
        Ended,
    }
    const defaultPresets: Preset[] = [
        { time: new TimeString('500'), deletable: false },
        { time: new TimeString('3000'), deletable: false },
    ]
    const [userInput, setUserInput] = useState<TimeString>(
        defaultPresets[0].time
    )
    const [prevUserInput, setPrevUserInput] = useState<TimeString>(
        new TimeString('0')
    )
    const [timer, setTimer] = useState<number>()
    const inputRef = useRef<HTMLInputElement>(null)
    const [timerFocused, setTimerFocused] = useState<boolean>()
    const [timerState, setTimerState] = useState<TimerStates>(TimerStates.Ended)
    const [audioSources, setAudioSources] = useState<AudioSource[]>([])
    const [presets, setPresets] = useState<Preset[]>(defaultPresets)

    const timerInterval = useRef<number | undefined>(undefined)
    const timerRef = useRef<number>()
    const clockPlayer = useRef<AdvancedAudioPlayer>()
    const gongSound = useRef<AdvancedAudioPlayer>()
    const timerStateRef = useRef<TimerStates>(TimerStates.Ended)

    const gongTimestamps = [30]

    const updateTimerState = (state: TimerStates) => {
        setTimerState(state)
        timerStateRef.current = state
    }

    const validateAndSetTime = (time: string) => {
        // remove non numbers
        time = time.replace(/[^0-9]/g, '')
        // Cap it to 6 chars. The 7th char forces the first to be removed
        time = time.length === 7 ? time.slice(1, 7) : time.slice(0, 6)

        setUserInput(new TimeString(time))
    }

    const formatTime = () => {
        if (!userInput) {
            // When you focus the input it clears the user input.
            // So instead we showcase the prevUserInput
            if (prevUserInput.time !== prevUserInput.defaultVal) {
                return prevUserInput.format(!timerFocused)
            }
            return '00h 00m 00s'
        }

        // You're currently editting the time so show the changes.
        if (timerFocused) {
            return userInput.format(false)
        }

        if (timerInterval.current && timerRef.current) {
            let seconds: number | string = timerRef.current
            const hours = Math.floor(seconds / 3600) // Calculate hours
            seconds %= 3600 // Get remaining seconds
            const minutes = Math.floor(seconds / 60) // Calculate minutes
            seconds = (seconds % 60).toString().padStart(2, '0') // Get remaining seconds

            let formatedString = ''
            if (hours) formatedString += `${hours}h `
            if (minutes) formatedString += `${minutes}m `
            formatedString += `${seconds}s`
            return formatedString
        }

        return userInput.format(!timerFocused)
    }

    // puts all audio sources in a paused state
    const pauseAllSFX = () => {
        for (const source of audioSources) {
            source.src.pause()
        }
    }

    // puts all audio sources in the end state
    const endAllSfx = () => {
        for (const source of audioSources) {
            source.src.end()
        }
    }

    // plays the clock audio
    const playTikTokNoise = () => {
        if (
            clockPlayer.current?.state === PlayerStates.Paused ||
            clockPlayer.current?.state === PlayerStates.Unplayed ||
            clockPlayer.current?.state === PlayerStates.Ended
        ) {
            clockPlayer.current?.play()
        }
    }

    // Logic for decrementing the timer
    const countdownTimerCallback = () => {
        if (timerRef.current === 0 || !timerRef.current) {
            endTime()
            return
        }
        setTimer(timerRef.current - 1)
        timerRef.current--
    }

    // sets the timer state and its correspondingref to what the user entered.
    const setTimerToUserInput = () => {
        const [hours, minutes, seconds] = userInput.parseTimeStringIntoNumbers()
        setTimer(hours * 60 * 60 + minutes * 60 + seconds)
        timerRef.current = hours * 60 * 60 + minutes * 60 + seconds
    }

    // logic for begining the timer count down.
    const startTime = () => {
        setTimerToUserInput()
        if (timerRef.current === 0) {
            return
        }
        updateTimerState(TimerStates.Started)

        const handler = setInterval(countdownTimerCallback, 1000)
        playTikTokNoise()
        timerInterval.current = handler
    }

    // Logic for when the timer drops to 0.
    const endTime = () => {
        const handler = timerInterval.current
        clearInterval(handler)
        updateTimerState(TimerStates.Ended)
        timerInterval.current = undefined
        endAllSfx()
    }

    const pauseTime = () => {
        pauseAllSFX()
        const handler = timerInterval.current
        clearInterval(handler)
        updateTimerState(TimerStates.Paused)
    }

    const unPauseTime = () => {
        updateTimerState(TimerStates.Started)

        const handler = setInterval(countdownTimerCallback, 1000)
        timerInterval.current = handler
        playTikTokNoise()
    }

    const resetTime = () => {
        pauseAllSFX()
        const handler = timerInterval.current
        clearInterval(handler)
        setTimerToUserInput()
        updateTimerState(TimerStates.Ended)
    }

    const startTimeIfEntered = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            startTime()
        }
    }

    const onFocusInput = () => {
        setPrevUserInput(userInput)
        setTimerFocused(true)
        setUserInput(new TimeString('0'))
        if (timerInterval.current) {
            pauseTime()
        }
    }

    const onBlurInput = () => {
        // If they exited the input without making changes revert
        // to what it used to be.
        if (userInput.time === userInput.defaultVal) {
            setUserInput(prevUserInput)
            setPrevUserInput(new TimeString('0'))

            // This mean the timer was running before we focused
            // To start it again.
            if (timerInterval.current) {
                unPauseTime()
            }
        } else if (userInput) {
            // Time was changed, end current count down.
            endTime()
        }
        setTimerFocused(false)
    }

    const applyPreset = (preset: Preset) => {
        endTime()
        setUserInput(new TimeString(preset.time.time))
    }

    const timerBtnStyles: CSSObject = {
        marginLeft: '20px',
    }
    // Disabled styles
    if (formatTime() == '00h 00m 00s') {
        timerBtnStyles.backgroundColor = 'gray'
        timerBtnStyles.cursor = 'default'
        timerBtnStyles.color = 'white'
    }
    let ButtonsJSX = (
        <Flex w={'100%'} justifyContent={'center'}>
            <Button onClick={startTime} style={timerBtnStyles}>
                {'Start'}
            </Button>
        </Flex>
    )
    if (timerState === TimerStates.Started) {
        ButtonsJSX = (
            <Flex w={'100%'} justifyContent={'center'}>
                <Button onClick={pauseTime} style={timerBtnStyles}>
                    {'Pause'}
                </Button>
                <Button onClick={resetTime} style={timerBtnStyles}>
                    {'Reset'}
                </Button>
            </Flex>
        )
    } else if (timerState === TimerStates.Paused && userInput) {
        ButtonsJSX = (
            <Flex w={'100%'} justifyContent={'center'}>
                <Button onClick={unPauseTime} style={timerBtnStyles}>
                    {'Resume'}
                </Button>
                <Button onClick={resetTime} style={timerBtnStyles}>
                    {'Reset'}
                </Button>
            </Flex>
        )
    }

    // set up all audio
    useEffect(() => {
        const url = '/clock.mp3'
        const audioPlayer = new AdvancedAudioPlayer({
            src: './clock.mp3',
            loop: true,
        })
        const gongPlayer = new AdvancedAudioPlayer({
            src: './gong.mp3',
        })
        clockPlayer.current = audioPlayer
        gongSound.current = gongPlayer

        // If someone presses pause on their bluetooth headphones
        // The timer should pause also.
        clockPlayer.current.addEventListener('pause', () => {
            // pauseTime()
            if (timerStateRef?.current === TimerStates.Started) {
                //console.log('pause')
                pauseTime()
            }
        })
        clockPlayer.current.addEventListener('play', () => {
            //pauseTime()
            if (timerStateRef?.current === TimerStates.Paused) {
                unPauseTime()
            }
        })

        setAudioSources([
            { src: audioPlayer, icon: FiClock },
            { src: gongPlayer, icon: GiGong },
        ])
    }, [])

    // play gong on the specified intervals
    useEffect(() => {
        setInterval(() => {
            if (
                (timerRef.current &&
                    gongTimestamps.includes(timerRef.current) &&
                    timerStateRef.current === TimerStates.Started) ||
                (timerStateRef.current === TimerStates.Started &&
                    gongSound.current?.state === PlayerStates.Paused)
            ) {
                gongSound.current?.play()
            }
        })
    })

    return (
        <Flex
            alignContent={'space-between'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'100%'}
            h={'100%'}
            wrap='wrap'
        >
            <Input
                onFocus={onFocusInput}
                onBlur={onBlurInput}
                onChange={(e) => validateAndSetTime(e.target.value)}
                onKeyDown={(e) => startTimeIfEntered(e)}
                variant='unstyled'
                value={userInput.time}
                ref={inputRef}
                w={'1px'}
                h={'1px'}
            />
            <Flex
                w={'100%'}
                justifyContent='center'
                fontSize={'5xl'}
                color={timerFocused ? 'gray.600' : 'gray.200'}
                onClick={() => inputRef?.current?.focus()}
            >
                {formatTime()}
                <span className='blinkMe'>{timerFocused ? '|' : ''}</span>
            </Flex>
            {ButtonsJSX}
            <Flex
                alignItems={'center'}
                justifyContent={'flex-end'}
                w={'100%'}
                mr={5}
                mb={5}
            >
                <PresetMenu
                    presets={presets}
                    onSelect={applyPreset}
                    updatePresets={setPresets}
                />
                <VolumeControl sources={audioSources} />
            </Flex>
        </Flex>
    )
}

export default Timer

export type { Preset }
