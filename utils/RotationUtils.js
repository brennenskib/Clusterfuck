function setAngles(yaw, pitch) {
    if(!World.isLoaded()) return;
    Client.getMinecraft().field_71439_g.field_70177_z = yaw
    Client.getMinecraft().field_71439_g.field_70125_A = pitch
}

class Rotations {
    constructor(velocity) {
        this.velocity = velocity;
        this.working = false;
    }

    getVector(yaw, pitch) {
        let vector = Player.getPlayer().func_174824_e(1).func_178787_e(new net.minecraft.util.Vec3(
            Math.sin(-yaw * (Math.PI/180) - Math.PI) * -Math.cos(-pitch * (Math.PI/180)),
            Math.sin(-pitch * (Math.PI/180)),
            Math.cos(-yaw * (Math.PI/180) - Math.PI) * -Math.cos(-pitch * (Math.PI/180)),
        ));

        return vector;
    }

    wrap180(angle) {
        angle %= 360.0;
        while (angle >= 180.0)
          angle -= 360.0;
        while (angle < -180.0)
          angle += 360.0;
        return angle;
    }

    isWorking() {
        return this.working;
    }

<<<<<<< HEAD
=======
    getHalfRange(number) {
        let half = number / 2;
        
        if (half % 1 === 0.5) {
            let lower = Math.floor(half);
            let upper = Math.ceil(half);
            return [lower, upper];
        }
        
        return [ Math.round(half) ];
    }


>>>>>>> 096c39e (trimonu i4 legit)
    startRotation(vec, then) {
        if(!vec) return;
        if (
            Client.getMinecraft().field_71462_r == null || 
            Client.getMinecraft().field_71462_r instanceof net.minecraft.client.gui.GuiIngameMenu || 
            Client.getMinecraft().field_71462_r instanceof net.minecraft.client.gui.GuiChat
        ) {
            if(this.working) return;
            new Thread(() => {
<<<<<<< HEAD
                    this.working = true;
                    let eyes = Player.getPlayer().func_174824_e(1)

                    let deltaX = vec?.field_72450_a - eyes?.field_72450_a;
                    let deltaY = vec?.field_72448_b - eyes?.field_72448_b;
                    let deltaZ = vec?.field_72449_c - eyes?.field_72449_c;

                    let dist = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ)
                    let pitch = -Math.atan2(dist, deltaY)
                    let yaw = Math.atan2(deltaZ, deltaX)

                    pitch = this.wrap180(((pitch * 180.0) / Math.PI + 90.0) * - 1.0 - Player.getPlayer().field_70125_A)
                    yaw = this.wrap180((yaw * 180.0) / Math.PI - 90.0 - Player.getPlayer().field_70177_z)

                    for (i = 0; i < this.velocity; i++) {
                        if(!this.working) return;

                        Player.getPlayer().field_70177_z = Player.getPlayer().field_70177_z + (yaw / this.velocity)
                        Player.getPlayer().field_70125_A =  Player.getPlayer().field_70125_A + (pitch / this.velocity)
                        Thread.sleep(1)
                    }

                    this.working = false;
                    
                    if(then) then();
                    else return;
            }).start()
        }
    }
}

=======
                if(Math.random() > 0.5) {
                    this.working = true;

                    let halfingPoint = this.getHalfRange(this.velocity);
    
                    let eyes = Player.getPlayer().func_174824_e(1)
    
                    let deltaX = vec?.field_72450_a - eyes?.field_72450_a;
                    let deltaY = vec?.field_72448_b - eyes?.field_72448_b;
                    let deltaZ = vec?.field_72449_c - eyes?.field_72449_c;
    
                    let dist = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ)
                    let pitch = -Math.atan2(dist, deltaY)
                    let yaw = Math.atan2(deltaZ, deltaX)
    
                    pitch = this.wrap180(((pitch * 180.0) / Math.PI + 90.0) * - 1.0 - Player.getPlayer().field_70125_A)
                    yaw = this.wrap180((yaw * 180.0) / Math.PI - 90.0 - Player.getPlayer().field_70177_z)
    
                    let deltaYaw = yaw - Player.getYaw()
                    let deltaPitch = pitch - Player.getPitch()
    
                    for (i = 0; i < this.velocity; i++) {
                        if(!this.working) return;
    
                        if(halfingPoint.some(num => num > i)) {
                            Player.getPlayer().field_70177_z = Player.getPlayer().field_70177_z + (yaw / this.velocity) - (0.0009 * (deltaYaw));
                            Player.getPlayer().field_70125_A =  Player.getPlayer().field_70125_A + (pitch / this.velocity) - (0.0009 * (deltaPitch));
                        } else if(halfingPoint.some(num => num < i)) {
                            Player.getPlayer().field_70177_z = Player.getPlayer().field_70177_z + (yaw / this.velocity) + (0.0009 * (deltaYaw));
                            Player.getPlayer().field_70125_A =  Player.getPlayer().field_70125_A + (pitch / this.velocity) + (0.0009 * (deltaPitch));
                        }
                        Thread.sleep(1)
                    }
    
                    this.working = false;
                        
                    if(then) then();
                    else return;
                } else {
                    this.working = true;

                    let tempFastVelo = Math.floor(this.velocity * 0.85)
    
                    let eyes = Player.getPlayer().func_174824_e(1)
    
                    let deltaX = vec?.field_72450_a - eyes?.field_72450_a;
                    let deltaY = vec?.field_72448_b - eyes?.field_72448_b;
                    let deltaZ = vec?.field_72449_c - eyes?.field_72449_c;
    
                    let dist = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ)
                    let pitch = -Math.atan2(dist, deltaY)
                    let yaw = Math.atan2(deltaZ, deltaX)
    
                    pitch = this.wrap180(((pitch * 180.0) / Math.PI + 90.0) * - 1.0 - Player.getPlayer().field_70125_A)
                    yaw = this.wrap180((yaw * 180.0) / Math.PI - 90.0 - Player.getPlayer().field_70177_z)
    
                    for (i = 0; i < tempFastVelo; i++) {
                        if(!this.working) return;
                        Player.getPlayer().field_70177_z = Player.getPlayer().field_70177_z + (yaw / tempFastVelo)
                        Player.getPlayer().field_70125_A =  Player.getPlayer().field_70125_A + (pitch / tempFastVelo)
                        Thread.sleep(1)
                    }
    
                    this.working = false;
                        
                    if(then) then();
                    else return;
                }
            }).start()
        }
    }

    toVec(x, y, z) {
        return new net.minecraft.util.Vec3(x, y, z)
    }
}

register('renderOverlay', () => {
    Renderer.drawString(`${Math.round(Player.getX())}, ${Math.round(Player.getY())}, ${Math.round(Player.getZ())}`, 50, 50, true)
})

>>>>>>> 096c39e (trimonu i4 legit)
global.clusterfuck.rot = Rotations