//***BLOCKS***//
//**//EVENTS
blocks.push({
                type: "hat",
                spec: "whenGreenFlag",
		label: "when @greenFlag clicked",
		parameters: [],
                group: "Events"
            });
blocks.push({
                type: "hat",
                spec: "whenKeyPressed",
		label: "when %m.key key pressed",
		parameters: ["dropdown"],
                group: "Events"
            });
blocks.push({
                type: "hat",
                spec: "whenClicked",
                label: "when this sprite clicked",
                parameters: [],
                group: "Events"
});
blocks.push({
                type: "hat",
                spec: "whenSceneStarts",
                label: "when backdrop switches to %m.backdrop",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "hat",
                spec: "whenSensorGreaterThan",
                label: "when %m.triggerSensor > %n",
                parameters: ["dropdown",
                             "number"],
                group: "Events"
});
blocks.push({
                type: "hat",
                spec: "whenIReceive",
                label: "when I receive %m.broadcast",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "command",
                spec: "broadcast:",
                label: "broadcast %m.broadcast",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "command",
                spec: "doBroadcastAndWait",
                label: "broadcast %m.broadcast and wait",
                parameters: ["dropdown"],
                group: "Events"
});
//**//CONTROL
blocks.push({
		type: "command",
		spec: "wait:elapsed:from:",
		label: "wait %n secs",
		parameters: ["number"],
		group: "Control"
	    });
blocks.push({
		type: "c",
		spec: "doRepeat",
		label: "repeat %n",
		parameters: ["number"],
		group: "Control"
	    });
blocks.push({
                type: "c",
                spec: "doForever",
		label: "forever",
		parameters: [],
                group: "Control"
            });
blocks.push({
		type: "c",
		spec: "doIf",
		label: "if %b then",
		parameters: ["boolean"],
		group: "Control"
	    });
blocks.push({
                type: "special",
                spec: "doIfElse",
                label: ["if %b then",
                                "else"],
                parameters: ["boolean"],
                group: "Control"
});
blocks.push({
		type: "command",
		spec: "doWaitUntil",
		label: "wait until %b",
		parameters: ["boolean"],
		group: "Control"
	    });
blocks.push({
                type: "c",
                spec: "doUntil",
                label: "repeat until %b",
                parameters: ["boolean"],
                group: "Control"
});
blocks.push({
                type: "command",
                spec: "stopScripts",
                label: "stop %m.stop",
                parameters: ["dropdown"],
                group: "Control"
});
blocks.push({
                type: "hat",
                spec: "whenCloned",
                label: "when I start as a clone",
                parameters: [],
                group: "Control"
});
blocks.push({
                type: "command",
                spec: "createCloneOf",
                label: "create clone of %m.spriteOnly",
                parameters: ["dropdown"],
                group: "Control"
});
blocks.push({
                type: "command",
                spec: "deleteClone",
                label: "delete this clone",
                parameters: [],
                group: "Control"
});
//**//SENSING
blocks.push({
		type: "boolean",
		spec: "touching:",
		label: "touching %m.touching?",
		parameters: ["dropdown"],
		group: "Sensing"
	    });
blocks.push({
		type: "boolean",
		spec: "touchingColor:",
		label: "touching color %c?",
		parameters: ["color"],
		group: "Sensing"
	    });
blocks.push({
		type: "boolean",
		spec: "color:sees:",
		label: "color %c is touching %c?",
		parameters: ["color",
                             "color"],
		group: "Sensing"
	    });
blocks.push({
                type: "reporter",
                spec: "distanceTo:",
                label: "distance to %m.spriteOrMouse",
                parameters: ["dropdown"],
                group: "Sensing"
});
blocks.push({
                type: "command",
                spec: "doAsk",
                label: "ask %s and wait",
                parameters: ["string"],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "answer",
                label: "answer",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "boolean",
                spec: "keyPressed:",
                label: "key %m.key pressed?",
                parameters: ["dropdown"],
                group: "Sensing"
});
blocks.push({
                type: "boolean",
                spec: "mousePressed",
                label: "mouse down?",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "mouseX",
                label: "mouse x",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "mouseY",
                label: "mouse y",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "soundLevel",
                label: "loudness",
                parameters: [],
                group: "Sensing"
});
blocks.push({
		type: "reporter",
		spec: "timer",
		label: "timer",
		parameters: [],
		group: "Sensing"
	    });
blocks.push({
		type: "command",
		spec: "timerReset",
		label: "reset timer",
		parameters: [],
		group: "Sensing"
	    });
