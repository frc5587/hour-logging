<template>
  <div class="row-body" @click="$emit('toggle-person', id)">
    <PersonInfoStatus :checkedIn="checkedIn"></PersonInfoStatus>
    <p>{{ name }}</p>
    <p>
      {{ hours }}<span class="time-label">h</span>
      {{ minutesMod }}<span class="time-label">m</span>
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
    minutes: Number,
    checkedIn: Boolean
  },
  computed: {
    hours() {
      return Math.floor(this.minutes / 60);
    },
    minutesMod() {
      return this.minutes % 60;
    }
  }
};
</script>

<style scoped>
.row-body {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 80px 80% max-content;
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
