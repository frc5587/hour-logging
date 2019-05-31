<template>
  <div id="app">
    <TheHeader></TheHeader>
    <PersonInfo :id="1" name="Jane Doe" :hours="3" :minutes="23" :checkedIn="false"></PersonInfo>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader";
import PersonInfo from "./components/PersonInfo";

export default {
  name: "app",
  components: {
    TheHeader,
    PersonInfo
  }
};
</script>

<style>
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #272822;
  padding: 0;
  margin: 0;
}
</style>
