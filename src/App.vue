<template>
  <div id="app">
    <TheHeader />

    <div class="people-table">
      <SectionLabel v-if="peopleCheckedIn.length > 0" text="IN" />
      <PersonInfo
        v-for="person in peopleCheckedIn"
        :key="person.id"
        :id="person.id"
        :name="person.name"
        :initial-minutes="person.minutes"
        :checked-in="person.checkedIn"
        @toggle-person="togglePerson"
      />

      <SectionLabel v-if="peopleCheckedOut.length > 0" text="OUT" />
      <PersonInfo
        v-for="person in peopleCheckedOut"
        :key="person.id"
        :id="person.id"
        :name="person.name"
        :initial-minutes="person.minutes"
        :checked-in="person.checkedIn"
        @toggle-person="togglePerson"
      />
    </div>

    <TheSearchbar @toggle-person="togglePerson" @typing="modalInfo.showModal = false" />

    <Modal
      v-show="modalInfo.showModal"
      :action-text="modalInfo.modalActionText"
      :name-text="modalInfo.modalNameText"
      :timeout-ms="1500"
      @close="modalInfo.showModal = false"
    />
  </div>
</template>

<script>
import Vue from "vue";
import api from "./api";
import VueObserveVisibility from "vue-observe-visibility";
import TheHeader from "./components/TheHeader";
import SectionLabel from "./components/SectionLabel";
import PersonInfo from "./components/PersonInfo";
import TheSearchbar from "./components/TheSearchbar";
import Modal from "./components/Modal";
import { Student } from "./models/student";

Vue.use(VueObserveVisibility);

export default {
  name: "app",
  components: {
    TheHeader,
    SectionLabel,
    PersonInfo,
    TheSearchbar,
    Modal
  },
  data() {
    return {
      modalInfo: {
        showModal: false,
        modalActionText: "",
        modalNameText: ""
      },
      people: [Student]
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
  async created() {
    this.people = await api.getStudents();
  },
  methods: {
    findPerson(personIdentifier) {
      if (!isNaN(personIdentifier)) {
        // personIdentifier is a 9-digit integer, but needs to be converted from string
        const identifier = parseInt(personIdentifier);
        return this.people.find(person => person.id === identifier);
      } else {
        // personIdentifier is their actual name
        return this.people.find(person => person.name === personIdentifier);
      }
    },
    showModal(actionText, nameText) {
      const info = this.modalInfo;
      info.modalActionText = actionText;
      info.modalNameText = nameText;
      info.showModal = true;
    },
    checkInPerson(person) {
      person.checkedIn = true;
      person.checkInDate = new Date();

      // Show modal with notification
      this.showModal("CHECKING IN", person.name);
    },
    checkOutPerson(person) {
      // Dates are preferred over minute data from PersonInfo element because of accuracy
      const timeElapsedMin = minFromNow(person.checkInDate);

      person.minutes += Math.round(timeElapsedMin);

      // Update the server with the new minutes information
      api.updateStudent(person);

      person.checkedIn = false;
      person.checkInDate = null;

      // Show modal with notification
      this.showModal("CHECKING OUT", person.name);
    },
    togglePerson(personIdentifier) {
      const person = this.findPerson(personIdentifier);
      if (person === undefined) {
        return;
      }

      if (person.checkedIn) {
        // Check the person out now
        this.checkOutPerson(person);
      } else {
        // Check the person in now
        this.checkInPerson(person);
      }
    }
  }
};

function minFromNow(date) {
  const currentDate = new Date();
  const timeElapsedMs = Math.abs(currentDate - date);
  return timeElapsedMs / 1000 / 60;
}
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
.people-table {
  overflow-y: auto;
  margin-bottom: 15px;
}
</style>
