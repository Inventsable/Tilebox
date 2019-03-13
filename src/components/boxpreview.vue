<template>
    <div class="maincontent">
        <div class="square mt-3" :style="setPreview()">
            <div class="gridBox" :style="getGridStyle()" @mouseenter="prepGrid()" @mouseleave="deprepGrid()">
                <div 
                    class="gridCell"
                    v-for="(cell,index) in activeGrid" :key="index"
                    :style="getCellStyle(cell)"
                    @click="checkCell(cell, $event)"
                    @mouseenter="hoverOn(cell, $event)"
                    @mouseleave="hoverOff(cell, $event)"
                    >
                    <span>{{getAbbr(cell.name)}}</span>
                </div>
            </div>
        </div>
        <!-- <div class="annotation"> -->
            <div class="annogrid">
                <div class="annotop"></div>
                <div class="annobottom">
                    <v-btn flat block
                        :disabled="!hasMultiple"
                        @click="navigateActive(false)">
                        <v-icon>arrow_left</v-icon>
                    </v-btn>
                    <span class="title annoZoom">
                        {{this.zoom}}
                    </span>
                    <v-btn flat block
                        :disabled="!hasMultiple"
                        @click="navigateActive(true)">
                        <v-icon>arrow_right</v-icon>
                    </v-btn>
                </div>
            </div>
            <!-- <v-layout row wrap>
                <v-flex xs4 v-for="board in exports" :key="board.zoomLevel">
                    <v-btn>{{board.grid.z}}</v-btn>
                </v-flex>
            </v-layout> -->
        <!-- </div> -->
    </div>
</template>

