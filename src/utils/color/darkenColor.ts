const darkenColor = (color: number, percent: number): number => {
    const factor = 1 - percent / 100

    const r = ((color >> 16) & 0xFF) * factor
    const g = ((color >> 8) & 0xFF) * factor
    const b = (color & 0xFF) * factor

    return (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)
}

export default darkenColor