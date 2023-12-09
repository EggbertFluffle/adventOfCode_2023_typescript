// const PATH = "example";
const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let directions: string = input[0];
	input.shift();
	let map: Map<string, Bifu> = new Map<string, Bifu>();
	
	for(let i = 0; i < input.length; i++) {
		map.set(input[i].split(" ")[0], new Bifu(input[i]));
	}

	let current: string = "AAA";
	let count: number = 0;
	while(current != "ZZZ") {
		console.log(count + " : " + current);
		if(directions[count & directions.length] == "R") {
			current = map.get(current).R;
		} else {
			current = map.get(current).L;
		}
		count++;
	}
}

class Bifu {
	L: string;
	R: string;
	constructor(str: string) {
		[this.L, this.R] = str.split(" ").slice(1);
	}
}

main();
