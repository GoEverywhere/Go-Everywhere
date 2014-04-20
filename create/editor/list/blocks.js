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
		scratchblocks: "when [%k{$1} v] key pressed",
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
                scratchblocks: "when backdrop switches to [%b{$1} v]",
                renderLabel: "when backdrop switches to ",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "hat",
                spec: "whenSensorGreaterThan",
                scratchblocks: "when [%s{$1} v] > ($2)",
                renderLabel: "when  > ",
                parameters: ["dropdown",
                             "number"],
                group: "Events"
});
blocks.push({
                type: "hat",
                spec: "whenIReceive",
                scratchblocks: "when I recieve [%r{$1} v]",
                renderLabel: "",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "command",
                spec: "broadcast:",
                scratchblocks: "broadcast [%r{$1} v]",
                renderLabel: "",
                parameters: ["dropdown"],
                group: "Events"
});
blocks.push({
                type: "command",
                spec: "doBroadcastAndWait",
                scratchblocks: "broadcast [%r{$1} v] and wait",
                renderLabel: "",
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
		renderLabel: "",
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
		renderLabel: "wait until",
		parameters: ["boolean"],
		group: "Control"
	    });
blocks.push({
                type: "c",
                spec: "doUntil",
                scratchblocks: "repeat until <$1>",
                renderLabel: "repeat until",
                parameters: ["boolean"],
                group: "Control"
});
blocks.push({
                type: "command",
                spec: "stopScripts",
                scratchblocks: "stop [%a{$1} v]",
                renderLabel: "",
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
                scratchblocks: "create clone of [%p{$1} v]",
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
		scratchblocks: "<touching [%o{$1} v]?>",
		renderLabel: "touching ?",
		parameters: ["dropdown"],
		group: "Sensing"
	    });
/*blocks.push({
		type: "boolean",
		spec: "touchingColor:",
		scratchblocks: "<touching color [#$1]?>",
		renderLabel: "touching ?",
		parameters: ["color"],
		group: "Sensing"
	    });*/
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
		spec: "setVideoTransparency",
		scratchblocks: "set video transparency to ($1) %",
		renderLabel: "set video transparency to  %",
		parameters: ["number"],
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
		type: "boolean",
		spec: "not",
		scratchblocks: "< not <$1> >",
		renderLabel: "not ",
		parameters: ["boolean"],
		group: "Operators"
	    });
blocks.push({
		type: "reporter",
		spec: "computeFunction:of:",
		scratchblocks: "([%m{$1} v] of ($2))",
		renderLabel: " of ",
		parameters: ["dropdown",
			     "number"],
		group: "Operators"
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
		scratchblocks: "point towards [%o{$1} v]",
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
		scratchblocks: "go to [%o{$1} v]",
		renderLabel: "go to ",
		parameters: ["dropdown"],
		group: "Motion"
	    });
//**//LOOKS
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
                spec: "nextCostume",
		scratchblocks: "next costume",
		renderLabel: "next costume",
		parameters: [],
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
//**//SOUND
//**//PEN
//**//DATA