//DEPENDANCY: ge.js, tools.js
//Provides tools and block definitions for block library.

//getBlockData >> returns the relevent block data for the block found with the given spec. If no block is found, return an obsolete block data.
ge.Tools.getBlockData = function(spec){
    for (var i = 0; i < ge.blocks.length; i++) {
        if (ge.blocks[i].spec == spec) {
            return ge.blocks[i];
        }
    }
    
    return {
        type: undefined,
        spec: spec,
        renderLabel: spec,
        scratchblocks: undefined,
        parameters: undefined,
        group: "Obsolete"
    };
};

//BLOCK DEFINITIONS!
//**//EVENTS
ge.blocks.push({
                type: "hat",
                spec: "whenGreenFlag",
                label: "when @greenFlag clicked",
                group: "Events"
            });
ge.blocks.push({
                type: "hat",
                spec: "whenKeyPressed",
                label: "when %m.key key pressed",
                group: "Events"
            });
ge.blocks.push({
                type: "hat",
                spec: "whenClicked",
                label: "when this sprite clicked",
                group: "Events"
});
ge.blocks.push({
                type: "hat",
                spec: "whenSceneStarts",
                label: "when backdrop switches to %m.backdrop",
                group: "Events"
});
ge.blocks.push({
                type: "hat",
                spec: "whenSensorGreaterThan",
                label: "when %m.triggerSensor &gt; %n",
                group: "Events"
});
ge.blocks.push({
                type: "hat",
                spec: "whenIReceive",
                label: "when I receive %m.broadcast",
                group: "Events"
});
ge.blocks.push({
                type: "command",
                spec: "broadcast:",
                label: "broadcast %m.broadcast",
                group: "Events"
});
ge.blocks.push({
                type: "command",
                spec: "doBroadcastAndWait",
                label: "broadcast %m.broadcast and wait",
                group: "Events"
});
//**//CONTROL
ge.blocks.push({
                type: "command",
                spec: "wait:elapsed:from:",
                label: "wait %n secs",
                group: "Control"
            });
ge.blocks.push({
                type: "c",
                spec: "doRepeat",
                label: "repeat %n",
                group: "Control"
            });
ge.blocks.push({
                type: "c",
                spec: "doForever",
                label: "forever",
                group: "Control",
                cap: true
            });
ge.blocks.push({
                type: "c",
                spec: "doIf",
                label: "if %b then",
                group: "Control"
            });
ge.blocks.push({
                type: "special",
                spec: "doIfElse",
                label: ["if %b then",
                                "else"],
                group: "Control"
});
ge.blocks.push({
                type: "command",
                spec: "doWaitUntil",
                label: "wait until %b",
                group: "Control"
            });
ge.blocks.push({
                type: "c",
                spec: "doUntil",
                label: "repeat until %b",
                group: "Control"
});
ge.blocks.push({
                type: "command",
                spec: "stopScripts",
                label: "stop %m.stop",
                group: "Control",
                cap: true
});
ge.blocks.push({
                type: "hat",
                spec: "whenCloned",
                label: "when I start as a clone",
                group: "Control",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "createCloneOf",
                label: "create clone of %m.spriteOnly",
                group: "Control"
});
ge.blocks.push({
                type: "command",
                spec: "deleteClone",
                label: "delete this clone",
                group: "Control",
                cap: true,
                owner: "sprite"
});
//**//SENSING
ge.blocks.push({
                type: "boolean",
                spec: "touching:",
                label: "touching %m.touching ?",
                group: "Sensing",
                owner: "sprite"
            });
ge.blocks.push({
                type: "boolean",
                spec: "touchingColor:",
                label: "touching color %c?",
                group: "Sensing",
                owner: "sprite"
            });
ge.blocks.push({
                type: "boolean",
                spec: "color:sees:",
                label: "color %c is touching %c?",
                group: "Sensing",
                owner: "sprite"
            });
