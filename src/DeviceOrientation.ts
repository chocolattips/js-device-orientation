export interface IDeviceOrientationParam {
  alpha: number
  beta: number
  gamma: number
  original: DeviceOrientationEvent
}

export interface IDeviceOrientationHandler {
  (param: IDeviceOrientationParam): void
}

export interface IdeviceOrientationPermitted {
  isSupported(): boolean
  permission(): boolean
  bind(handler: IDeviceOrientationHandler): void
  unbind(): void
}

export function useDeviceOrientation() {
  const state = {
    handler: null as IDeviceOrientationHandler | null,
    permission: false,
    doneRequestPermission: false,
  }

  const self = {
    isSupported,
    permission,
    requestPermission,
  }

  const selfForPermitted: IdeviceOrientationPermitted = {
    isSupported,
    permission,
    bind,
    unbind,
  }

  function isSupported() {
    return !!window.DeviceOrientationEvent && "ontouchstart" in window
  }

  function permission() {
    return state.permission
  }

  function requestPermission() {
    return new Promise<IdeviceOrientationPermitted>((resolve, reject) => {
      state.doneRequestPermission = true

      if (!isSupported()) {
        return reject("not supported")
      }

      if (DeviceOrientationEvent.requestPermission) {
        DeviceOrientationEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === "granted") {
              state.permission = true
              return resolve(selfForPermitted)
            }

            return reject(permissionState)
          })
          .catch((e) => {
            return reject(e)
          })
      } else {
        state.permission = true
        return resolve(selfForPermitted)
      }
    })
  }

  function bind(handler: IDeviceOrientationHandler) {
    if (state.handler) {
      console.warn("* already set")
      return
    }

    if (!state.doneRequestPermission) {
      console.warn("* call requestPermission before")
      return
    }

    if (!state.permission) {
      console.warn(`* permission : ${state.permission}`)
      return
    }

    state.handler = handler
    window.addEventListener("deviceorientation", onDeviceOrientation)
  }

  function unbind() {
    state.handler = null
    window.removeEventListener("deviceorientation", onDeviceOrientation)
  }

  function onDeviceOrientation(e: DeviceOrientationEvent) {
    const o = {
      beta: e.beta || 0,
      gamma: e.gamma || 0,
      alpha: e.alpha || 0,
      original: e,
    }

    if (state.handler) {
      state.handler(o)
    }
  }

  return self
}