<script>
export default {
    name: 'box',
    data: () => ({
        active: 2,
        mirror: [],
        mods: ['shift'],
        shift: false,
        locked: false,
        inGrid: false,
        lastCell: null,
        dragging: false,
        clicked: false,
        overrideClick: false,
        // zoom: null,
    }),
    mounted() {
        // console.log('HELLO WORLD!')
        this.cloneGrid();
        console.log(this.boards);
        console.log(this.mirror)
        console.log(this.selection);
        // console.log(this.previewPath);
        // console.log(this.fileNodes);
        // console.log('hello')
        setInterval(this.checkDisplay, 200);
        window.addEventListener('keydown', this.checkMods);
        window.addEventListener('keyup', this.checkMods);
        window.addEventListener('mousedown', this.checkMouse);
        window.addEventListener('mouseup', this.checkMouse);
    },
    computed: {
        boards() {
            return this.$root.$children[0].realBoards;
        },
        exists() {
            if (this.boards.length)
                return true;
            else
                return false;
        },
        selection() {
            try {
                const self = this;
                if (this.exists)
                    return this.mirror.find( board => board.zoomLevel === self.zoom )
                else
                    return null;
            } catch(err) {
                return null;
            }
        },
        zoom() {
            return this.zoomLevels[this.active];
        },
        zoomLevels() {
            let mirror = [];
            if (this.exists) {
                this.mirror.forEach(board => {
                    mirror.push(board.zoomLevel);
                })
            }
            return mirror;
        },
        hoveredCell() {
            try {
                const self = this;
                // console.log(this.mirror)
                if (this.exists)
                    return this.selection.grid.find( cell => cell.hover == true )
                else
                    return null;
            } catch(err) {
                return null;
            }
        },
        selectedCells() {
            return this.activeGrid.filter(cell => {
                return cell.selected;
            })
        },
        tilecount() {
            if (this.exists) {
                return this.selection.tilecount;
            }
        },
        activeGrid() {
            if (this.exists) {
                if (this.selection)
                    return this.selection.grid;
                else
                    return null;
            }
        },
        previewPath() {
            if (this.selection) {
                return `${this.$root.$children[0].preview}${this.selection.zoomLevel}.png`;
            } else {
                return null;
            }
        },
        destinationPath() {
            return this.$root.$children[0].getRealPath();
        },
        fileNodes() {
            var result = window.cep.fs.readdir(this.destinationPath);
            if (0 == result.err) {
                return result.data;
            } else {
                return [];
            }
        },
        hasMultiple() {
            if (this.mirror.length) {
                if (this.mirror.length > 1)
                    return true;
                else
                    return false;
            }
        },
        exports() {
            let mirror = [];
            this.boards.forEach(board => {
                // console.log(board)

                board.grid.forEach(cell => {
                    // console.log(cell)
                })
                // if (board.checked)
                mirror.push(board)
            })
            return mirror;
        }
    },
    methods: {
        navigateActive(state) {
            let last = this.mirror.length - 1;
            if (state) {
                if (this.active == last)
                    this.active = 0;
                else
                    this.active = this.active + 1;
            } else {
                if (this.active == 0)
                    this.active = last;
                else
                    this.active = this.active - 1;
            }
            // console.log(last);
            // console.log(this.active)
        },
        checkMouse(evt) {
            if (this.inGrid && this.exists) {
                if (/up/i.test(evt.type))
                    this.clicked = false;
                else
                    this.clicked = true;
                if (this.clicked) {
                    this.hoveredCell.selected = !this.hoveredCell.selected;
                    this.overrideClick = true;
                } else {
                    // this.hoveredCell.selected = false;
                    this.overrideClick = false;
                }
            }
        },
        getAbbr(name) {
            const rx = /[^\d][\d].*/gm;
            const ext = /\..*/gm;
            let result = null;
            result = name.substr(2, name.length);
            result = result.replace(ext, '');
            return result;
        },
        deprepGrid() {
            this.inGrid = false;
            this.cloneGrid();
        },
        prepGrid() {
            this.inGrid = true;
            this.cloneGrid();
        },
        checkMods(event) {
            this.mods.forEach(mod => {
                if (this[mod] !== event[mod + 'Key']) {
                    let rx = new RegExp(`${mod}`, 'i');
                    if (rx.test(event.key))
                        this[mod] = event[mod + 'Key'];
                }
            })
            if (this.shift && this.inGrid) {
                if (!this.locked) {
                    // console.log(this.hoveredCell);
                    this.highlightQuadrantOf(this.hoveredCell, true);
                    this.locked = true;
                    this.cloneGrid();
                }
            } else if (/shift/i.test(event.key)) {
                this.locked = false;
                // console.log(this.hoveredCell);
                // this.highlightQuadrantOf(this.hoveredCell, false);
                this.clearAllHovers();
                this.lastCell.hover = true;
                this.cloneGrid();
            }
        },
        // checkKey(cell, event) {
        //     console.log(`${event.key} :: ${event.shiftKey}`)
        //     if ((/shift/i.test(event.key)) || (event.shiftKey)) {
        //         this.highlightQuadrantOf(cell, event.shiftKey);
        //     }
        // },
        hoverOn(cell, evt) {
            cell.hover = true;
            this.lastCell = cell;
            if (this.clicked) {
                cell.selected = !cell.selected;
            } else {
                if (evt.shiftKey)
                    this.highlightQuadrantOf(cell, true);
            }
            this.cloneGrid();
        },
        clearAllHovers() {
            this.activeGrid.forEach(cell => {
                cell.hover = false;
            })
        },
        hoverOff(cell, evt) {
            cell.hover = false;
            if (evt.shiftKey)
                this.highlightQuadrantOf(cell, false);
            this.cloneGrid();
        },
        highlightQuadrantOf(targ, state) {
            this.activeGrid.forEach(cell => {
                if (cell.quadrant == targ.quadrant) 
                    cell.hover = true;
                else
                    cell.hover = false;
            })
        },
        selectQuadrantOf(targ, state) {
            this.activeGrid.forEach(cell => {
                if (cell.quadrant == targ.quadrant) 
                    cell.selected = state;
            })
        },
        checkDisplay() {
            // console.log('checking display...')
            if (this.boards.length && !this.mirror.length)
                this.cloneGrid();
        },
        cloneGrid() {
            this.mirror = [].concat(this.boards);
            // console.log(this.mirror);
        },
        checkCell(cell, evt) {
            if (this.shift) {
                this.selectQuadrantOf(cell, !cell.selected);
            } else {
                // if (!this.overrideClick)
                //     cell.selected = !cell.selected;
            }
            this.cloneGrid();
            console.log(this.selectedCells)
        },
        getCellStyle(cell) {
            // console.log('hello')
            let style = `
                display: flex;
                justify-content: center;
                align-items: flex-end;
                padding-bottom:.25rem;
                overflow: hidden;
                border-width: ${this.zoom > 2 ? '.5' : '.75'}px;
                font-size: ${this.zoom < 3 ? '1rem' : '.5rem'};
            `
            if (cell.selected) {
                style += `border-color: var(--color-selection);
                color: var(--color-selection);
                background-color: rgba(70, 160, 245, 0.075);`
            } else if (cell.hover) {
                style += `border-color: white;
                color: white;
                background-color: rgba(160,160,160,0.075);`
            } else {
                style += `border-color: ${(this.cellExists(cell)) ? 'green' : 'red'};
                color: ${(this.cellExists(cell)) ? 'green' : 'red'};
                background-color: rgba(${(this.cellExists(cell)) ? '0,160,0' : '160,0,0'},0.075);`
            }

            return style;
        },
        getGridStyle(board) {
            return `
                display: grid;
                grid-template-columns: repeat(${(this.selection) ? this.selection.tilerows : 0}, 1fr);
                width: 100%;
                height: 100%;
            `
        },
        setPreview() {
            return `background-image: url(${this.previewPath});`
        },
        cellExists(cell) {
            if (this.fileNodes.includes(cell.name)) {
                cell.exists = true;
                return true;
            } else {
                cell.exists = false;
                return false;
            }
        },
    }
}
</script>

<style>

.maincontent {
    box-sizing: border-box;
    /* border: 2px solid red; */
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
    flex-wrap: wrap;
    background-color: var(--color-scrollbar);
    border: 2px solid var(--color-scrollbar);
}

.square {
    box-sizing: border-box;
    width: 90vw;
    height: 90vw;
    background-size: contain;
    
}

.annotation {
    /* border: 2px solid var(--color-scrollbar); */
    /* background-color: var(--color-scrollbar); */
    /* padding-top: 1rem; */
    /* padding: .25rem 0px; */
    /* width: 90%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    /* margin-top: -.5rem; */
}

.annogrid {
    width: 100%;
    height: 60px;
    border: 2px solid red;
    display: grid;
    grid-template-rows: 2fr 1fr;
}

.annobottom {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

/* .navbtn, .ZCount {
    display: flex;
    justify-content: center;
} */

.gridBox {
    /* grid-column-gap: .25rem; */
    /* grid-row-gap: .25rem; */
    /* background-color: red; */
}

.gridCell {
    border-style: solid;
    box-sizing: border-box;
    /* background-color: var(--color-bg); */
    background-color: transparent;
    cursor: pointer;
    user-select: none;
}

.annoZoom {
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: default;
}

/* .gridCell:hover {
    background-color: var(--color-hover);
} */
</style>
