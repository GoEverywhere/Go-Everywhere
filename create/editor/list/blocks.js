//***BLOCKS***//
//**//EVENTS
blocks.push({
                type: "hat",
                spec: "whenGreenFlag",
		scratchblocks: "when green flag clicked",
		renderLabel: "when  clicked",
		parameters: [],
                group: "Events"
            });
blocks.push({
                type: "hat",
                spec: "whenKeyPressed",
		scratchblocks: "when [%m.key{$1} v] key pressed",
		renderLabel: "when  key pressed",
		parameters: ["dropdown"],
                group: "Events"
            });
blocks.push({
                type: "hat",
                spec: "whenClicked",
                scratchblocks: "when this sprite clicked",
                renderLabel: "when this sprite clicked",
                parameters: [],
                group: "Events"
});
blocks.push({
                type: "hat",
                spec: "whenSceneStarts",
                scratchblocks: "when backdrop switches to [%m.backdrop{$1} v]",
                renderLabel: "when backdrop switches to ",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "hat",
                spec: "whenSensorGreaterThan",
                scratchblocks: "when [%m.triggerSensor{$1} v] > ($2)",
                renderLabel: "when  > ",
                parameters: ["dropdown",
                             "number"],
                group: "Events"
});
blocks.push({
                type: "hat",
                spec: "whenIReceive",
                scratchblocks: "when I receive [%m.broadcast{$1} v]",
                renderLabel: "when I receive ",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "command",
                spec: "broadcast:",
                scratchblocks: "broadcast [%m.broadcast{$1} v]",
                renderLabel: "broadcast ",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "command",
                spec: "doBroadcastAndWait",
                scratchblocks: "broadcast [%m.broadcast{$1} v] and wait",
                renderLabel: "broadcast  and wait",
                parameters: ["dropdown"],
                group: "Events"
});
//**//CONTROL
blocks.push({
		type: "command",
		spec: "wait:elapsed:from:",
		scratchblocks: "wait ($1) secs",
		renderLabel: "wait  secs",
		parameters: ["number"],
		group: "Control"
	    });
blocks.push({
		type: "c",
		spec: "doRepeat",
		scratchblocks: "repeat ($1)",
		renderLabel: "repeat ",
		parameters: ["number"],
		group: "Control"
	    });
blocks.push({
                type: "c",
                spec: "doForever",
		scratchblocks: "forever",
		renderLabel: "forever",
		parameters: [],
                group: "Control"
            });
blocks.push({
		type: "c",
		spec: "doIf",
		scratchblocks: "if <$1> then",
		renderLabel: "if  then",
		parameters: ["boolean"],
		group: "Control"
	    });
blocks.push({
                type: "special",
                spec: "doIfElse",
                scratchblocks: ["if <$1> then",
                                "else"],
                renderLabel: "if  then\nelse",
                parameters: ["boolean"],
                group: "Control"
});
blocks.push({
		type: "command",
		spec: "doWaitUntil",
		scratchblocks: "wait until <$1>",
		renderLabel: "wait until ",
		parameters: ["boolean"],
		group: "Control"
	    });
blocks.push({
                type: "c",
                spec: "doUntil",
                scratchblocks: "repeat until <$1>",
                renderLabel: "repeat until ",
                parameters: ["boolean"],
                group: "Control"
});
blocks.push({
                type: "command",
                spec: "stopScripts",
                scratchblocks: "stop [%m.stop{$1} v]",
                renderLabel: "stop ",
                parameters: ["dropdown"],
                group: "Control"
});
blocks.push({
                type: "hat",
                spec: "whenCloned",
                scratchblocks: "when I start as a clone",
                renderLabel: "when I start as a clone",
                parameters: [],
                group: "Control"
});
blocks.push({
                type: "command",
                spec: "createCloneOf",
                scratchblocks: "create clone of [%m.spriteOnly{$1} v]",
                renderLabel: "create clone of ",
                parameters: ["dropdown"],
                group: "Control"
});
blocks.push({
                type: "command",
                spec: "deleteClone",
                scratchblocks: "delete this clone",
                renderLabel: "delete this clone",
                parameters: [],
                group: "Control"
});
//**//SENSING
blocks.push({
		type: "boolean",
		spec: "touching:",
		scratchblocks: "< touching [%m.touching{$1} v]? >",
		renderLabel: "touching ?",
		parameters: ["dropdown"],
		group: "Sensing"
	    });
