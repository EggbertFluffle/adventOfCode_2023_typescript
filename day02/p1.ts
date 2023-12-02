let spellings = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

// const PATH = "example";
const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let sum = 0;

	for(let i = 0; i < input.length; i++) {
		sum += GetIdIfPossible(input[i]);
	}

	console.log(sum);
}

function GetIdIfPossible(str: string) {
	let [id, data]: string[] | number[] = str.split(":");
	
	//Extract game ID
	id = parseInt(id.slice(4));
	
	let handfuls: Handful[] = data.split(";").map(line => {
		return new Handful(line);
	});
	console.log(handfuls);

	let maxRed = 0;
	let maxBlue = 0;
	let maxGreen = 0;
	handfuls.forEach(h => {
		maxRed = Math.max(maxRed, h.red);
		maxBlue = Math.max(maxBlue, h.blue);
		maxGreen = Math.max(maxGreen, h.green);
	});

	console.log("maxRed " + maxRed);
	console.log("maxGreen " + maxGreen);
	console.log("maxBlue " + maxBlue);

	if(maxRed <= 12 && maxBlue <= 14 && maxGreen <= 13) {
		return id;
	} else {
		return 0;
	}
}

class Handful {
	red: number;
	green: number;
	blue: number;

	constructor(str: string) {
		this.red = 0;
		this.green = 0;
		this.blue = 0;

		let cubes: string[] = str.split(",");
		for(let i = 0; i < cubes.length; i++) {
			let color = cubes[i].split(" ");
			let count = parseInt(color[1]);
			switch(color[2]) {
				case "red":
					this.red = count;
				break;
				case "green":
					this.green = count;
				break
				case "blue":
					this.blue = count;
				break;
			}
		}
	}
}

main();
