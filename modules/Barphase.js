import { data } from "../data"

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

function jump() {
    Client.scheduleTask(() => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(), true) })
    Client.scheduleTask(2, () => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(), false) })
}

register("tick", () => {
    if(!data.barphase) return;
    if (!Player.getPlayer().field_70124_G || !Player.getPlayer().field_70123_F) return;

    let ID = World.getBlockAt(Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ())).type.getID()
    let ID1 = World.getBlockAt(Math.floor(Player.getX()), Math.floor(Player.getY()) + 1, Math.floor(Player.getZ())).type.getID()

    if (ID === 0 && ID1 === 0) return;
    if (ID !== 0 && ID !== 101) return;
    if (ID1 !== 0 && ID1 !== 101) return;

    let distanceX = 0;
    let distanceZ = 0;

    if (Player.getZ() - Math.floor(Player.getZ()) == 0.13749998807907104) { distanceZ = + 0.06 }
    if (Player.getX() - Math.floor(Player.getX()) == 0.13749998807907104) { distanceX = + 0.06 }
    if (Player.getZ() - Math.floor(Player.getZ()) == 0.862500011920929) { distanceZ = - 0.06 }
    if (Player.getX() - Math.floor(Player.getX()) == 0.862500011920929) { distanceX = - 0.06 }

    unpressAllMovementKeys();
    jump()
    Player.getPlayer().func_70107_b(Player.getX() + distanceX, Player.getY(), Player.getZ() + distanceZ);
    
    Client.scheduleTask(0, () => {
        Player.getPlayer().func_70107_b(Player.getX() + distanceX * 5, Player.getY(), Player.getZ() + distanceZ * 5);
        pressAllPressedMovementKeys();
    })
})