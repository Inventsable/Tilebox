<template>
    <div class="text-xs-center">
        <v-bottom-sheet persistent v-model="state" :hide-overlay="true" inset>
            <v-card class="grey darken-4" tile>
                <v-progress-linear
                    v-model="value"
                    :active="show"
                    :indeterminate="query"
                    :query="true"
                    class="my-0"
                    height="3"
                    color="primary"
                    ></v-progress-linear>
                    <!-- :value="progress" -->
                    <!-- v-show="progress !== 0" -->
                
                <div class="foot-box">
                    <div class="foot-grid">
                        <!-- <div class="lottie">
                            <v-btn block flat :disabled="!hasBoards || !hasChecked" @click="init" color="primary">
                                export
                            </v-btn>
                        </div>
                        <div class="end">
                            <v-btn block flat @click="init" color="primary">
                                <v-icon>refresh</v-icon>
                            </v-btn>
                        </div> -->
                        <div class="exports">
                            <v-btn block flat :disabled="ifNoExport" @click="triggerExport" color="primary">
                                export
                            </v-btn>
                        </div>
                        <!-- <div class="refresh">
                            <v-btn block flat @click="init" color="primary">
                                <v-icon>refresh</v-icon>
                            </v-btn>
                        </div> -->
                    </div>
                </div>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
export default {
    name: 'bottomanim',
    computed: {
        ifNoExport() {
            if ((!this.hasBoards || !this.hasChecked)) {
                return true;
            } else {
                if (this.$route.name == 'settings')
                    return true;
                else
                    return false;
            }
        },
        state() {
            return this.$root.$children[0].sheet;
        },
        csInterface() {
            return this.$root.$children[0].csInterface;
        },
        hasBoards() {
            if (this.$root.$children[0].boards.length)
                return true;
            else 
                return false;
        },
        hasChecked() {
            if (this.hasBoards) {
                let count = 0;
                this.$root.$children[0].boards.forEach(board => {
                    if (board.checked)
                        count++;
                })
                if (count > 0)
                    return true;
                else
                    return false;
            }
        },
        step() {
            return 100 / this.count;
        }
    },
    data: () => ({
        progress: 0,
        count: 0,
        value: 0,
        show: true,
        query: false,
        querying: false,
        interval: 0
    }),
    beforeDestroy () {
        clearInterval(this.interval);
    },
    methods: {
        triggerExport() {
            if (this.$route.name !== 'box')
                this.$root.$children[0].startExport();
            else
                this.$root.$children[0].cellExport();
        },
        start() {
            // this.progress = 0;
            // console.log('Mounting CSInterface')
            this.$root.$children[0].csInterface.addEventListener('startload', this.logLength);
            this.$root.$children[0].csInterface.addEventListener('step', this.addStep);
            this.$root.$children[0].csInterface.addEventListener('console', this.consoler);
        },
        startScan() {
            this.queryAndIndeterminate()
        },
        consoler(msg) {
            // if (typeof msg === 'String')
            //     console.log(`HOST: ${msg.data}`);
            // else
                console.log(msg.data);
        },
        stopScan() {
            this.query = false;
        },
        endScan() {
            // this.query = false;
            // this.show = true;
            // this.value = 0;
        },
        queryAndIndeterminate() {
            this.query = true
            this.show = true
            this.value = 0
        },
        addStep(step) {
            this.query = false;
            // console.log(step.data);
            // console.log(this.step);
            this.value = this.step * (step + 1)
            // if (this.progress + this.step < 100) {
            //     this.progress += this.step;
            // } else {
            //     console.log('Done');
            //     setTimeout(() => {
            //         this.progress = 0;
            //     }, 1000);
            // }
        },
        init() {
            location.reload();
        },
        logLength(num) {
            // console.log(num.data)
            this.count = num.data;
            // this.$root.$children[0].boardCount = num.data;
        },
    }
}
</script>

<style scoped>
.foot-box {
    height: 100px;
    /* border: 2px solid red; */
    display: flex;
    justify-content: center;
    /* align-items: center; */
}

.foot-grid {
    width: 80%;
    display: grid;
    grid-template-columns: 1fr;
    /* align-items: center; */

}

.lottie {
    /* border: 2px solid red; */
    height: 80px;
    align-self: center;
}

.v-btn {
    height: 100%;
    align-self: center;
}
</style>
