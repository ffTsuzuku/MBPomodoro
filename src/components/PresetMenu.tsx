import {
    Flex,
    HStack,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverTrigger,
    Portal,
    VStack,
} from '@chakra-ui/react'
import { MdOutlineSchedule } from 'react-icons/md'

import { formatUserInput } from '../utility/time'

interface PresetMenuInterface {
    presets: string[]
    onSelect: (preset: string) => any
}
const PresetMenu = ({ presets, onSelect }: PresetMenuInterface) => {
    const PresetOptionsJSX = presets.map((preset) => {
        return (
            <Flex onClick={() => onSelect(preset)} cursor={'pointer'}>
                {formatUserInput(preset, true)}
            </Flex>
        )
    })
    return (
        <Popover placement='top'>
            <PopoverTrigger>
                <Flex mr={3}>
                    <MdOutlineSchedule
                        size={'28px'}
                        color={'white'}
                        cursor={'pointer'}
                    />
                </Flex>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <VStack p={3}>{PresetOptionsJSX}</VStack>
                    </PopoverBody>
                    <PopoverFooter
                        textAlign={'center'}
                        color={'blue.300'}
                        fontWeight={'bold'}
                    >
                        Presets
                    </PopoverFooter>
                </PopoverContent>
            </Portal>
        </Popover>
    )
}

export default PresetMenu
