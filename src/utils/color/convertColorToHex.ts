
const convertColorToHex = (color: string): number | null => {
    // Check if the color has either 3 or 6 hexadecimal characters
    if (!color.startsWith('#') ||
        (color.length !== 7 && color.length !== 4)) return null

    const hexColor = color.slice(1)

    return parseInt(hexColor, 16)
}

export default convertColorToHex