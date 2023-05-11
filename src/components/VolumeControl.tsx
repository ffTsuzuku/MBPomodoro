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
    useDisclosure,
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { IconType } from 'react-icons'

import { FiVolume2 } from 'react-icons/fi'
import { BiEqualizer } from 'react-icons/bi'

import AdvancedAudioPlayer from '../utility/advancedAudioPlayer'
import LocalStorageManager from '../utility/storage'

interface AudioSource {
    src: AdvancedAudioPlayer
    icon: IconType
}

interface VolumeControlProps {
    sources: AudioSource[]
}

const VolumeControl = ({ sources }: VolumeControlProps) => {
    const { onOpen, onClose, isOpen } = useDisclosure()

    const storageManager = useRef<LocalStorageManager>(
        new LocalStorageManager()
    )

    const updateVolumeForSource = (
        source: AudioSource,
        volume: number
    ) => {
        if (source.src.name === 'clock') {
            storageManager.current.setClockVolume(volume)
        } else if (source.src.name === 'gong') {
            storageManager.current.setBellVolume(volume)
        }

        source.src.setVolume(volume)
    }

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
                    defaultValue={source.src.getVolume() * 100}
                    orientation='vertical'
                    minH='32'
                    width={'100%'}
                    height={'50px'}
                    marginBottom={'10px'}
                    onChange={(v) =>
                        updateVolumeForSource(source, v / 100)
                    }
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
        <Popover placement='top' onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
                <Flex>
                    <FiVolume2
                        size={'30px'}
                        cursor={'pointer'}
                        color={'white'}
                    />
                </Flex>
            </PopoverTrigger>
            <Portal>
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
            </Portal>
        </Popover>
    )
}

export default VolumeControl

export type { AudioSource }
