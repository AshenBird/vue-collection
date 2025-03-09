<script setup lang="tsx">
// import { useMessage } from 'naive-ui';
// import { onMounted, ref } from 'vue';
// import { useMount } from "../src/source/index";
// import ComponentB from "./ComponentB.vue";
// const Message = useMessage();
// const mount = useMount();
// const test = () => {
//   setTimeout(() => {
//     Message.success('test');
//   }, 1000);
//   const visible = ref(false);
//   const handler = mount({
//     content:()=><ComponentB visible={visible.value} ></ComponentB>
//   })
//   setTimeout(() => {
//     visible.value = true;
//     setTimeout(() => {
//       handler.destroy();
//     }, 2000);
//   }, 2000);
// }


// onMounted(() => {
//   test();
// });

import { defineMarkdownComponent } from "../src/source/markdown"

const MarkDown = defineMarkdownComponent({
  theme:{
    styles:{
      a:{
        color:"red"
      }
    }
  }
})

const content = `
  # test
  [mcswift](https://mcswift.cn)
`

</script>
<template>
  <MarkDown :content="content" ></MarkDown>
</template>