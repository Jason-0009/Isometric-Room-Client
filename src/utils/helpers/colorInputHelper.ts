import ColorInput from '@utils/color/ColorInput'
import convertColorToHex from '@utils/color/convertColorToHex'

const createColorInput = (callback: (hexColor: number) => void): void => {
    const colorInput = ColorInput.instance

    colorInput.createInputElement()

    colorInput.addEventListener('input', (event) => {
        const color = (event.target as HTMLInputElement).value
        const hexColor = convertColorToHex(color)

        if (!hexColor) return

        callback(hexColor)
    })
}

export default createColorInput
