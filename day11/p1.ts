const PATH = "example";
// const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let galaxies: Vector2[] = [];

	for(let y = 0; y < input.length; y++){
		for(let x = 0; x < input[y].length; x++){
			if(input[y][x] == "#") galaxies.push(new Vector2(x, y));
		}
	}

	// Handle row-ward exspansion
	for(let y = 0; y < input.length; y++) {
		if(!input[y].includes("#")) {
			// g++ hehe
			for(let g = 0; g < galaxies.length; g++) {
				if(galaxies[g].y > y) galaxies[g].y += 1;
			}
		}
	}

	// Handle column-ward exspansion
	for(let x = 0; x < input[0].length; x++) {
		let columnEmpty = true;
		for(let y = 0; y < input.length; y++) {
			if(input[y][x] == "#") columnEmpty = false;
		}
		if(columnEmpty) {
			console.log(x);
			console.log("column exspansion");
			for(let g = 0; g < galaxies.length; g++) {
				if(galaxies[g].x > x) galaxies[g].x += 1;
			}
		}
	}

	let distance: number = 0;
	for(let ig = 0; ig < galaxies.length; ig++) {
		for(let og = ig + 1; og < galaxies.length; og++) {
			let d: number = TaxicabDistance(galaxies[ig], galaxies[og]);
			if(ig == 0 && og == 6) {
				console.log(galaxies[ig].toString());
				console.log(galaxies[og].toString());
				console.log(d);
			}
			distance += d;
		}
	}
}

function TaxicabDistance(to: Vector2, from: Vector2): number {
	return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
}

class Vector2 {
	x: number;
	y: number;
	constructor(_x: number, _y: number) {
		this.x = _x;
		this.y = _y;
	}

	toString(): string {
		return "(" + this.x + ", " + this.y + ")";
	}
}

main();