blocks.push({
		type: "boolean",
		spec: "touchingColor:",
		scratchblocks: "< touching color [#$1]? >",
		renderLabel: "touching color ?",
		parameters: ["color"],
		group: "Sensing"
	    });
blocks.push({
		type: "boolean",
		spec: "color:sees:",
		scratchblocks: "< color [#$1] is touching [#$2]? >",
		renderLabel: "color  is touching ?",
		parameters: ["color",
                             "color"],
		group: "Sensing"
	    });
blocks.push({
                type: "reporter",
                spec: "distanceTo:",
                scratchblocks: "( distance to [%m.spriteOrMouse{$1} v] )",
                renderLabel: "distance to ",
                parameters: ["dropdown"],
                group: "Sensing"
});
blocks.push({
                type: "command",
                spec: "doAsk",
                scratchblocks: "ask [$1] and wait",
                renderLabel: "ask  and wait",
                parameters: ["string"],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "answer",
                scratchblocks: "( answer )",
                renderLabel: "answer",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "boolean",
                spec: "keyPressed:",
                scratchblocks: "< key [%m.key{$1} v] pressed? >",
                renderLabel: "key  pressed?",
                parameters: ["dropdown"],
                group: "Sensing"
});
blocks.push({
                type: "boolean",
                spec: "mousePressed",
                scratchblocks: "< mouse down? >",
                renderLabel: "mouse down?",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "mouseX",
                scratchblocks: "( mouse x )",
                renderLabel: "mouse x",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "mouseY",
                scratchblocks: "( mouse y )",
                renderLabel: "mouse y",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "soundLevel",
                scratchblocks: "( loudness )",
                renderLabel: "loudness",
                parameters: [],
                group: "Sensing"
});
blocks.push({
		type: "reporter",
		spec: "timer",
		scratchblocks: "(timer)",
		renderLabel: "timer",
		parameters: [],
		group: "Sensing"
	    });
blocks.push({
		type: "command",
		spec: "timerReset",
		scratchblocks: "reset timer",
		renderLabel: "reset timer",
		parameters: [],
		group: "Sensing"
	    });
blocks.push({
                type: "reporter",
                spec: "senseVideoMotion",
                scratchblocks: "( video [%m.videoMotionType{$1} v] on [%m.stageOrThis{$2} v] )",
                renderLabel: "video  on ",
                parameters: ["dropdown",
                             "dropdown"],
                group: "Sensing"
});
blocks.push({
                type: "command",
                spec: "setVideoState",
                scratchblocks: "turn video [%m.videoState{$1} v]",
                renderLabel: "turn video ",
                parameters: ["dropdown"],
                group: "Sensing"
});
blocks.push({
		type: "command",
		spec: "setVideoTransparency",
		scratchblocks: "set video transparency to ($1) %",
		renderLabel: "set video transparency to  %",
		parameters: ["number"],
		group: "Sensing"
	    });
blocks.push({
		type: "reporter",
		spec: "getAttribute:of:",
		scratchblocks: "( [%m.sensor{$1} v] of [%m.spriteOrStage{$2} v] )",
		renderLabel: " of ",
		parameters: ["dropdown",
                             "dropdown"],
		group: "Sensing"
	    });
blocks.push({
		type: "reporter",
		spec: "timeAndDate",
		scratchblocks: "( current [%m.timeAndDate{$1} v] )",
		renderLabel: "current ",
		parameters: ["dropdown"],
		group: "Sensing"
	    });
