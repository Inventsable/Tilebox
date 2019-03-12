<template>
  <v-card flat>
    <v-layout class="mt-3" row wrap>
      <v-flex 
        v-for="input in midinputs" 
        :key="input.label" 
        class="mt-1"
        xs5 offset-xs1>
        <v-text-field
          class="pa-2"
          :label="input.label"
          v-model="input.value"
          @input="logValue(input)"
          :suffix="fileType"
          :append-icon="input.icon ? input.icon : ''"
          hide-details
          ></v-text-field>
      </v-flex>
      <v-flex xs4 offset-xs1>
        <v-select
          class="mt-1"
          v-model="select"
          :hint="`${this.pattern}${select.abbr}`"
          :items="exts"
          hide-details
          item-text="name"
          item-value="abbr"
          label="Select"
          @input="logExt(select)"
          return-object
          single-line
        ></v-select>
      </v-flex>
      <v-flex 
        v-for="input in biginputs" 
        :key="input.label" 
        class="my-1"
        xs10 offset-xs1>
        <v-text-field
          class="pa-2"
            @input="logValue(input)"
            :label="input.label"
            v-model="input.value"
            :append-icon="input.icon ? input.icon : ''"
            hide-details
          ></v-text-field>
      </v-flex>
      <v-flex 
        v-for="input in smallinputs" 
        :key="input.label" 
        
        class="mt-2 mb-1"
        xs5 offset-xs1>
        <v-text-field
          class="pa-2"
            :label="input.label"
            v-model="input.value"
            @input="logValue(input)"
            :append-icon="input.icon ? input.icon : ''"
            hide-details
            
          ></v-text-field>
      </v-flex>
      <!-- <v-spacer></v-spacer> -->
      <v-flex 
        v-for="input in numinputs" 
        :key="input.label" 
        class="mt-2 mb-1"
        xs4 offset-xs1>
        <v-text-field
          class="pr-2 pt-2 pb-2"
            :label="input.label"
            v-model="input.value"
            @input="logValue(input)"
            type="number"
            hide-details
            suffix="px"
          ></v-text-field>
      </v-flex>
        <!-- v-for="slider in sliders" 
        :key="slider.label"  -->
      <v-flex 
        class="my-2 px-2"
        xs10 offset-xs1>
        <!-- <v-slider
              v-model="slider.value"
              :max="10"
              :label="slider.label"
            ></v-slider> -->
        <!-- <v-flex class="px-3"> -->
          <v-range-slider
            v-model="zoomLevels"
            :thumb-size="16"
            thumb-label="always"
            label="zoom range"
            :max="6"
            :min="0"
            :step="1"
            @input="logRange"
          ></v-range-slider>
        <!-- </v-flex> -->
        <!-- <v-text-field
          class="pa-2"
            :label="input.label"
            v-model="input.value"
            type="number"
            hide-details
          ></v-text-field> -->
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'About',
  data: () => ({
    select: { name: 'PNG', abbr: '.png' },
    exts: [
          { name: 'PNG', abbr: '.png' },
          { name: 'JPG', abbr: '.jpg' },
    ],
    midinputs: [
      {
        label: 'pattern',
        value: `{z}-{x}-{y}`,
        parent: 'midinputs',
        index: 0,
      },
    ],
    biginputs: [
      {
        label: 'path',
        value: null,
        icon: 'folder',
        parent: 'biginputs',
        index: 0,
      },
    ],
    smallinputs: [
      {
        label: 'keyword',
        value: 'zoom',
        icon: 'vpn_key',
        parent: 'smallinputs',
        index: 0,
      },
    ],
    numinputs: [
      {
        label: 'size',
        value: 256,
        parent: 'numinputs',
        index: 0,
      },
    ],
    zoomLevels: [0, 6],
    // pattern: null,
    path: null,
    maxZoom: null,
    minZoom: 0,
    ext: 'PNG',
  }),
  computed: {
    fileType() {
      return '.' + this.ext.toLowerCase();
    },
    chain() {
      return [].concat(this.midinputs, this.smallinputs);
    },
    allinputs() {
      return this.biginputs.concat(this.chain, this.numinputs);
    },
    pattern() {
      return this.smallinputs[0].value;
    }
  },
  mounted() {
    // console.log('mounted')
    this.getStorage();
    // console.log(this.allinputs)
    this.writeToParent();
    this.recheckRange();
  },
  methods: {
    getExtSelection(name) {
      let match = null;
      this.exts.forEach(ext => {
        if (ext.name == name) {
          match = ext;
        }
      })
      if (match)
        return match;
      else
        return { name: 'PNG', abbr: '.png' };
    },
    writeToParent() {
      this.$root.$children[0].opts.size = this.numinputs[0].value;
      this.$root.$children[0].opts.ext = this.select.abbr;
      this.$root.$children[0].opts.keyword = this.smallinputs[0].value;
      this.$root.$children[0].opts.path = this.biginputs[0].value;
      this.$root.$children[0].opts.min = this.zoomLevels[0];
      this.$root.$children[0].opts.max = this.zoomLevels[1];
      this.$root.$children[0].opts.pattern = this.midinputs[0].value;
      // console.log(this.$root.$children[0].opts)
      // console.log(this.$root.$children[0].getRealPath())
    },
    recheckRange() {
      // console.log(this.zoomLevels)
    },
    logRange(select) {
      this.zoomLevels = select;
      window.localStorage.setItem('min', select[0]);
      window.localStorage.setItem('max', select[1]);
      this.$root.$children[0].opts.min = select[0];
      this.$root.$children[0].opts.max = select[1];
    },
    logExt(select) {
      // console.log(select);
      this.ext = select.name;
      window.localStorage.setItem('ext', select.name);
      this.$root.$children[0].opts.ext = this.fileType;
      // console.log(this.$root.$children[0].opts)
    },
    logValue(input) {
      // console.log(`${input.label}: ${input.value}`);
      this.$root.$children[0].opts[input.label] = input.value;
      window.localStorage.setItem(input.label, input.value);
      // console.log(this.$root.$children[0].opts)
    },
    getStorage() {
      // console.log(window.localStorage)
      const self = this;
      try {
        this.allinputs.forEach(input => {
          let val = window.localStorage.getItem(input.label);
          self[input.parent][input.index].value = val;
          self.$root.$children[0].opts[input.label] = val;
        });
        this.ext = window.localStorage.getItem('ext');
        // console.log(this.select)
        this.select = this.getExtSelection(this.ext);
        // console.log(this.select)
        this.zoomLevels[0] = window.localStorage.getItem('min');
        this.zoomLevels[1] = window.localStorage.getItem('max');
      } catch(err) {
        // console.log(err)
      }
      // console.log(this.$root.$children[0].opts)
    }
  }
}
</script>

