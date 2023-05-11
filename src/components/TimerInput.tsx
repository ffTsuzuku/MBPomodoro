import { Input } from '@chakra-ui/input'
import { Flex } from '@chakra-ui/layout'
import {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
    ForwardedRef,
} from 'react'
import { TimeString } from '../utility/time'

interface TimerInputProps {
    userInput: TimeString
    updateUserInput: (time: TimeString) => any
    prevUserInput: TimeString
    updatePrevUserInput: (time: TimeString) => any
    liveValue?: number
    onFocusInput?: () => any
    onBlurInput?: () => any
    onKeyDown?: (e: React.KeyboardEvent) => any
}

export interface TimerInputRef {
    focusInput: () => void
    elem: React.RefObject<HTMLInputElement>
}
const TimerInput = forwardRef<TimerInputRef, TimerInputProps>(
    (
        {
            userInput,
            updateUserInput,
            prevUserInput,
            updatePrevUserInput,
            liveValue,
            onBlurInput,
            onFocusInput,
            onKeyDown,
        }: TimerInputProps,
        ref: ForwardedRef<TimerInputRef>
    ) => {
        const [inputFocused, setInputFocused] =
            useState<boolean>(false)
        const inputRef = useRef<HTMLInputElement>(null)

        const validateAndSetTime = (time: string) => {
            // remove non numbers
            time = time.replace(/[^0-9]/g, '')
            // Cap it to 6 chars. The 7th char forces the first to be removed
            time =
                time.length === 7
                    ? time.slice(1, 7)
                    : time.slice(0, 6)

            updateUserInput(new TimeString(time))
        }

        const formatTime = () => {
            if (!userInput) {
                // When you focus the input it clears the user input.
                // So instead we showcase the prevUserInput
                if (prevUserInput.time !== prevUserInput.defaultVal) {
                    return prevUserInput.format(!inputFocused)
                }
                return '00h 00m 00s'
            }

            // You're currently editting the time so show the changes.
            if (inputFocused) {
                return userInput.format(false)
            }

            if (liveValue) {
                let seconds: number | string = liveValue
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

            return userInput.format(!inputFocused)
        }

        const focusInput = () => {
            setInputFocused(true)
            onFocusInput?.()
        }

        const unFocusInput = () => {
            setInputFocused(false)
            onBlurInput?.()
        }

        useImperativeHandle(
            ref,
            () => ({
                focusInput: () => {
                    setInputFocused(true)
                    inputRef.current?.focus()
                    onFocusInput?.()
                },
                elem: inputRef,
            }),
            [onFocusInput]
        )

        return (
            <>
                <Input
                    onFocus={focusInput}
                    onBlur={unFocusInput}
                    onChange={(e) =>
                        validateAndSetTime(e.target.value)
                    }
                    onKeyDown={onKeyDown}
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
                    color={inputFocused ? 'gray.600' : 'gray.200'}
                    onClick={() => inputRef?.current?.focus()}
                >
                    {formatTime()}
                    <span className='blinkMe'>
                        {inputFocused ? '|' : ''}
                    </span>
                </Flex>
            </>
        )
    }
)

export default TimerInput
