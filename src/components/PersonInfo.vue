<template>
  <div class="row-body">
    <PersonInfoStatus :checkedIn="checkedIn"></PersonInfoStatus>
    <p>{{ name }}</p>
    <p>
      {{ hours }}<span class="time-label">h</span>
      {{ minutes }}<span class="time-label">m</span>
    </p>
  </div>
</template>

<script>
import PersonInfoStatus from "./PersonInfoStatus";

export default {
  name: "PersonInfo",
  components: {
    PersonInfoStatus
  },
  props: {
    id: Number,
    name: String,
    hours: Number,
    minutes: Number,
    checkedIn: Boolean
  }
};
</script>

<style scoped>
.row-body {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 80px 80% 20%;
}
.row-body:hover {
  background-color: #393939;
}

p {
  margin-top: 15px;
  margin-bottom: 15px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.1em;
  color: #acacac;
}
.time-label {
  font-size: 0.75em;
}
</style>
