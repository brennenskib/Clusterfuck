import { data } from "../data"

register("packetSent", (packet, event) => {
    if(!data.noremovecobble || World.getBlockAt(new BlockPos(packet.func_179715_a())).type.getID() !== 4) return;
    cancel(event);
}).setFilteredClass(net.minecraft.network.play.client.C07PacketPlayerDigging);