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
import { useState } from 'react'
import { MdOutlineSchedule } from 'react-icons/md'
import { TimeString } from '../utility/time'
import { Preset } from './Timer'
import TimerInput from './TimerInput'

interface PresetMenuInterface {
    presets: Preset[]
    onSelect: (preset: Preset) => any
    updatePresets: (presets: Preset[]) => any
}
const PresetMenu = ({
    presets,
    onSelect,
    updatePresets,
}: PresetMenuInterface) => {
    const [newPreset, setNewPreset] = useState<TimeString>(new TimeString('0'))
    const [prevNewPreset, setPrevNewPreset] = useState<TimeString>(
        new TimeString('0')
    )

    const PresetOptionsJSX = presets.map((preset) => {
        return (
            <Flex
                onClick={() => onSelect(preset)}
                cursor={'pointer'}
                key={preset.time.time}
            >
                {preset.time.format(true)}
            </Flex>
        )
    })

    const onSubmitPresetVal = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const exist =
                presets.filter((preset) => preset.time.time === newPreset.time)
                    .length > 0
            if (exist) return
            updatePresets([...presets, { time: newPreset, deletable: true }])
            setNewPreset(new TimeString('0'))
        }
    }

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
                        <TimerInput
                            userInput={newPreset}
                            updateUserInput={setNewPreset}
                            prevUserInput={prevNewPreset}
                            updatePrevUserInput={setPrevNewPreset}
                            onKeyDown={onSubmitPresetVal}
                        />
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
