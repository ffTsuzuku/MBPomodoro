import './App.css'
import { Button, Flex, Input } from '@chakra-ui/react'
import Timer from './components/Timer'
import './App.css'

function App() {
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
                    bgColor={'gray.900'}
                    wrap={'wrap'}
                >
                    <Timer />
                </Flex>
            </Flex>
        </div>
    )
}

export default App
