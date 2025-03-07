<script setup lang="ts">
import { MountProvider, defineProvider } from "../source/index";
import {
  NModalProvider,
  NConfigProvider,
  NMessageProvider,
  darkTheme,
} from "naive-ui";
import ComponentA from "./ComponentA.vue";

const providers = [
  defineProvider(NConfigProvider, {
    theme: darkTheme,
    tag:"section"
  }),
  defineProvider(NModalProvider),
  defineProvider(NMessageProvider),
];
</script>
<template>
  <div>
    <MountProvider :providers="providers">
      <ComponentA></ComponentA>
    </MountProvider>
  </div>
</template>
