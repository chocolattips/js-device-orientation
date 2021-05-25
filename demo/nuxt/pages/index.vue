<template>
  <div>
    <div>
      <p>supported : {{ state.deviceOrientation.isSupported() }}</p>
      <p>permission : {{ state.deviceOrientation.permission() }}</p>
    </div>

    <div v-if="state.permission">
      <p>alpha : {{ state.values.alpha }}</p>
      <p>beta : {{ state.values.beta }}</p>
      <p>gamma : {{ state.values.gamma }}</p>
    </div>
    <div v-else>
      <button @click="onClick">request permission</button>
    </div>

    <div v-if="state.error.message">
      <h3>Error</h3>
      <p>{{ state.error.message }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@nuxtjs/composition-api"

import { DeviceOrientation } from "js-device-orientation/dist"

export default defineComponent({
  setup() {
    const state = reactive({
      deviceOrientation: DeviceOrientation.useDeviceOrientation(),
      values: {
        alpha: 0,
        beta: 0,
        gamma: 0
      },
      permission: false,
      error: {
        message: ""
      }
    })

    function onClick() {
      state.deviceOrientation
        .requestPermission()
        .then(permitted => {
          state.permission = true
          permitted.bind(e => {
            state.values = {
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
      state,
      onClick
    }
  }
})
</script>