ge.blocks.push({
                type: "reporter",
                spec: "distanceTo:",
                label: "distance to %m.spriteOrMouse",
                group: "Sensing",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "doAsk",
                label: "ask %s and wait",
                group: "Sensing"
});
ge.blocks.push({
                type: "reporter",
                spec: "answer",
                label: "answer",
                group: "Sensing"
});
ge.blocks.push({
                type: "boolean",
                spec: "keyPressed:",
                label: "key %m.key pressed?",
                group: "Sensing"
});
ge.blocks.push({
                type: "boolean",
                spec: "mousePressed",
                label: "mouse down?",
                group: "Sensing"
});
ge.blocks.push({
                type: "reporter",
                spec: "mouseX",
                label: "mouse x",
                group: "Sensing"
});
ge.blocks.push({
                type: "reporter",
                spec: "mouseY",
                label: "mouse y",
                group: "Sensing"
});
ge.blocks.push({
                type: "reporter",
                spec: "soundLevel",
                label: "loudness",
                group: "Sensing"
});
ge.blocks.push({
                type: "reporter",
                spec: "timer",
                label: "timer",
                group: "Sensing"
            });
ge.blocks.push({
                type: "command",
                spec: "timerReset",
                label: "reset timer",
                group: "Sensing"
            });
ge.blocks.push({
                type: "reporter",
                spec: "senseVideoMotion",
                label: "video %m.videoMotionType on %m.stageOrThis",
                group: "Sensing"
});
ge.blocks.push({
                type: "command",
                spec: "setVideoState",
                label: "turn video %m.videoState",
                group: "Sensing"
});
ge.blocks.push({
                type: "command",
                spec: "setVideoTransparency",
                label: "set video transparency to %n %",
                group: "Sensing"
            });
ge.blocks.push({
                type: "reporter",
                spec: "getAttribute:of:",
                label: "%m.sensor of %m.spriteOrStage",
                group: "Sensing"
            });
ge.blocks.push({
                type: "reporter",
                spec: "timeAndDate",
                label: "current %m.timeAndDate",
                group: "Sensing"
            });
ge.blocks.push({
                type: "reporter",
                spec: "timestamp",
                label: "days since 2000",
                group: "Sensing"
});
ge.blocks.push({
                type: "reporter",
                spec: "getUserName",
                label: "username",
                group: "Sensing"
});
//**//OPERATORS
ge.blocks.push({
                type: "reporter",
                spec: "+",
                label: "%n + %n",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "-",
                label: "%n - %n",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "*",
                label: "%n * %n",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "/",
                label: "%n / %n",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "randomFrom:to:",
                label: "pick random %n to %n",
                group: "Operators"
            });
ge.blocks.push({
                type: "boolean",
                spec: "<",
                label: "%s &lt; %s",
                group: "Operators"
            });
ge.blocks.push({
                type: "boolean",
                spec: "=",
                label: "%s = %s",
                group: "Operators"
            });
ge.blocks.push({
                type: "boolean",
                spec: ">",
                label: "%s &gt; %s",
                group: "Operators"
            });
ge.blocks.push({
                type: "boolean",
                spec: "&",
                label: "%b and %b",
                group: "Operators"
            });
ge.blocks.push({
                type: "boolean",
                spec: "|",
                label: "%b or %b",
                group: "Operators"
            });
ge.blocks.push({
                type: "boolean",
                spec: "not",
                label: "not %b",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "concatenate:with:",
                label: "join %s %s",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "letter:of:",
                label: "letter %n of %s",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "stringLength:",
                label: "length of %s",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "%",
                label: "%n mod %n",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "rounded",
                label: "round %n",
                group: "Operators"
            });
ge.blocks.push({
                type: "reporter",
                spec: "computeFunction:of:",
                label: "%m.mathOp of %n",
                group: "Operators"
            });