blocks.push({
                type: "reporter",
                spec: "timestamp",
                scratchblocks: "( days since 2000 )",
                renderLabel: "days since 2000",
                parameters: [],
                group: "Sensing"
});
blocks.push({
                type: "reporter",
                spec: "getUserName",
                scratchblocks: "( username )",
                renderLabel: "username",
                parameters: [],
                group: "Sensing"
});
//**//OPERATORS
blocks.push({
                type: "reporter",
                spec: "+",
                scratchblocks: "(($1) + ($2))",
		renderLabel: " + ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "reporter",
                spec: "-",
                scratchblocks: "(($1) - ($2))",
		renderLabel: " - ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "reporter",
                spec: "*",
                scratchblocks: "(($1) * ($2))",
		renderLabel: " * ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "reporter",
                spec: "/",
                scratchblocks: "(($1) / ($2))",
		renderLabel: " / ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "reporter",
                spec: "randomFrom:to:",
                scratchblocks: "( pick random ($1) to ($2) )",
		renderLabel: "pick random  to ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "boolean",
                spec: "<",
                scratchblocks: "< [$1] < [$2] >",
		renderLabel: " < ",
                parameters: ["string",
			     "string"],
                group: "Operators"
            });
blocks.push({
                type: "boolean",
                spec: "=",
                scratchblocks: "< [$1] = [$2] >",
		renderLabel: " = ",
                parameters: ["string",
			     "string"],
                group: "Operators"
            });
blocks.push({
                type: "boolean",
                spec: ">",
                scratchblocks: "< [$1] > [$2] >",
		renderLabel: " > ",
                parameters: ["string",
			     "string"],
                group: "Operators"
            });
blocks.push({
		type: "boolean",
		spec: "&",
		scratchblocks: "< <$1> and <$2> >",
		renderLabel: " and ",
		parameters: ["boolean",
                             "boolean"],
		group: "Operators"
	    });
blocks.push({
		type: "boolean",
		spec: "|",
		scratchblocks: "< <$1> or <$2> >",
		renderLabel: " or ",
		parameters: ["boolean",
                             "boolean"],
		group: "Operators"
	    });
