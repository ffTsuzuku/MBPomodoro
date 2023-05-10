import { Flex, HStack, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverTrigger, Portal } from '@chakra-ui/react'
import { MdOutlineSchedule } from 'react-icons/md'

import { formatUserInput } from '../utility/time'

interface PresetMenuInterface {
    presets: string[],
    onSelect: (preset: string) => any
}
const PresetMenu = ({ presets, onSelect }: PresetMenuInterface) => {
    const PresetOptionsJSX = presets.map(preset => {
        return <Flex>{formatUserInput(preset)}</Flex>
    })
    return <Popover placement='top'>
        <PopoverTrigger>
            <Flex>
                <MdOutlineSchedule size={'30px'} color={'white'}/>
            </Flex>
        </PopoverTrigger>
        <Portal>
            <PopoverContent>
            <PopoverCloseButton />
            <PopoverBody>
                <HStack>
                    {PresetOptionsJSX}
                </HStack>
            </PopoverBody>
            <PopoverFooter>Presets</PopoverFooter>
            </PopoverContent>
        </Portal>
    </Popover>
}

export default PresetMenu