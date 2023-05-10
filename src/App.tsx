import './App.css'
import { Box, Button, Flex, Grid, Input, Text } from '@chakra-ui/react'
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
                overflow={'hidden'}
            >
                <Grid
                    justifyContent={'center'}
                    alignItems={'center'}
                    w={'50%'}
                    h={'50%'}
                    shadow={'2xl'}
                    borderRadius={'10px'}
                    bgColor={'gray.900'}
                    gridTemplateRows={'1fr 5fr'}
                    gridTemplateColumns={'1fr'}
                    overflow={'hidden'}
                >
                    <Text
                        color={'whiteAlpha.700'}
                        fontSize={'30px'}
                        pt={5}
                        textAlign={'center'}
                    >
                        {'MBPomodoro'}
                    </Text>

                    <Timer />
                </Grid>
            </Flex>
        </div>
    )
}

export default App
