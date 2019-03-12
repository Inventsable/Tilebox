<template>
    <v-toolbar style="height: 36px;" flat>
        <div class="toolgrid" style="height: 36px;">
            <v-btn :disabled="$route.name !== 'home'" class="my-0" flat block @click="refresh">
                <v-icon>refresh</v-icon>
            </v-btn>
            <v-btn
                class="my-0" 
                v-for="link in links" 
                :key="link.name"
                style="height: 36px;"
                @click="goToRoute(link.name)" 
                flat block>
                    <v-icon :class="checkStyle(link)">{{link.icon}}</v-icon>
            </v-btn>
        </div>
    </v-toolbar>
</template>

<script>
export default {
    name: 'navbar',
    data: () => ({
        links: [
            {
                // route: '/home',
                name: 'home',
                icon: 'border_all',
            },
            {
                name: 'settings',
                icon: 'settings',
            }
        ]
    }),
    methods: {
        checkStyle(link) {
            if (link.name == this.$route.name) {
                return `primary--text`
            } else {
                return `white--text`
            }
        },
        goToRoute(link) {
            this.$router.push({name: link});
        },
        refresh() {
            this.$root.$children[0].readBoards();
        }
    }
}
</script>

<style>
.v-btn {
    padding-left: 0px;
    padding-right: 0px;
}

.v-btn__content {
    width: 40px;
}

.toolgrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
}

.v-toolbar__content {
    height: 36px !important;
    padding: 0px 0px;
}
</style>
