<template>
  <div class="modal-wrapper" v-observe-visibility="visibilityChanged">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <div class="modal-body">
        <h2>{{ actionText }}</h2>
        <h1>{{ nameText }}</h1>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Modal",
  props: {
    actionText: String,
    nameText: String,
    timeoutMs: Number
  },
  data() {
    return {
      closeTimer: null
    };
  },
  watch: {
    // Both actionText and nameText need to be watched to cover all cases
    actionText() {
      // The modal is currrently visible but we're updating things, so refresh the timer
      if (this.closeTimer !== null && this.timeoutMs > 0) {
        clearTimeout(this.closeTimer);
        this.$_createTimer();
      }
    },
    nameText() {
      // The modal is currrently visible but we're updating things, so refresh the timer
      if (this.closeTimer !== null && this.timeoutMs > 0) {
        clearTimeout(this.closeTimer);
        this.$_createTimer();
      }
    }
  },
  methods: {
    visibilityChanged(isVisible) {
      // Set the timer (if there is a non-default/non-zero timeout set)
      if (isVisible && this.timeoutMs > 0) {
        this.$_createTimer();
      }
    },
    $_createTimer() {
      this.closeTimer = setTimeout(() => {
        this.$emit("close");
        this.closeTimer = null;
      }, this.timeoutMs);
    }
  }
};
</script>

<style scoped>
/* The entire viewport (used to align the modal) */
.modal-wrapper {
  position: fixed; /* Stay in place */
  z-index: 9997;

  /* Used to centre the modal-content through margin: auto */
  display: grid;

  /* Fill the entire viewport */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  color: black;
}

/* The entire modal window */
.modal-content {
  z-index: 9998;
  width: 50%;
  height: 40%;

  /* Centres div vert. and hor. in the viewport b/c of display: grid */
  margin: auto;

  /* Set to enable animation later */
  position: relative;

  background-color: #fefefe;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

/* The text content of the modal (everything but the close button) */
.modal-body {
  display: flex;
  flex-direction: column;
  justify-content: center;

  text-align: center;
  height: 100%;
  color: black;
  font-family: Arial, Helvetica, sans-serif;
}

.close {
  position: absolute;
  top: 2px;
  left: 7px;

  color: gray;
  font-size: 1.5em;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

h2 {
  font-weight: normal;
  margin: 0;
}
h1 {
  font-weight: bold;
  font-size: 2.5em;
  margin: 0;
  margin-top: 5px;
}
</style>
