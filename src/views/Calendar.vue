<template>
  <div class="calendar">
    <h1 class="mb-4 secondary--text">Calendar</h1>
    <v-divider class="mb-5"></v-divider>
      <v-container>
        <v-layout>
          <v-flex>
            <vue-cal
              style="height: 100%"
              class="vuecal--full-height-delete" 
              ref="vuecal"
              small
              selected-date="2018-11-19"
              :time-from="8 * 60"
              :time-to="23 * 60"
              :disable-views="['years', 'year']"
              hide-weekends
              editable-events
              :events="events"
              :dblclickToNavigate="false"
              @event-delete="removeEvent($event)"
            ></vue-cal>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-5">
          <v-flex xs12 class="text-center">
            <v-btn outlined color="alternate" @click="createEvent">Add Event</v-btn>
          </v-flex>
          {{ events }}
        </v-layout>
    </v-container>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  name: 'calendar',
  components: {
    VueCal
  },
  data() {
    return {
      selectedEvent: null,
      showEventCreationDialog: false,
      eventsCssClasses: ['leisure', 'sport', 'health'],
      events: [
        {
          start: '2018-11-20 14:00',
          end: '2018-11-20 18:00',
          title: 'Pick up supplies',
          class: 'c_green'
        },
        {
          start: '2018-11-22 10:00',
          end: '2018-11-22 15:00',
          title: 'Dankery Drop',
          class: 'c_blue'
        }
      ]
    }
  },
  methods: {
    createEvent() {
      this.events.push({
        start: '2018-11-21 14:00',
          end: '2018-11-21 18:00',
          title: 'Pick up supplies',
          class: 'c_green'
      })
    },
    removeEvent(event) {
      this.events.pop(event)
    }
  }
}
</script>

<style>
.vuecal__menu, .vuecal__cell-events-count {background-color: #3cd1c2;}
.vuecal__menu button {border-bottom-color: #fff;color: #fff;}
.vuecal__menu button.active {background-color: rgba(255, 255, 255, 0.15);}
.vuecal__title-bar {background-color: #e4f5ef;}
.vuecal__cell.today, .vuecal__cell.current {background-color: rgba(240, 240, 255, 0.4);}
.vuecal:not(.vuecal--day-view) .vuecal__cell.selected {background-color: rgba(235, 255, 245, 0.4);}
.vuecal__cell.selected:before {border-color: rgba(66, 185, 131, 0.5);}
.vuecal__event.c_green {background-color: rgba(60, 209, 194, 0.6);border: 2px solid rgb(60, 209, 194);color: #fff;}
.vuecal__event.c_blue {background-color: rgba(89, 105, 255, 0.6);border: 2px solid rgb(89, 105, 255);color: #fff;}
</style>
