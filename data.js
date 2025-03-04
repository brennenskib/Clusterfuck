import PogObject from "../PogData"

const data = new PogObject("Clusterfuck", {
    barphase: false,
    schizoterms: false,
    verticalchine: false,
    noremovecobble: false,
    mastiffSlot: 1, // // val = 1-9
    ogSlot: 1, // val = 1-9
    swordSlot: 1, // val = 1-8
    miningBot: {
        blocks: [ [95, 10], [160, 10] ],
        lookDelay: 100,
        radius: 4,
        height: 4,
        depth: 4
    },
    i4: false
})

export { data }