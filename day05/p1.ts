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

	let closestLocation: number = Number.MAX_VALUE;
	for(let s = 0; s < seeds.length; s++) {
		let location = followSeed(seeds[s], parsedInput);
		closestLocation = Math.min(closestLocation, location);
	}

	console.log(closestLocation);
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
	console.log(track);
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
