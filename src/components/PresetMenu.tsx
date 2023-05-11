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
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineSchedule, MdRemove } from 'react-icons/md'
import { TimeString } from '../utility/time'
import { Preset } from './Timer'
import TimerInput, { TimerInputRef } from './TimerInput'

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
    const [newPreset, setNewPreset] = useState<TimeString>(
        new TimeString('0')
    )
    const [prevNewPreset, setPrevNewPreset] = useState<TimeString>(
        new TimeString('0')
    )
    const { onOpen, onClose, isOpen } = useDisclosure()

    const inputRef = useRef<TimerInputRef>(null)

    const onSubmitPresetVal = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const exist =
                presets.filter(
                    (preset) => preset.time.time === newPreset.time
                ).length > 0
            if (exist) return
            updatePresets([
                ...presets,
                { time: newPreset, deletable: true },
            ])
            setNewPreset(new TimeString('0'))
        }
    }

    const onDeletePreset = (preset: Preset) => {
        const newSet = presets.filter((currPreset) => {
            return preset.time.time !== currPreset.time.time
        })

        updatePresets(newSet)
    }

    const PresetOptionsJSX = presets.map((preset) => {
        const removeJSX = preset.deletable ? (
            <MdRemove
                color={'#171923'}
                onClick={() => onDeletePreset(preset)}
            />
        ) : (
            <></>
        )
        return (
            <Flex
                justifyContent={'space-between'}
                cursor={'pointer'}
                key={preset.time.time}
                w={'100%'}
            >
                <Text onClick={() => onSelect(preset)}>
                    {preset.time.format(true)}
                </Text>
                {removeJSX}
            </Flex>
        )
    })

    const closeMenu = () => {
        onClose()
        setNewPreset(new TimeString('0'))
    }

    const openMenu = () => {
        onOpen()
        inputRef.current?.focusInput()
    }

    return (
        <Popover
            isOpen={isOpen}
            placement='top'
            initialFocusRef={inputRef.current?.elem}
            onOpen={openMenu}
            onClose={closeMenu}
        >
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
                        <VStack
                            overflowX={'hidden'}
                            overflowY={'auto'}
                            h={'200px'}
                            px={3}
                            className={'scrollbar1'}
                            mt={'30px'}
                        >
                            {PresetOptionsJSX}
                        </VStack>
                        <TimerInput
                            userInput={newPreset}
                            updateUserInput={setNewPreset}
                            prevUserInput={prevNewPreset}
                            updatePrevUserInput={setPrevNewPreset}
                            onKeyDown={onSubmitPresetVal}
                            ref={inputRef}
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
