import {
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
import { useEffect } from 'react'
import { IconType } from 'react-icons'

import { FiClock, FiVolume2 } from 'react-icons/fi'

import AdvancedAudioPlayer from '../utility/advancedAudioPlayer'

interface AudioSource {
    src: AdvancedAudioPlayer
    icon: IconType
}

interface VolumeControlProps {
    sources: AudioSource[]
}

const VolumeControl = ({ sources }: VolumeControlProps) => {
    const { isOpen, onToggle, onClose } = useDisclosure()

    const sourceJSX = sources.map((source) => {
        return (
            <Flex wrap={'wrap'} justifyContent={'center'} w={'30px'}>
                <Slider
                    aria-label='slider-ex-3'
                    defaultValue={100}
                    orientation='vertical'
                    minH='32'
                    width={'100%'}
                    marginBottom={'10px'}
                    onChange={(v) => source.src.setVolume(v / 100)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <source.icon />
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
                        onClick={onToggle}
                    />
                </Flex>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody display={'flex'}>
                    {sourceJSX}
                </PopoverBody>
                <PopoverFooter>Volume Control</PopoverFooter>
            </PopoverContent>
        </Popover>
    )
}

export default VolumeControl

export type { AudioSource }
