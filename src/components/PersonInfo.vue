<template>
  <div class="row-body" @click="$emit('toggle-person', id)">
    <PersonInfoStatus :checked-in="checkedIn"/>
    <p>{{ name }}</p>
    <p>
      {{ hours }}<span class="time-label">h</span>
      {{ minutesMod }}<span class="time-label">m</span>
    </p>
  </div>
</template>

<script>
import { mixin as VueTimers } from "vue-timers";
import PersonInfoStatus from "./PersonInfoStatus";

export default {
  name: "PersonInfo",
  components: {
    PersonInfoStatus
  },
  mixins: [VueTimers],
  props: {
    id: Number,
    name: String,
    initialMinutes: Number,
    checkedIn: Boolean
  },
  data() {
    return {
      minutes: this.initialMinutes
    };
  },
  computed: {
    hours() {
      return Math.floor(this.minutes / 60);
    },
    minutesMod() {
      return this.minutes % 60;
    }
  },
  timers: {
    $_add_minute: { time: 1000 * 60, repeat: true }
  },
  methods: {
    $_add_minute() {
      this.minutes += 1;
    }
  },
  watch: {
    checkedIn(val) {
      if (val) {
        this.$timer.start("$_add_minute");
      } else {
        this.$timer.stop("$_add_minute");
      }
    }
  },
  mounted() {
    if (this.checkedIn) {
      this.$timer.start("$_add_minute");
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
