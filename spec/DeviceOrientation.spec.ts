import { DeviceOrientation } from "../src"

describe("DeviceOrientation", () => {
  const useDeviceOrientation = DeviceOrientation.useDeviceOrientation

  describe("isSupported", () => {
    it("", () => {
      expect(useDeviceOrientation().isSupported()).toBeFalsy()
    })
  })

  describe("permission", () => {
    it("", () => {
      expect(useDeviceOrientation().permission()).toBeFalsy()
    })
  })

  describe("requestPermission", () => {
    describe("granted", () => {
      beforeEach(() => {
        const o = {} as typeof window.DeviceOrientationEvent
        o.requestPermission = jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve("granted"))
        window.DeviceOrientationEvent = o
        window.ontouchstart = () => {}
      })

      afterEach(() => {
        delete window["DeviceOrientationEvent"]
        delete window["ontouchstart"]
      })

      it("", (done) => {
        useDeviceOrientation()
          .requestPermission()
          .then((permitted) => {
            try {
              expect(permitted.isSupported()).toBeTruthy()
              expect(permitted.permission()).toBeTruthy()
            } catch (e) {
              done(e)
            }

            done()
          })
          .catch((reason) => {
            done(reason || "error")
          })
      })

      it("bind", (done) => {
        useDeviceOrientation()
          .requestPermission()
          .then((permitted) => {
            permitted.bind((e) => {
              done()
            })

            window.dispatchEvent(new Event("deviceorientation"))
          })
          .catch((reason) => {
            done(reason || "error")
          })
      })

      it("unbind", (done) => {
        useDeviceOrientation()
          .requestPermission()
          .then((permitted) => {
            let called = 0

            permitted.bind((e) => {
              called++
              permitted.unbind()
            })

            try {
              expect(called).toBe(0)
              window.dispatchEvent(new Event("deviceorientation"))
              expect(called).toBe(1)
              window.dispatchEvent(new Event("deviceorientation"))
              expect(called).toBe(1)
              done()
            } catch (e) {
              done(e)
            }
          })
          .catch((reason) => {
            done(reason || "error")
          })
      })
    })

    describe("undefined requestPermission", () => {
      beforeEach(() => {
        window.DeviceOrientationEvent =
          {} as typeof window.DeviceOrientationEvent
        window.ontouchstart = () => {}
      })

      afterEach(() => {
        delete window["DeviceOrientationEvent"]
        delete window["ontouchstart"]
      })

      it("", (done) => {
        useDeviceOrientation()
          .requestPermission()
          .then((permitted) => {
            done()
          })
          .catch((reason) => {
            done(reason || "error")
          })
      })
    })

    it("error occured", (done) => {
      useDeviceOrientation()
        .requestPermission()
        .then((permitted) => {
          done("not error occured")
        })
        .catch((reason) => {
          done()
        })
    })
  })
})
