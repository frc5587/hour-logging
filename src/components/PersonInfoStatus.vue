<template>
  <div class="vl" :class="{ 'green-vl': checkedIn }"></div>
</template>

<script>
export default {
  name: "PersonInfoStatus",
  props: {
    checkedIn: Boolean
  }
};
</script>

<style>
.vl {
  border-left: 4px solid gray;
  margin-left: auto;
  margin-right: auto;
}
.green-vl {
  border-left: 4px solid green;
}
</style>
