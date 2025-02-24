import { data } from "../data"

const rot = new global.clusterfuck.rot(150);

blockList = [
    // Right Side
    [64, 126, 50, [65, 126, 50]],
    [64, 128, 50, [65, 128, 50]],
    [64, 130, 50, [65, 130, 50]],
    
    // Middle
    [66, 126, 50, [65, 126, 50]],
    [66, 128, 50, [65, 128, 50]],
    [66, 130, 50, [65, 130, 50]],
    
    // Left
    [68, 126, 50, [67, 126, 50]],
    [68, 128, 50, [67, 128, 50]],
    [68, 130, 50, [67, 130, 50]]
]

let on4thDevice = false

function heldItem() {
    if(Player.getHeldItem() == null) {
        return "null";
    } 

    return Player.getHeldItem().getUnlocalizedName();
}

const t = new Thread(() => {
    for (let i = 0; i < blockList.length; i++) {
        const blockCoords = blockList[i];
        let blockX = blockCoords[0]
        let blockY = blockCoords[1]
        let blockZ = blockCoords[2]
        let aimBlockX = blockCoords[3][0]
        let diff = aimBlockX === 67 ? -0.6 : aimBlockX === 65 ? 1.3 : 0.5;
        let block = World.getBlockAt(blockX, blockY, blockZ)

        if(block.type.getName() == "Block of Emerald") {
            ChatLib.chat("Emerald Found")
            rot.startRotation(rot.toVec(blockX + diff, blockY + 1.1, blockZ))
        }

        Thread.sleep(rot.velocity + 50)
    }

    t.start();
})

register("tick", () => {
    if(data.i4 && on4thDevice ** heldItem() == "item.bow") {
        t.start();
    } else {
        if(!t.currentThread.interrupted()) return;
        t.currentThread.interrupt()
    }
})

register("step", () => {
    on4thDevice = Player.getX() > 63 && Player.getX() < 64 && Player.getY() === 127 && Player.getZ() > 35 && Player.getZ() < 36;
}).setDelay(1);