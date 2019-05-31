<template>
  <div>
    <h1>{{ text }}</h1>
  </div>
</template>

<script>
export default {
  name: "SectionLabel",
  props: {
    text: String
  }
};
</script>

<style scoped>
h1 {
  /* Text styling */
  color: #787878;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-size: 1em;

  /* The width/alignment is based on the grid of PersonInfo */
  width: 80px;
  margin-top: 20px;
  margin-bottom: 5px;
}
</style>
