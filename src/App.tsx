import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Flex, Input } from '@chakra-ui/react'

function App() {
    const [userInput, setUserInput] = useState<string>()
    const [countdown, setCountDown] = useState<number>()
    const inputRef = useRef<HTMLInputElement>(null)
    const [timerFocused, setTimerFocused] = useState<boolean>()
    const [timerStarted, setTimerStarted] = useState(false)

    const timerInterval = useRef<number>()

    const validateAndSetTime = (time: string) => {
        // remove non numbers
        time = time.replace(/[^0-9]/g, '')
        // Cap it to 6 chars. The 7th char triggers reset.
        time = time.slice(0, 6)

        setUserInput(time)
    }

    const formatTime = () => {
        if (!userInput) return '00h 00m 00s'
        const time = userInput.padStart(6, '0')
        const hours = time.slice(0, 2) || '00'
        const mins = time.slice(2, 4) || '00'
        const secs = time.slice(4, 6) || '00'

        const [hoursAsNumber, minsAsNumber, secsAsNumber] =
            parseUserInputIntoNumbers()

        if (timerFocused) return `${hours}h ${mins}m ${secs}s`

        return `${hoursAsNumber}h ${minsAsNumber}m ${secsAsNumber}s`
    }

    const parseUserInputIntoNumbers = () => {
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

    const startTime = () => {
        setTimerStarted(true)

        const handler = setInterval(() => console.log('tick tok'))
        timerInterval.current = handler
    }

    const endTime = () => {
        const handler = timerInterval.current
        clearInterval(handler)
        setTimerStarted(false)
    }
    return (
        <div className='App'>
            <Flex
                bgColor={'blackAlpha.800'}
                w={'100vw'}
                h={'100vh'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Flex
                    justifyContent={'center'}
                    alignItems={'center'}
                    w={'50%'}
                    h={'50%'}
                    shadow={'2xl'}
                    borderRadius={'10px'}
                    bgColor={'pink.100'}
                >
                    <Flex
                        alignContent={'center'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        border={'10px solid white'}
                        w={'70%'}
                        h={'70%'}
                        borderRadius={'10px'}
                        wrap='wrap'
                    >
                        <Input
                            onFocus={() => setTimerFocused(true)}
                            onBlur={() => setTimerFocused(false)}
                            onChange={(e) =>
                                validateAndSetTime(e.target.value)
                            }
                            variant='unstyled'
                            value={userInput}
                            ref={inputRef}
                            w={'1px'}
                            h={'1px'}
                        />
                        <Flex
                            w={'100%'}
                            justifyContent='center'
                            fontSize={'5xl'}
                            color={'gray.600'}
                            onClick={() => inputRef?.current?.focus()}
                        >
                            {formatTime()}
                            <span className='blinkMe'>
                                {timerFocused ? '|' : ''}
                            </span>
                        </Flex>
                    </Flex>
                </Flex>
                <Button
                    onClick={
                        timerStarted
                            ? () => endTime()
                            : () => startTime()
                    }
                >
                    {timerStarted ? 'Stop' : 'Start'}
                </Button>
            </Flex>
        </div>
    )
}

export default App
