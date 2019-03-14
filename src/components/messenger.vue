<template>
    <v-snackbar
        flat
        :auto-height="true"
        color="primary"
        v-model="status"
        :bottom="y === 'bottom'"
        :left="x === 'left'"
        :multi-line="mode === 'multi-line'"
        :right="x === 'right'"
        :timeout="timeout"
        :top="y === 'top'"
        :vertical="mode === 'vertical'"
    >
        <!-- <v-spacer></v-spacer> -->
        <span>
            {{ message }}
        </span>
        <!-- <v-spacer></v-spacer> -->
        <!-- <v-btn
            color="pink"
            flat
            @click="status = false"
        >
            Close
        </v-btn> -->
    </v-snackbar>
</template>

<script>
export default {
    name: 'messenger',
    data: () => ({
        status: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 1500,
    }),
    computed: {
        message() {
            return this.$root.$children[0].message;
        }
    },
    methods: {
        show() {
            this.status = true;
        }
    }
}
</script>
