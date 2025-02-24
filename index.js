global.clusterfuck = {};

const MainMenu = Java.type('net.minecraft.client.gui.GuiMainMenu');
const splashText = MainMenu.class.getDeclaredField('field_73975_c');
const sprint = new KeyBind(Client.getMinecraft().field_71474_y.field_151444_V)
splashText.setAccessible(true);

register(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, (event) => {
   if(!(Client.currentGui.get() instanceof MainMenu)) return;
   splashText.set(Client.currentGui.get(), 'b');
});

register("tick", () => {
    sprint.setState(true);
})

import "./utils/RotationUtils"; // new global.clusterfuck.rot

import "./modules/Barphase";
import "./modules/SchizoTerms";
import "./modules/VertChine";
import "./modules/MastiffWish";
import "./modules/NoRemoveCobble";
import "./modules/ExcavatorMacro";
<<<<<<< HEAD
import "./modules/MiningBot";
=======
import "./modules/MiningBot";
import "./modules/legiti4";

const r = new global.clusterfuck.rot(150);

register('command', (x, y, z) => {
    let xCoord = parseFloat(x)
    let yCoord = parseFloat(y)
    let zCoord = parseFloat(z)

    r.startRotation(new net.minecraft.util.Vec3(xCoord, yCoord, zCoord))
}).setName('looktowards')
>>>>>>> 096c39e (trimonu i4 legit)
