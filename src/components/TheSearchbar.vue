<template>
  <div>
    <form @submit.prevent="togglePerson" class="input-wrapper">
      <input
        v-model="searchText"
        v-focus
        placeholder="Enter name or ID of person to check in or out"
        @keydown="$emit('typing')"
      >
    </form>
  </div>
</template>

<script>
export default {
  name: "TheSearchbar",
  directives: {
    focus: {
      inserted(el) {
        el.focus();
        el.addEventListener("blur", el.focus);
      }
    }
  },
  data() {
    return {
      searchText: ""
    };
  },
  methods: {
    togglePerson() {
      this.$emit("toggle-person", this.searchText);
      // Reset after submitting
      this.searchText = "";
    }
  }
};
</script>

<style scoped>
.input-wrapper {
  display: grid;
  grid-template-columns: 3.75% 92.5% 3.75%;
}
input {
  /* Fill the centre of the grid */
  grid-column-start: 2;

  color: #393939;
  font-size: 1.25em;

  height: 5.25vh;

  /* Push in the text in the input */
  padding-left: 40px;
  padding-right: 40px;
}
</style>
