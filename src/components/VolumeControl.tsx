import {
    Box,
    Button,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { IconType } from 'react-icons'

import { FiVolume2 } from 'react-icons/fi'
import { BiEqualizer } from 'react-icons/bi'

import AdvancedAudioPlayer from '../utility/advancedAudioPlayer'

interface AudioSource {
    src: AdvancedAudioPlayer
    icon: IconType
}

interface VolumeControlProps {
    sources: AudioSource[]
}

const VolumeControl = ({ sources }: VolumeControlProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const sourceJSX = sources.map((source) => {
        return (
            <Flex
                wrap={'wrap'}
                justifyContent={'center'}
                w={'30px'}
                key={source.src.name}
            >
                <Slider
                    aria-label='slider-ex-3'
                    defaultValue={100}
                    orientation='vertical'
                    minH='32'
                    width={'100%'}
                    height={'50px'}
                    marginBottom={'10px'}
                    onChange={(v) => source.src.setVolume(v / 100)}
                >
                    <SliderTrack bg='blue.200'>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={7}>
                        <Box color='blue.500' as={BiEqualizer} />
                    </SliderThumb>
                </Slider>
                <source.icon size={'25px'} />
            </Flex>
        )
    })

    return (
        <Popover placement='top'>
            <PopoverTrigger>
                <Flex>
                    <FiVolume2
                        size={'30px'}
                        cursor={'pointer'}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </Flex>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody
                    display={'flex'}
                    height={'200px'}
                    alignItems={'flex-end'}
                    justifyContent={'space-around'}
                >
                    {sourceJSX}
                </PopoverBody>
                <PopoverFooter
                    textAlign={'center'}
                    fontWeight={'bold'}
                    color={'blue.300'}
                >
                    Volume Control
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    )
}

export default VolumeControl

export type { AudioSource }
