<template>
  <div>
    <h1>API Key</h1>
    <div>
      <h4>API Key</h4>
      <div>
        <code>{{apiKey}}</code>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch, watchEffect} from "vue"
import { MirrorWorld, ClusterEnvironment, IUser } from "@mirrorworld/web3.js"
import { useRoute } from "#app";
import formatHighlight from "json-format-highlight"

const route = useRoute()
const apiKey = computed(() => route.params.apiKey)

const mirrorworld = ref<MirrorWorld>(
  new MirrorWorld({
    apiKey: "sPnX5cIVW7n5ZDfcAAE9BazWpDVJfOteJSr",
    env: ClusterEnvironment.testnet,
    clientId: "foo"
  })
)

async function login() {
  return new Promise<IUser>(async(resolve, reject) => {
    await mirrorworld.value.login()
  })
}

onMounted(async() => {
  await nextTick()
  if (apiKey.value) {
  console.log("API Key found. Sending message", apiKey.value)
    const { serialize } = await import("bson")
    window.opener?.postMessage?.({
      name: "mw:auth:login",
      payload: serialize({
        access_token: "foo:access_token",
        refresh_token: "foo:refresh_token",
        api_key: apiKey.value
      })
    })
  }
})


</script>