import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Flex, Input } from '@chakra-ui/react'

function App() {
    const [timer, setTimer] = useState<string>('')
    const [timerFocused, setTimerFocused] = useState<boolean>()

    const validateAndSetTime = (time: string) => {
        if (time.length > 6) {
            time = time.charAt(time.length - 1)
        }

        setTimer(time)
    }

    const formatTime = () => {
        let hours = '00'
        let minutes = '00'
        let seconds = '00'
        if (timer.length <= 2 && timer.length !== 0) {
            seconds = `${timer[0] ?? '0'}${timer[1] ?? '0'}`
            console.log(seconds, 'sec')
            console.log('timer', timer)
        } else if (timer.length > 2 && timer.length <= 4) {
            seconds = `${timer[0] ?? '0'}${timer[1] ?? '0'}`
            minutes = `${timer[2] ?? '0'}${timer[3] ?? '0'}`
        } else if (timer.length > 4 && timer.length <= 6) {
            seconds = `${timer[0] ?? '0'}${timer[1] ?? '0'}`
            minutes = `${timer[2] ?? '0'}${timer[3] ?? '0'}`
            hours = `${timer[4] ?? '0'}${timer[5] ?? '0'}`
        }
        console.log(`${hours}H ${minutes}M ${seconds}S`)
        return `${hours}H ${minutes}M ${seconds}S`
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
                        justifyContent={'center'}
                        alignItems={'center'}
                        border={'10px solid white'}
                        w={'70%'}
                        h={'70%'}
                        borderRadius={'10px'}
                    >
                        <Input
                            onFocus={() => {
                                setTimerFocused(true)
                            }}
                            onBlur={() => setTimerFocused(false)}
                            dir={'rtl'}
                            onChange={(e) =>
                                validateAndSetTime(e.target.value)
                            }
                            color={'gray.600'}
                            fontSize={'3em'}
                            textAlign={'center'}
                            variant='unstyled'
                            value={formatTime()}
                            placeholder='00H 00M 00S'
                        />
                    </Flex>
                </Flex>
            </Flex>
        </div>
    )
}

export default App
