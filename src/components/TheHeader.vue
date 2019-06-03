<template>
  <div class="header-row">
    <h1 class="title name-entry">NAME</h1>
    <h1 class="title time-entry">TIME LOGGED</h1>
  </div>
</template>

<script>
export default {
  name: "TheHeader"
};
</script>

<style scoped>
.header-row {
  /* Grid is designed to compliment the grid in PersonInfo */
  display: grid;
  grid-template-columns: 80px 70% auto;
  grid-template-areas: ". name time";

  background-color: #bc0f20;
}
.name-entry {
  grid-area: name;
}
.time-entry {
  grid-area: time;
  text-align: right;
  margin-right: 82.5px;
}

.title {
  /* For vertical centring even when text wraps */
  margin-top: auto;
  margin-bottom: auto;
  padding-top: 15px;
  padding-bottom: 15px;

  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9em;
}
</style>
