import { data } from "../data"

const Rotation = new global.clusterfuck.rot(data.miningBot.lookDelay); 
const BlockPoss = Java.type("net.minecraft.util.BlockPos");
const attackBind = new KeyBind(Client.getMinecraft().field_71474_y.field_74312_F);

class MiningBot {
    constructor() {
        this.startMine;
        this.data = {};
        this.lookingForBlockID = data.miningBot.blocks;
        this.enabled = false;
        this.rotated = false;

        register('blockBreak', (block) => {
            if(!this.enabled) return;
            if(block?.pos?.hashCode() == this?.data?.block?.pos?.hashCode()) {
                this.newBlock = true;
                this.rotated = false;
            }
        })

        register("packetReceived", (packet) => {
            if(!this.enabled) return;

            const dYaw = Math.abs(net.minecraft.util.MathHelper.func_76142_g(packet.func_148931_f() - Player.getRawYaw()))
            const dPitch = Math.abs(packet.func_148930_g() - Player.getPitch())

            if (dYaw === 360 || Player.getPlayer().field_70737_aN >= 5) return

            if (dYaw >= 36 || dPitch >= 18) {
                this.enabled = false;
                attackBind.setState(false);
                ChatLib.chat("Rotation Check, Disabled.")
            }
        }).setFilteredClass(net.minecraft.network.play.server.S08PacketPlayerPosLook)
    }

    sides = [[0.5, 0.01, 0.5], [0.5, 0.98, 0.5], [0.01, 0.5, 0.5], [0.98, 0.5, 0.5], [0.5, 0.5, 0.01], [0.5, 0.5, 0.99]];

    canSeePos(pos, reachCheck=true) {
        for(let i = 0; i < this.sides.length; i++) {
            let side = this.sides[i];
            let point = [pos.x + side[0], pos.y + side[1], pos.z + side[2]];
            let vector = new net.minecraft.util.Vec3(point[0], point[1], point[2])
            let castResult = World.getWorld().func_147447_a(Player.getPlayer().func_174824_e(1), vector, false, false, true)

            if(castResult && castResult.func_178782_a().equals(pos.toMCBlock()) && (!reachCheck || vector.func_72438_d(Player.getPlayer().func_174824_e(1)) < 4.5)) {
                return { result: true, point: vector };
            }
        }
        return { result: false };
    }

    getAngles(bp) {
        function to180(angle) {
            angle %= 360.0
            while (angle >= 180.0)
            angle -= 360.0
            while (angle < -180.0)
            angle += 360.0
            return angle
        }

        let eyes = Player?.getPlayer()?.func_174824_e(1)
        let diffX = bp.getX() - eyes?.field_72450_a
        let diffY = bp.getY() - eyes?.field_72448_b
        let diffZ = bp.getZ() - eyes?.field_72449_c
        let yaw = Math.atan2(diffZ, diffX)

        const pitch = -(Math.atan2(diffY, Math.sqrt(diffX * diffX + diffZ * diffZ)) * (180 / Math.PI))
        yaw =  yaw = to180((yaw * 180.0) / Math.PI - 90.0 - Player.getPlayer()?.field_70177_z)

        return {
            pitch: pitch,
            yaw: yaw
        }
    }

    wrapAngleTo180(angle) {
        return (angle - Math.floor(angle / 360 + 0.5) * 360);
    } 

    getChange(start, end) {
        let yawDiff = this.wrapAngleTo180(end.yaw) - this.wrapAngleTo180(start.yaw)

        if (yawDiff <= -180) {
            yawDiff += 360;
        } else if (yawDiff > 180) {
            yawDiff -= 360;
        }

        return { pitch: end.pitch - start.pitch, yawDiff }
    }

    isValid(block) {
        if(!block) return false;
        return this.lookingForBlockID.some(id => id[0] == block?.type?.getID() && id[1] == block?.getMetadata())
    }

    getClosest(rad, h, d) {
        let playerPos = new BlockPos(
            Math.floor(Player.getX()),
            Math.floor(Player.getY()),
            Math.floor(Player.getZ())
        )

        let vecTop = new BlockPos(
            rad, h, rad
        )

        let vecBot = new BlockPos(
            rad, d, rad
        )

        let easiest;
        let vector;
        let block;

        BlockPoss.func_177980_a(playerPos.subtract(vecBot).toMCBlock(), playerPos.add(vecTop).toMCBlock()).forEach(bp => {
            let wrapped = new BlockPos(bp);
            let csp = this.canSeePos(wrapped, true);
            let block2 = World.getBlockAt(wrapped.x, wrapped.y, wrapped.z)
            
            if(this.isValid(block2)) {
                if(!csp.result) return;
                let player = {
                    yaw: Player.getYaw(),
                    pitch: Player.getPitch()
                }

                if(easiest == null || this.getChange(player, this.getAngles(wrapped)) < this.getChange(player, this.getAngles(easiest))) {
                    easiest = wrapped
                    vector = csp.point
                    block = block2
                }
            }

        })
        
        if (easiest !== null) return [easiest, vector, block];
        else return false;
    }

    breakBlock() {
        attackBind.setState(true);
    }

    onTick() {
        if(!this.enabled) return;
        if(Client.isInGui()) return attackBind.setState(false);
        attackBind.setState(true);

        if(Date.now() - this.startMine >= 15000) {
            ChatLib.chat('been mining same block for over 15 seconds, stopping.')
            return this.enabled = false;
        }

        try {
            if(this.newBlock) {
                let block = this?.getClosest(data.miningBot.radius, data.miningBot.height, data.miningBot.depth)
                
                if(!block) return this.newBlock = true;
                else {
                    this.data = {
                        blockPos: block[0],
                        vector: block[1],
                        block: block[2]
                    }

                    this.startMine = Date.now();
                    this.breakBlock();
                    return this.newBlock = false;
                }
            } else {
                if(Rotation.isWorking()) return;
                if(!this?.data?.block) return this.newBlock = true;

                if(World.getBlockAt(this?.data?.block?.pos)?.type?.getID() !== 0) {
                    if(!this?.data?.vector) return this.newBlock = true;
                    else {
                        if(this.rotated) return;
                        this.rotated = true;
                        Rotation.startRotation(this?.data?.vector);
                    }
                } else {
                    this.rotated = false;
                    this.newBlock = true;

                    return;
                }
            }
        } catch (error) {
            ChatLib.chat(error)
        }
    }

    start() {
        this.startMine = Date.now()
        this.newBlock = true;
        this.rotated = false;
        this.data = {};
    }

    setEnabled(value) {
        this.enabled = value;
    }
}

let mb = new MiningBot();
let enabled = false;

register('tick', () => {
    mb.onTick();
})

const key = new KeyBind('Mining Bot', Keyboard.KEY_NONE, "Clusterfuck").registerKeyPress(() => {
    enabled = !enabled;
    ChatLib.chat('miningbot: ' + enabled);
    mb.setEnabled(enabled);
    attackBind.setState(false);
    if(enabled) mb.start();
})