<template>
  <div id="app">
    <TheHeader></TheHeader>

    <div>
      <SectionLabel v-if="peopleCheckedIn.length > 0" text="IN"></SectionLabel>
      <PersonInfo
        v-for="person in peopleCheckedIn"
        :key="person.id"
        :id="person.id"
        :name="person.name"
        :minutes="person.minutes"
        :checkedIn="person.checkedIn"
      ></PersonInfo>

      <SectionLabel v-if="peopleCheckedOut.length > 0" text="OUT"></SectionLabel>
      <PersonInfo
        v-for="person in peopleCheckedOut"
        :key="person.id"
        :id="person.id"
        :name="person.name"
        :minutes="person.minutes"
        :checkedIn="person.checkedIn"
      ></PersonInfo>
    </div>

    <TheSearchbar @toggle-person="togglePerson"></TheSearchbar>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader";
import SectionLabel from "./components/SectionLabel";
import PersonInfo from "./components/PersonInfo";
import TheSearchbar from "./components/TheSearchbar";

export default {
  name: "app",
  components: {
    TheHeader,
    SectionLabel,
    PersonInfo,
    TheSearchbar
  },
  data() {
    return {
      people: [
        {
          id: 1,
          name: "Jane Doe",
          minutes: 223,
          checkedIn: false,
          checkInDate: null
        },
        {
          id: 2,
          name: "John Doe",
          minutes: 957,
          checkedIn: true,
          checkInDate: new Date()
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
  },
  methods: {
    togglePerson(personIdentifier) {
      const person = this.findPerson(personIdentifier);
      if (person === undefined) {
        return;
      }

      if (person.checkedIn) {
        // Check the person out now
        const currentDate = new Date();
        const timeElapsedMs = currentDate - person.checkInDate;
        const timeElapsedMin = timeElapsedMs / 1000 / 60;

        //TODO: Update database with timeElapsed data
        person.minutes += Math.round(timeElapsedMin);

        person.checkedIn = false;
        person.checkInDate = null;
      } else {
        // Check the person in now
        person.checkedIn = true;
        person.checkInDate = new Date();
      }
    },
    findPerson(personIdentifier) {
      if (!isNaN(personIdentifier)) {
        // personIdentifier is the barcode number
        return this.people.find(
          person => person.id === parseInt(personIdentifier, 16)
        );
      } else {
        // personIdentifier is their actual name
        return this.people.find(person => person.name === personIdentifier);
      }
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
#app {
  /* Ensure the app takes up all space to enable grid */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 16px;
  left: 0;

  /* Display as grid to separate people and searchbar */
  display: grid;
  grid-template-rows: auto 87% auto;
}
</style>
