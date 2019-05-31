<template>
  <div id="app">
    <TheHeader></TheHeader>

    <SectionLabel v-if="peopleCheckedIn.length > 0" text="IN"></SectionLabel>
    <PersonInfo
      v-for="person in peopleCheckedIn"
      :key="person.id"
      :id="person.id"
      :name="person.name"
      :hours="person.hours"
      :minutes="person.minutes"
      :checkedIn="person.checkedIn"
    ></PersonInfo>

    <SectionLabel v-if="peopleCheckedOut.length > 0" text="OUT"></SectionLabel>
    <PersonInfo
      v-for="person in peopleCheckedOut"
      :key="person.id"
      :id="person.id"
      :name="person.name"
      :hours="person.hours"
      :minutes="person.minutes"
      :checkedIn="person.checkedIn"
    ></PersonInfo>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader";
import SectionLabel from "./components/SectionLabel";
import PersonInfo from "./components/PersonInfo";

export default {
  name: "app",
  components: {
    TheHeader,
    SectionLabel,
    PersonInfo
  },
  data() {
    return {
      people: [
        {
          id: 1,
          name: "Jane Doe",
          hours: 3,
          minutes: 23,
          checkedIn: false,
          checkInDate: null
        },
        {
          id: 2,
          name: "John Doe",
          hours: 19,
          minutes: 57,
          checkedIn: true,
          checkInDate: Date()
        }
      ]
    };
  },
  computed: {
    peopleCheckedIn() {
      return this.people.filter(person => person.checkedIn);
    },
    peopleCheckedOut() {
      return this.people.filter(person => !person.checkedIn);
    }
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
