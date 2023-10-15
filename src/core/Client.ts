import { Application, IApplicationOptions } from 'pixi.js'

import Scene from '@core/Scene'

export default class Client {
  readonly #application: Application
  readonly #scene: Scene

  constructor() {
    this.#application = new Application(this.#applicationOptions)

    this.#appendViewToDOM()

    this.#scene = new Scene(this.#application)

    this.#setupEventListeners()
  }

  get #applicationOptions(): Partial<IApplicationOptions> {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    }
  }

  #appendViewToDOM = () =>
    document.body.appendChild(this.#application.view as HTMLCanvasElement)

  #setupEventListeners() {
    window.addEventListener('resize', this.#handleWindowResize.bind(this))
    window.addEventListener('contextmenu', (event: MouseEvent) => event.preventDefault())
  }

  #handleWindowResize() {
    const { innerWidth, innerHeight } = window

    this.#application.renderer.resize(innerWidth, innerHeight)

    this.#scene.centerStage()
  }
}
