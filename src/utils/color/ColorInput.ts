export default class ColorInput {
    static #instance: ColorInput

    static get instance(): ColorInput {
        return ColorInput.#instance || (ColorInput.#instance = new ColorInput())
    }

    #inputElement: HTMLInputElement | null = null

    createInputElement() {
        this.#inputElement?.remove()
        this.#inputElement = document.createElement('input')
        this.#inputElement.type = 'color'
        this.#inputElement.click()
    }

    addEventListener = (type: string, listener: EventListenerOrEventListenerObject): void =>
        this.#inputElement?.addEventListener(type, listener)
}
