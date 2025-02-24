import { data } from "../data"

let prefix = `&l&8Floyd &r&l&f>&r&f`

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");

const keybinds = [
    Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i()
];

function unpressAllMovementKeys() {
    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, false))
}

function pressAllPressedMovementKeys() {
    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, Keyboard.isKeyDown(keybind)))
}

function setSlot(index) {
    Client.getMinecraft().field_71439_g.field_71071_by.field_70461_c = index;
}

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

const key = new KeyBind("Mastiff Wish", Keyboard.KEY_NONE, "Clusterfuck")

let shouldOpen = false;

register(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, event => {
    if(shouldOpen) {
        cancel(event);
    }
})

let first = false;
let second = false;

let tickDelay = 35;
let delay = tickDelay*50

function sendPacket(packet) {
    unpressAllMovementKeys();
    Client.sendPacket(packet);
}

register("packetReceived", (packet, event) => {
    if(!shouldOpen) return;
    new Thread(() => {
        if(!first && !second) {
            Thread.sleep(50)
            sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 35 + data.mastiffSlot, 0, 0, null, 0));
            Thread.sleep(50)
            Client?.currentGui?.close()
            Thread.sleep(delay + 150)
            Player.getPlayer()?.func_71040_bB(false)
            ChatLib.command("wardrobe")
            first = true;
        } else if(first && !second) {
            sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 35 + data.ogSlot, 0, 0, null, 0));
            Thread.sleep(50)
            Client?.currentGui?.close()
            Thread.sleep(50)
            ChatLib.chat(`${prefix} Finished Mastiff Wish!`)
            second = true;
            shouldOpen = false;
        } else if(first && second) {
            Client.currentGui.close()
            shouldOpen = false;
        }
    }).start()

}).setFilteredClass(S2DPacketOpenWindow)

register("renderOverlay", () => {
    if(!shouldOpen) return;
    Renderer.drawString("Mastiff Wishing", Renderer.screen.getWidth()/2 - (Renderer.getStringWidth("Mastiff Wishing") / 2), Renderer.screen.getHeight()/2, true)
})

function start() {
    if(!World.isLoaded() /*|| !Server?.getIP()?.toLowerCase()?.includes('hypixel')*/) return;
    if(
        data.mastiffSlot < 1 || 
        data.mastiffSlot > 9 ||
        data.ogSlot < 1 || 
        data.ogSlot > 9 ||
        data.swordSlot < 1 || 
        data.swordSlot > 8
    ) return ChatLib.chat(`${prefix} Malformed Data`)

    ChatLib.chat(`${prefix} Mastiff Wishing`)

    shouldOpen = true;
    first = false;
    second = false;

    setSlot(data.swordSlot - 1)
    Client.scheduleTask(1, () => {
        ChatLib.command("wardrobe")
    })
}

register('tick', () => {
    if(shouldOpen && Client.isInGui()) pressAllPressedMovementKeys();
})

key.registerKeyPress(() => {
    start();
})