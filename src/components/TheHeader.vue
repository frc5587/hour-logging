<template>
  <div class="header-row">
    <h1 class="name-entry">NAME</h1>
    <h1 class="time-entry">TIME LOGGED</h1>
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
  grid-template-columns: 80px 78.5% 11.5%;
  grid-template-areas: ". name time";

  background-color: #bc0f20;
}
.name-entry {
  grid-area: name;
}
.time-entry {
  grid-area: time;
}

h1 {
  /* For vertical centring even when text wraps */
  margin: auto 0 auto 0;
  padding-top: 15px;
  padding-bottom: 15px;

  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.85em;
}
</style>
