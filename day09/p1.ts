// const PATH = "example";
const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let sum: number = 0;

	for(let i: number = 0; i < input.length; i++) {
		sum += GetPrediction(input[i]);
	}

	console.log("Sum: " + sum);
}

function GetPrediction(str: string): number {
	let origionalNums: number[] = str.split(" ").map(n => parseInt(n));
	// A Collections of the differences between layers
	let differences: number[][] = [origionalNums];

	// While the last added layer doesnt ahve all zeros make a new layer of diferences
	while(!differences[differences.length - 1].every(n => n == 0)) {
		// Get previous differnces (or origiona numbers) before adding a new list to contain new differences
		let prev = differences[differences.length - 1];
		differences.push([]);
		for(let i = 1; i < prev.length; i++) {
			differences[differences.length - 1].push(prev[i] - prev[i - 1]);
		}
	}

	// Now backup and calculate next number based on differences
	differences[differences.length - 1].push(0);
	for(let i: number = differences.length - 2; i >= 0; i--) {
		let a = differences[i][differences[i].length - 1];
		let b = differences[i + 1][differences[i + 1].length - 1];
		console.log("a = "  + a);
		console.log("b = "  + b);
		differences[i].push(a + b);
	}

	for(let i = 0; i < differences.length; i++) {
		console.log(differences[i]);
	}

	return differences[0][differences[0].length - 1];
}

main();
