const NUMS: string = "1234567890";
const RGX: RegExp = /\d{1,3}/

// const PATH = "example";
const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let sum: number = 0;

	let partNumbers: PartNumber[] = [];
	for(let y = 0; y < input.length; y++) {
		for(let x = 0; x < input[0].length; x++) {
			// Ensure we are in bounds
			if(Vec2.checkBounds(x, y, input[0].length, input.length)) continue;
			if(NUMS.includes(input[y][x])) {
				let currentNum: RegExpMatchArray | null = input[y].slice(x).match(RGX);
				if(currentNum == null) continue;
				partNumbers.push(new PartNumber(currentNum[0], x, y));
				x += currentNum.length + 1;
			}
		}
	}

	let gears: Gear[] = [];
	let validGears: Gear[] = [];
	for(let y = 0; y < input.length; y++) {
		for(let x = 0; x < input[0].length; x++) {
			if(input[y][x] == "*") {
				gears.push(new Gear(x, y));
			}
		}
	}

	for(let s = 0; s < gears.length; s++) {
		for(let p = 0; p < partNumbers.length; p++) {
			// if(partNumbers[p].found == false) {
				if(partNumbers[p].locations.some(loc => {
					return gears[s].pos.isAdjacent(loc);
				})) {
					gears[s].adjNums.push(partNumbers[p]);
					// partNumbers[p].found = true;
				};
			// }
		}
		if(gears[s].adjNums.length == 2) {
			validGears.push(gears[s]);
		}
	}

	validGears.forEach(g => {
		sum += g.adjNums[0].value * g.adjNums[1].value;
	});

	console.log(sum);
}


class PartNumber {
	value: number;
	locations: Vec2[];
	found: boolean;

	constructor(digits: string, _x: number, _y: number) {
		this.found = false;
		this.value = parseInt(digits);

		this.locations = []
		for(let i = 0; i < digits.length; i++) {
			this.locations.push(new Vec2(_x + i, _y));
		}

		console.log(this.locations);
	}
}

class Gear {
	pos: Vec2;
	adjNums: PartNumber[];

	constructor(_x: number, _y: number) {
		this.adjNums = [];
		this.pos = new Vec2(_x, _y);
	}
}

class Vec2 {
	x: number;
	y: number;

	constructor(_x: number, _y: number) {
		this.x = _x;
		this.y = _y;
	}

	static checkBounds(x: number, y: number, w: number, h: number) {
		if(x < 0 || y < 0) return true;
		if(x > w - 1 || y > h - 1) return true;
		return false;
	}

	checkBounds(w: number, h: number) {
		if(this.x < 0 || this.y < 0) return false;
		if(this.x > w - 1 || this.y > h - 1) return false;
		return true;
	}

	isAdjacent(p: Vec2): boolean {
		// y - 1
		for(let x = -1; x <= 1; x++) {
			if(this.x + x == p.x && this.y - 1 == p.y) return true;
		}
		if((this.x - 1 == p.x || this.x + 1 == p.x) && this.y == p.y) return true;
		for(let x = -1; x <= 1; x++) {
			if(this.x + x == p.x && this.y + 1 == p.y) return true;
		}
		return false;
	}
}

main();