blocks.push({
                type: "reporter",
                spec: "senseVideoMotion",
                label: "video %m.videoMotionType on %m.stageOrThis",
                parameters: ["dropdown",
                             "dropdown"],
                group: "Sensing"
});
blocks.push({
                type: "command",
                spec: "setVideoState",
                label: "turn video %m.videoState",
                parameters: ["dropdown"],
                group: "Sensing"
});
blocks.push({
		type: "command",
		spec: "setVideoTransparency",
		label: "set video transparency to %n %",
		parameters: ["number"],
		group: "Sensing"
	    });
blocks.push({
		type: "reporter",
		spec: "getAttribute:of:",
		label: "%m.sensor of %m.spriteOrStage",
		parameters: ["dropdown",
                             "dropdown"],
		group: "Sensing"
	    });
blocks.push({
		type: "reporter",
		spec: "timeAndDate",
		label: "current %m.timeAndDate",
		parameters: ["dropdown"],
		group: "Sensing"
	    });
blocks.push({
                type: "reporter",
                spec: "timestamp",
                label: "days since 2000",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "getUserName",
                label: "username",
                parameters: [],
                group: "Sensing"
});
//**//OPERATORS
blocks.push({
                type: "reporter",
                spec: "+",
                label: "%n + %n",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "reporter",
                spec: "-",
                label: "%n - %n",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "reporter",
                spec: "*",
                label: "%n * %n",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "reporter",
                spec: "/",
                label: "%n / %n",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "reporter",
                spec: "randomFrom:to:",
                label: "pick random %n to %n",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "boolean",
                spec: "<",
                label: "%s < %s",
                parameters: ["string",
			     "string"],
                group: "Operators"
            });
blocks.push({
                type: "boolean",
                spec: "=",
                label: "%s = %s",
                parameters: ["string",
			     "string"],
                group: "Operators"
            });
blocks.push({
                type: "boolean",
                spec: ">",
                label: "%s > %s",
                parameters: ["string",
			     "string"],
                group: "Operators"
            });
blocks.push({
		type: "boolean",
		spec: "&",
		label: "%b and %b",
		parameters: ["boolean",
                             "boolean"],
		group: "Operators"
	    });
blocks.push({
		type: "boolean",
		spec: "|",
		label: "%b or %b",
		parameters: ["boolean",
                             "boolean"],
		group: "Operators"
	    });