//**//CUSTOM
/*
The "More Blocks" section has special defining blocks,
which is why the label is undefined (as the label is defined
at a later point)
*/
ge.blocks.push({
                type: "define",
                spec: "procDef",
                label: undefined,
                group: "Custom"
});
ge.blocks.push({
                type: "call",
                spec: "call",
                label: undefined,
                group: "Custom"
});
ge.blocks.push({
                type: "getParam",
                spec: "getParam",
                label: undefined,
                group: "Custom"
});
//**//MOTION
ge.blocks.push({
                type: "command",
                spec: "forward:",
                label: "move %n steps",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "turnRight:",
                label: "turn @turnRight %n degrees",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "turnLeft:",
                label: "turn @turnLeft %n degrees",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "heading:",
                label: "point in direction %d.direction",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "pointTowards:",
                label: "point towards %m.spriteOrMouse",
                group: "Motion",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "gotoX:y:",
                label: "go to x:%n y:%n",
                group: "Motion",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "gotoSpriteOrMouse:",
                label: "go to %m.spriteOrMouse",
                group: "Motion",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "glideSecs:toX:y:elapsed:from:",
                label: "glide %n secs to x: %n y: %n",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "changeXposBy:",
                label: "change x by %n",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "xpos:",
                label: "set x to %n",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "changeYposBy:",
                label: "change y by %n",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "ypos:",
                label: "set y to %n",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "bounceOffEdge",
                label: "if on edge, bounce",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "setRotationStyle",
                label: "set rotation style %m.rotationStyle",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "reporter",
                spec: "xpos",
                label: "x position",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "reporter",
                spec: "ypos",
                label: "y position",
                group: "Motion",
                owner: "sprite"
});
ge.blocks.push({
                type: "reporter",
                spec: "heading",
                label: "direction",
                group: "Motion",
                owner: "sprite"
});
//**//LOOKS
ge.blocks.push({
                type: "command",
                spec: "say:duration:elapsed:from:",
                label: "say %s for %n secs",
                group: "Looks",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "say:",
                label: "say %s",
                parameters: ["string"],
                group: "Looks",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "think:duration:elapsed:from:",
                label: "think %s for %n secs",
                group: "Looks",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "think:",
                label: "think %s",
                group: "Looks",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "show",
                label: "show",
                group: "Looks",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "hide",
                label: "hide",
                group: "Looks",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "lookLike:",
                label: "switch costume to %m.costume",
                group: "Looks",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "nextCostume",
                label: "next costume",
                parameters: [],
                group: "Looks",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "changeGraphicEffect:by:",
                label: "change %m.effect effect by %n",
                group: "Looks"
            });
ge.blocks.push({
                type: "command",
                spec: "setGraphicEffect:to:",
                label: "set %m.effect effect to %n",
                group: "Looks"
            });
ge.blocks.push({
                type: "command",
                spec: "filterReset",
                label: "clear graphic effects",
                group: "Looks"
            });
ge.blocks.push({
                type: "command",
                spec: "changeSizeBy:",
                label: "change size by %n",
                group: "Looks",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "setSizeTo:",
                label: "set size to %n %",
                group: "Looks",
                owner: "sprite"
            });
ge.blocks.push({
                type: "command",
                spec: "comeToFront",
                label: "go to front",
                group: "Looks",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "goBackByLayers:",
                label: "go back %n layers",
                group: "Looks",
                owner: "sprite"
});
ge.blocks.push({
                type: "reporter",
                spec: "costumeIndex",
                label: "costume #",
                group: "Looks",
                owner: "sprite"
});
ge.blocks.push({
                type: "reporter",
                spec: "scale",
                label: "size",
                group: "Looks",
                owner: "sprite"
});
//Stage-only blocks
ge.blocks.push({
                type: "command",
                spec: "startScene",
                label: "switch backdrop to %m.backdrop",
                group: "Looks",
                owner: "stage"
            });
ge.blocks.push({
                type: "command",
                spec: "startSceneAndWait",
                label: "switch backdrop to %m.backdrop and wait",
                group: "Looks",
                owner: "stage"
            });
ge.blocks.push({
                type: "command",
                spec: "nextScene",
                label: "next backdrop",
                group: "Looks",
                owner: "stage"
            });
ge.blocks.push({
                type: "reporter",
                spec: "sceneName",
                label: "backdrop name",
                group: "Looks",
                owner: "stage"
            });
ge.blocks.push({
                type: "reporter",
                spec: "backgroundIndex",
                label: "backdrop #",
                group: "Looks",
                owner: "stage"
            });
