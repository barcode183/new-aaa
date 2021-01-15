var flipper = 1;
var flip = false;
function doFlip() {
    flip = !flip;
    flipper = flip ? 1.3 : -0.85;
}

var font = false;
function drawAALine(angle, len, color, text) {
    var origin = Entity.GetProp(Entity.GetLocalPlayer(), "DT_BaseEntity", "m_vecOrigin");

    var angleRad = angle * (Math.PI / 180);
    var endPos = [origin[0], origin[1], origin[2]];
    endPos[0] += Math.cos(angleRad) * len;
    endPos[1] += Math.sin(angleRad) * len;

    var originScreen = Render.WorldToScreen(origin);
    var endScreen = Render.WorldToScreen(endPos);

    Render.Line(originScreen[0], originScreen[1], endScreen[0], endScreen[1], color);
    Render.String(endScreen[0]+1, endScreen[1]+1, 1, text, [0,0,0,180], font);
    Render.String(endScreen[0], endScreen[1], 1, text, color, font);
}

function render() {
    if (Entity.IsValid(Entity.GetLocalPlayer())) {
        font = Render.AddFont("Arial.ttf", 12, 800);
        drawAALine(Local.GetFakeYaw(), 40, [0, 100, 255, 255], "FAKE");
        drawAALine(Local.GetRealYaw(), 45, [255, 0, 0, 255], "REAL");
    }
}

function run() {
    var v = Entity.GetProp(Entity.GetLocalPlayer(), "DT_CSPlayer", "m_vecVelocity[0]");
    var speed = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    var crouch = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_flDuckAmount") > 0.4;

    var r = Math.random();
    var mult = flipper;

    AntiAim.SetOverride(1);
    if (speed < 1) { // Standing AA
        AntiAim.SetLBYOffset(-60 * mult + r*6*mult);
        AntiAim.SetRealOffset(-14 * mult);
        AntiAim.SetFakeOffset(5 * mult * r);
    } else { // Moving AA

        // Force high delta when crouch-walking or moving fast
        if (crouch || speed > 130) mult *= 2;

        AntiAim.SetLBYOffset(20 * mult);
        AntiAim.SetRealOffset(30 * mult + r*10*mult);
        AntiAim.SetFakeOffset(5 * mult);
    }
}

Cheat.RegisterCallback("bullet_impact", "doFlip");
Cheat.RegisterCallback("CreateMove", "run");

// Comment out this line if you don't want the REAL and FAKE lines.
Cheat.RegisterCallback("Draw", "render");