blocks.push({
		type: "boolean",
		spec: "not",
		scratchblocks: "< not <$1> >",
		renderLabel: "not ",
		parameters: ["boolean"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "concatenate:with:",
		scratchblocks: "( join [$1] [$2] )",
		renderLabel: "join  ",
		parameters: ["string",
                             "string"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "letter:of:",
		scratchblocks: "( letter ($1) of [$2] )",
		renderLabel: "letter  of ",
		parameters: ["number",
                             "string"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "stringLength:",
		scratchblocks: "( length of [$1] )",
		renderLabel: "length of ",
		parameters: ["string"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "%",
		scratchblocks: "( ($1) mod ($2) )",
		renderLabel: " mod ",
		parameters: ["number",
                             "number"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "rounded",
		scratchblocks: "( round ($1) )",
		renderLabel: "round ",
		parameters: ["number"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "computeFunction:of:",
		scratchblocks: "([%m.mathOp{$1} v] of ($2))",
		renderLabel: " of ",
		parameters: ["dropdown",
			     "number"],
		group: "Operators"
	    });
//**//MORE BLOCKS
/*
This is going to need some explaining:
The "More Blocks" section holds three types of blocks:
1) Custom Blocks (Scratch supported)
2) Extension Blocks (Scratch supported)
3) GE Add-on Blocks (GE supported, no Scratch support. For future use.)
Add-on blocks haven't been implemented yet, but will probably be
the same as Extension blocks.

Extension blocks are not supported in GE yet, as they do not
currently have render code in scratchblocks2 or programming code
in the player.

Custom blocks work as so:
1) There will be a unique block data so that the GE code parser can
tell when to declare a special block.
2) When GE gets to a define block, it will parse it like a special hat block,
with an "end" at the end of the define. The block that is defined will then be pushed into the
blocks array, with the type "call:command"
*/
blocks.push({
                type: "define",
                spec: "procDef",
                scratchblocks: undefined,
                renderLabel: undefined,
                parameters: undefined,
                group: "More Blocks"
});
blocks.push({
                type: "call",
                spec: "call",
                scratchblocks: undefined,
                renderLabel: undefined,
                parameters: undefined,
                group: "More Blocks"
});

//**//MOTION
blocks.push({
                type: "command",
                spec: "forward:",
                scratchblocks: "move ($1) steps",
                renderLabel: "move  steps",
                parameters: ["number"],
                group: "Motion"
})
blocks.push({
		type: "command",
		spec: "pointTowards:",
		scratchblocks: "point towards [%m.mathOp.spriteOrMouse{$1} v]",
		renderLabel: "point towards ",
		parameters: ["dropdown"],
		group: "Motion"
	    });
blocks.push({
		type: "command",
		spec: "gotoX:y:",
		scratchblocks: "go to x:($1) y:($2)",
		renderLabel: "go to x: y:",
		parameters: ["number",
			     "number"],
		group: "Motion"
	    });
blocks.push({
		type: "command",
		spec: "gotoSpriteOrMouse:",
		scratchblocks: "go to [%m.mathOp.spriteOrMouse{$1} v]",
		renderLabel: "go to ",
		parameters: ["dropdown"],
		group: "Motion"
	    });
//**//LOOKS
blocks.push({
                type: "command",
                spec: "say:duration:elapsed:from:",
                scratchblocks: "say [$1] for ($2) secs",
                renderLabel: "say  for  secs",
                parameters: ["text",
                             "number"],
                group: "Looks"
});
blocks.push({
		type: "command",
		spec: "say:",
		scratchblocks: "say [$1]",
		renderLabel: "say ",
		parameters: ["string"],
		group: "Looks"
	    });
blocks.push({
                type: "command",
                spec: "think:duration:elapsed:from:",
                scratchblocks: "think [$1] for ($2) secs",
                renderLabel: "think  for  secs",
                parameters: ["text",
                             "number"],
                group: "Looks"
});
blocks.push({
		type: "command",
		spec: "think:",
		scratchblocks: "think [$1]",
		renderLabel: "think ",
		parameters: ["string"],
		group: "Looks"
	    });
blocks.push({
                type: "command",
                spec: "show",
		scratchblocks: "show",
		renderLabel: "show",
		parameters: [],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "hide",
		scratchblocks: "hide",
		renderLabel: "hide",
		parameters: [],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "lookLike:",
                scratchblocks: "switch costume to [%m.costume{$1} v]",
                renderLabel: "switch costume to ",
                parameters: ["dropdown"],
                group: "Looks"
});
blocks.push({
                type: "command",
                spec: "nextCostume",
		scratchblocks: "next costume",
		renderLabel: "next costume",
		parameters: [],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "changeGraphicEffect:by:",
		scratchblocks: "change [%m.effect{$1} v] effect by (25)",
		renderLabel: "change  effect by ",
		parameters: ["dropdown",
                             "number"],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "setGraphicEffect:to:",
		scratchblocks: "set [%m.effect{$1} v] effect to (25)",
		renderLabel: "set  effect to ",
		parameters: ["dropdown",
                             "number"],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "filterReset",
		scratchblocks: "clear graphic effects",
		renderLabel: "clear graphic effects",
		parameters: [],
                group: "Looks"
            });
blocks.push({
                type: "command",
                spec: "changeSizeBy:",
                scratchblocks: "change size by ($1)",
                renderLabel: "change size by ",
                parameters: ["number"],
                group: "Looks"
});
blocks.push({
		type: "command",
		spec: "setSizeTo:",
		scratchblocks: "set size to ($1) %",
		renderLabel: "set size to  %",
		parameters: ["number"],
		group: "Looks"
	    });
blocks.push({
                type: "command",
                spec: "comeToFront",
                scratchblocks: "go to front",
                renderLabel: "go to front",
                parameters: [],
                group: "Looks"
});
blocks.push({
                type: "command",
                spec: "goBackByLayers:",
                scratchblocks: "go back ($1) layers",
                renderLabel: "go back  layers",
                parameters: ["number"],
                group: "Looks"
});
blocks.push({
                type: "reporter",
                spec: "costumeIndex",
                scratchblocks: "costume #",
                renderLabel: "costume #",
                parameters: [],
                group: "Looks"
});
blocks.push({
                type: "reporter",
                spec: "scale",
                scratchblocks: "( size )",
                renderLabel: "size",
                parameters: [],
                group: "Looks"
});
//Stage-only blocks
blocks.push({
		type: "command",
		spec: "startScene",
		scratchblocks: "switch backdrop to [%m.backdrop{$1} v]",
		renderLabel: "switch backdrop to ",
		parameters: ["dropdown"],
		group: "Looks"
	    });
blocks.push({
		type: "command",
		spec: "startSceneAndWait",
		scratchblocks: "switch backdrop to [%m.backdrop{$1} v] and wait",
		renderLabel: "switch backdrop to  and wait",
		parameters: ["dropdown"],
		group: "Looks"
	    });
blocks.push({
		type: "command",
		spec: "nextScene",
		scratchblocks: "next backdrop",
		renderLabel: "next backdrop",
		parameters: [],
		group: "Looks"
	    });
blocks.push({
		type: "reporter",
		spec: "sceneName",
		scratchblocks: "backdrop name",
		renderLabel: "backdrop name",
		parameters: [],
		group: "Looks"
	    });
blocks.push({
		type: "reporter",
		spec: "backgroundIndex",
		scratchblocks: "backdrop #",
		renderLabel: "backdrop #",
		parameters: [],
		group: "Looks"
	    });
//**//SOUND
blocks.push({
                type: "command",
                spec: "playSound:",
                scratchblocks: "play sound [%m.sound{$1} v]",
                renderLabel: "play sound ",
                parameters: ["dropdown"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "doPlaySoundAndWait",
                scratchblocks: "play sound [%m.sound{$1} v] until done",
                renderLabel: "play sound  until done",
                parameters: ["dropdown"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "stopAllSounds",
                scratchblocks: "stop all sounds",
                renderLabel: "stop all sounds",
                parameters: [],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "playDrum",
                scratchblocks: "play drum ($1) for ($2) beats",
                renderLabel: "play drum  for  beats",
                parameters: ["number",
                             "number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "rest:elapsed:from:",
                scratchblocks: "rest for ($1) beats",
                renderLabel: "rest for  beats",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "noteOn:duration:elapsed:from:",
                scratchblocks: "play note ($1) for ($2) beats",
                renderLabel: "play note  for  beats",
                parameters: ["number",
                             "number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "instrument:",
                scratchblocks: "set instrument to ($1)",
                renderLabel: "set instrument to ",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "changeVolumeBy:",
                scratchblocks: "change volume by ($1)",
                renderLabel: "change volume by ",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "setVolumeTo:",
                scratchblocks: "set volume to ($1) %",
                renderLabel: "set volume to  %",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "reporter",
                spec: "volume",
                scratchblocks: "( volume )",
                renderLabel: "volume",
                parameters: [],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "changeTempoBy:",
                scratchblocks: "change tempo by ($1)",
                renderLabel: "change tempo by ",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "command",
                spec: "setTempoTo:",
                scratchblocks: "set tempo to ($1) bpm",
                renderLabel: "set tempo to  bpm",
                parameters: ["number"],
                group: "Sound"
});
blocks.push({
                type: "reporter",
                spec: "tempo",
                scratchblocks: "( tempo )",
                renderLabel: "tempo",
                parameters: [],
                group: "Sound"
});
//**//PEN
blocks.push({
                type: "command",
                spec: "clearPenTrails",
                scratchblocks: "clear",
                renderLabel: "clear",
                parameters: [],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "stampCostume",
                scratchblocks: "stamp",
                renderLabel: "stamp",
                parameters: [],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "putPenDown",
                scratchblocks: "pen down",
                renderLabel: "pen down",
                parameters: [],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "putPenUp",
                scratchblocks: "pen up",
                renderLabel: "pen up",
                parameters: [],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "penColor:",
                scratchblocks: "set pen color to [#$1]",
                renderLabel: "set pen color to ",
                parameters: ["color"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "changePenHueBy:",
                scratchblocks: "change pen color by ($1)",
                renderLabel: "change pen color by ",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "setPenHueTo:",
                scratchblocks: "set pen color to ($1)",
                renderLabel: "set pen color to ",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "setPenShadeTo:",
                scratchblocks: "set pen shade to ($1)",
                renderLabel: "set pen shade to ",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "changePenShadeBy:",
                scratchblocks: "change pen shade by ($1)",
                renderLabel: "change pen shade by ",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "changePenSizeBy:",
                scratchblocks: "change pen size by ($1)",
                renderLabel: "change pen size by ",
                parameters: ["number"],
                group: "Pen"
});
blocks.push({
                type: "command",
                spec: "penSize:",
                scratchblocks: "set pen size to ($1)",
                renderLabel: "set pen size to ",
                parameters: ["number"],
                group: "Pen"
});
//**//DATA