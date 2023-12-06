const cliProgress = require("cli-progress");

// const PATH = "example";
const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n\n");
	let seeds: number[] | number[] = input[0].split(" ").map(i => parseInt(i));
	
	input.shift();

	let parsedInput: number[][][] = input.map((conversion: string) => {
		return parseConversion(conversion);
	});

	const statusMarker = 1000000;

	let closestLocation: number = Number.MAX_VALUE;
	for(let p = 0; p < seeds.length; p += 2) {
		let bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
		bar.start(seeds[p + 1], 0);
		for(let s = seeds[p]; s < seeds[p] + seeds[p + 1]; s++) {
			closestLocation = Math.min(closestLocation, followSeed(s, parsedInput));
			if(s % statusMarker == 0) {
				console.clear();
				console.log((p + 1) + "/" + (seeds.length / 2));
				bar.update(s - seeds[p]);
			}
		}
		bar.stop();
	}

	console.log("Final value: " + closestLocation);
}

function followSeed(seed: number, conversions: number[][][]): number {
	let track: number[] = [seed];
	conversions.forEach((category) => {
		let preSeed = seed;
		let skip = false;
		category.forEach((map) => {
			if(skip) return;
			let newSeed: number = convertInRange(seed, map);
			if(newSeed != seed) {
				track.push(newSeed)
				seed = newSeed;
				skip = true;
			};
		});
		if(preSeed == seed) track.push(seed);
	});
	return seed;
}

function convertInRange(seed: number, range: number[]): number {
	if(range[1] <= seed && seed < range[1] + range[2]) {
		let distFromStart = seed - range[1];
		seed = range[0] + distFromStart;
	}
	return seed;
}

function parseConversion(conv: string): number[][] {
	let lines: string[] = conv.split("\n");
	let nums: number[][] = lines.map(l => l.split(" ").map(n => parseInt(n)));
	return nums;
}

main();
