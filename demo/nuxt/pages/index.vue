<template>
  <div>
    <button @click="onClick">request permission</button>
    <p v-if="hasDeviceOrientation">
      {{ deviceOrientationValueString }}
    </p>
    <p v-if="hasError">Error : {{ error }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "@nuxtjs/composition-api"

import { DeviceOrientation } from "js-device-orientation/dist"

export default defineComponent({
  setup() {
    const state = reactive({
      deviceOrientation: {
        alpha: 0,
        beta: 0,
        gamma: 0
      },
      error: {
        message: ""
      }
    })

    const d = state.deviceOrientation
    const hasError = computed(() => state.error.message)
    const hasDeviceOrientation = computed(
      () => d.alpha != 0 || d.beta != 0 || d.gamma != 0
    )
    const deviceOrientationValueString = computed(
      () => `alpha:${d.alpha}, beta:${d.beta}, gamma;${d.gamma}`
    )

    function onClick() {
      DeviceOrientation.useDeviceOrientation()
        .requestPermission()
        .then(permitted => {
          permitted.bind(e => {
            state.deviceOrientation = {
              alpha: e.alpha,
              beta: e.beta,
              gamma: e.gamma
            }
          })
        })
        .catch(reason => {
          console.warn("* error : " + reason)
          state.error.message = reason
        })
    }

    return {
      onClick,
      hasError,
      hasDeviceOrientation,
      deviceOrientationValueString
    }
  }
})
</script>
