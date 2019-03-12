<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card flat>
        <!-- <v-divider></v-divider> -->
        <v-list two-line>
          <v-list-tile
            v-for="(item, key) in fake"
            :key="key"
            avatar
            @click="item.checked = !item.checked"
          >
            <v-list-tile-action style="min-width:0px;">
              <v-checkbox @click="item.checked = !item.checked" color="primary" v-model="item.checked"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-action class="pa-1">
              <v-img
                  :src="getImagePreview(key)"
                  :lazy-src="getImagePreview(key)"
                  aspect-ratio="1"
                  class="grey lighten-2"
                ></v-img>
            </v-list-tile-action>
            <v-list-tile-content class="pl-2">
              <v-list-tile-title>{{item.name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{`z${item.zoomLevel}: ${item.tilecount} ${item.tilecount > 1 ? 'tiles' : 'tile'}, ${item.width} x ${item.height}`}}</v-list-tile-sub-title>            </v-list-tile-content>
          </v-list-tile>

        </v-list>
        <!-- <v-card-actions>
          
        </v-card-actions> -->
      </v-card>
    </v-flex>
  </v-layout>


</template>

<script>

  export default {
    data: () => ({
      tileSize: 256,
    }),
    computed:  {
      fake() {
        return this.$root.$children[0].boards;
      }
    },
    mounted() {

    },
    methods: {
      getImagePreview(key) {
        let path = `${this.$root.$children[0].preview}${key}.png`;
        // console.log(path)
        return path;
      }
    }
  }
</script>

<style>
.theme--dark.v-sheet {
  background-color: #323232;
}
.theme--dark.v-list {
  background: #323232;
}

.v-list--two-line .v-list__tile {
  height: 56px;
}

.head {
  background-color: rgba(255, 255, 255, .05)
}
</style>