blocks.push({
		type: "boolean",
		spec: "not",
		label: "not %b",
		parameters: ["boolean"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "concatenate:with:",
		label: "join %s %s",
		parameters: ["string",
                             "string"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "letter:of:",
		label: "letter %n of %s",
		parameters: ["number",
                             "string"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "stringLength:",
		label: "length of %s",
		parameters: ["string"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "%",
		label: "%n mod %n",
		parameters: ["number",
                             "number"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "rounded",
		label: "round %n",
		parameters: ["number"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "computeFunction:of:",
		label: "%m.mathOp of %n",
		parameters: ["dropdown",
			     "number"],
		group: "Operators"
	    });
//**//CUSTOM
/*
The "More Blocks" section is special;
there should only be two blocks in it at once.
The first is the "procDef" block, (the "define" block)
The second is the "call" block (the actual custom block)
*/
blocks.push({
                type: "define",
                spec: "procDef",
                label: undefined,
                group: "Custom"
});
blocks.push({
                type: "call",
                spec: "call",
                label: undefined,
                group: "Custom"
});
blocks.push({
                type: "getParam",
                spec: "getParam",
                label: undefined,
                group: "Custom"
});

//**//MOTION
blocks.push({
                type: "command",
                spec: "forward:",
                label: "move %n steps",
                parameters: ["number"],
                group: "Motion"
})
blocks.push({
		type: "command",
		spec: "pointTowards:",
		label: "point towards %m.mathOp.spriteOrMouse",
		parameters: ["dropdown"],
		group: "Motion"
	    });
blocks.push({
		type: "command",
		spec: "gotoX:y:",
		label: "go to x:%n y:%n",
		parameters: ["number",
			     "number"],
		group: "Motion"
	    });
blocks.push({
		type: "command",
		spec: "gotoSpriteOrMouse:",
		label: "go to %m.mathOp.spriteOrMouse",
		parameters: ["dropdown"],
		group: "Motion"
	    });
//**//LOOKS
blocks.push({
                type: "command",
                spec: "say:duration:elapsed:from:",
                label: "say %s for %n secs",
                parameters: ["text",
                             "number"],
                group: "Looks"
});
blocks.push({
		type: "command",
		spec: "say:",
		label: "say %s",
		parameters: ["string"],
		group: "Looks"
	    });
blocks.push({
                type: "command",
                spec: "think:duration:elapsed:from:",
                label: "think %s for %n secs",
                parameters: ["text",
                             "number"],
                group: "Looks"
});
blocks.push({
		type: "command",
		spec: "think:",
		label: "think %s",
		parameters: ["string"],
		group: "Looks"
	    });
blocks.push({
                type: "command",
                spec: "show",
		label: "show",
		parameters: [],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "hide",
		label: "hide",
		parameters: [],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "lookLike:",
                label: "switch costume to %m.costume",
                parameters: ["dropdown"],
                group: "Looks"
});
blocks.push({
                type: "command",
                spec: "nextCostume",
		label: "next costume",
		parameters: [],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "changeGraphicEffect:by:",
		label: "change %m.effect effect by %n",
		parameters: ["dropdown",
                             "number"],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "setGraphicEffect:to:",
		label: "set %m.effect effect to %n",
		parameters: ["dropdown",
                             "number"],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "filterReset",
		label: "clear graphic effects",
		parameters: [],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "changeSizeBy:",
                label: "change size by %n",
                parameters: ["number"],
                group: "Looks"
});
blocks.push({
		type: "command",
		spec: "setSizeTo:",
		label: "set size to %n %",
		parameters: ["number"],
		group: "Looks"
	    });
blocks.push({
                type: "command",
                spec: "comeToFront",
                label: "go to front",
                parameters: [],
                group: "Looks"
});
blocks.push({
                type: "command",
                spec: "goBackByLayers:",
                label: "go back %n layers",
                parameters: ["number"],
                group: "Looks"
});
blocks.push({
                type: "reporter",
                spec: "costumeIndex",
                label: "costume #",
                parameters: [],
                group: "Looks"
});
blocks.push({
                type: "reporter",
                spec: "scale",
                label: "size",
                parameters: [],
                group: "Looks"
});
//Stage-only blocks
blocks.push({
		type: "command",
		spec: "startScene",
		label: "switch backdrop to %m.backdrop",
		parameters: ["dropdown"],
		group: "Looks"
	    });
blocks.push({
		type: "command",
		spec: "startSceneAndWait",
		label: "switch backdrop to %m.backdrop and wait",
		parameters: ["dropdown"],
		group: "Looks"
	    });
blocks.push({
		type: "command",
		spec: "nextScene",
		label: "next backdrop",
		parameters: [],
		group: "Looks"
	    });
blocks.push({
		type: "reporter",
		spec: "sceneName",
		label: "backdrop name",
		parameters: [],
		group: "Looks"
	    });
blocks.push({
		type: "reporter",
		spec: "backgroundIndex",
		label: "backdrop #",
		parameters: [],
		group: "Looks"
	    });
//**//SOUND
blocks.push({
                type: "command",
                spec: "playSound:",
                label: "play sound %m.sound",
                parameters: ["dropdown"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "doPlaySoundAndWait",
                label: "play sound %m.sound until done",
                parameters: ["dropdown"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "stopAllSounds",
                label: "stop all sounds",
                parameters: [],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "playDrum",
                label: "play drum %n for %n beats",
                parameters: ["number",
                             "number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "rest:elapsed:from:",
                label: "rest for %n beats",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "noteOn:duration:elapsed:from:",
                label: "play note %n for %n beats",
                parameters: ["number",
                             "number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "instrument:",
                label: "set instrument to %n",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "changeVolumeBy:",
                label: "change volume by %n",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "setVolumeTo:",
                label: "set volume to %n %",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "reporter",
                spec: "volume",
                label: "volume",
                parameters: [],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "changeTempoBy:",
                label: "change tempo by %n",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "setTempoTo:",
                label: "set tempo to %n bpm",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "reporter",
                spec: "tempo",
                label: "tempo",
                parameters: [],
                group: "Sound"
});
//**//PEN
blocks.push({
                type: "command",
                spec: "clearPenTrails",
                label: "clear",
                parameters: [],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "stampCostume",
                label: "stamp",
                parameters: [],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "putPenDown",
                label: "pen down",
                parameters: [],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "putPenUp",
                label: "pen up",
                parameters: [],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "penColor:",
                label: "set pen color to %c",
                parameters: ["color"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "changePenHueBy:",
                label: "change pen color by %n",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "setPenHueTo:",
                label: "set pen color to %n",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "setPenShadeTo:",
                label: "set pen shade to %n",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "changePenShadeBy:",
                label: "change pen shade by %n",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "changePenSizeBy:",
                label: "change pen size by %n",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "penSize:",
                label: "set pen size to %n",
                parameters: ["number"],
                group: "Pen"
});
//**//DATA