//**//SOUND
ge.blocks.push({
                type: "command",
                spec: "playSound:",
                label: "play sound %m.sound",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "doPlaySoundAndWait",
                label: "play sound %m.sound until done",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "stopAllSounds",
                label: "stop all sounds",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "playDrum",
                label: "play drum %n for %n beats",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "rest:elapsed:from:",
                label: "rest for %n beats",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "noteOn:duration:elapsed:from:",
                label: "play note %n for %n beats",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "instrument:",
                label: "set instrument to %n",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "changeVolumeBy:",
                label: "change volume by %n",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "setVolumeTo:",
                label: "set volume to %n %",
                group: "Sound"
});
ge.blocks.push({
                type: "reporter",
                spec: "volume",
                label: "volume",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "changeTempoBy:",
                label: "change tempo by %n",
                group: "Sound"
});
ge.blocks.push({
                type: "command",
                spec: "setTempoTo:",
                label: "set tempo to %n bpm",
                group: "Sound"
});
ge.blocks.push({
                type: "reporter",
                spec: "tempo",
                label: "tempo",
                group: "Sound"
});
//**//PEN
ge.blocks.push({
                type: "command",
                spec: "clearPenTrails",
                label: "clear",
                group: "Pen"
});
ge.blocks.push({
                type: "command",
                spec: "stampCostume",
                label: "stamp",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "putPenDown",
                label: "pen down",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "putPenUp",
                label: "pen up",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "penColor:",
                label: "set pen color to %c",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "changePenHueBy:",
                label: "change pen color by %n",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "setPenHueTo:",
                label: "set pen color to %n",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "setPenShadeTo:",
                label: "set pen shade to %n",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "changePenShadeBy:",
                label: "change pen shade by %n",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "changePenSizeBy:",
                label: "change pen size by %n",
                group: "Pen",
                owner: "sprite"
});
ge.blocks.push({
                type: "command",
                spec: "penSize:",
                label: "set pen size to %n",
                group: "Pen",
                owner: "sprite"
});
//**//DATA
//Variables blocks
ge.blocks.push({
                type: "command",
                spec: "setVar:to:",
                label: "set %m.var to %s",
                group: "Variables"
});
ge.blocks.push({
                type: "command",
                spec: "changeVar:by:",
                label: "change %m.var by %n",
                group: "Variables"
});
ge.blocks.push({
                type: "command",
                spec: "showVariable:",
                label: "show variable %m.var",
                group: "Variables"
});
ge.blocks.push({
                type: "command",
                spec: "hideVariable:",
                label: "hide variable %m.var",
                group: "Variables"
});
//Variable block placeholder
ge.blocks.push({
                type: "readVariable",
                spec: "readVariable",
                label: undefined,
                group: "Variables"
});
//List blocks
ge.blocks.push({
                type: "command",
                spec: "append:toList:",
                label: "add %s to %m.list",
                group: "List"
});
ge.blocks.push({
                type: "command",
                spec: "deleteLine:ofList:",
                label: "delete %n of %m.list",
                group: "List"
});
ge.blocks.push({
                type: "command",
                spec: "insert:at:ofList:",
                label: "insert %s at %n of %m.list",
                group: "List"
});
ge.blocks.push({
                type: "command",
                spec: "setLine:ofList:to:",
                label: "replace item %n of %m.list with %s",
                group: "List"
});
ge.blocks.push({
                type: "command",
                spec: "showList:",
                label: "show list %m.list",
                group: "List"
});
ge.blocks.push({
                type: "command",
                spec: "hideList:",
                label: "hide list %m.list",
                group: "List"
});
ge.blocks.push({
                type: "reporter",
                spec: "getLine:ofList:",
                label: "item %n of %m.list",
                group: "List"
});
ge.blocks.push({
                type: "reporter",
                spec: "lineCountOfList:",
                label: "length of %m.list",
                group: "List"
});
ge.blocks.push({
                type: "boolean",
                spec: "list:contains:",
                label: "%m.list contains %s",
                group: "List"
});