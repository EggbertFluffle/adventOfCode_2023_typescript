let spellings = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

async function main() {
	const file = Bun.file("input");
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let sum: number = 0;

	for(let i = 0; i < input.length; i++) {
		sum += GetCalibrated(input[i]);
	}

	console.log(sum);
}

function GetCalibrated(str: string): number {
	// Extract the numbers from the line into an array
	let values: number[] = [];
	for(let i = 0; i < str.length; i++) {
		// Check for a single digit
		if("123456789".includes(str[i])) {
			values.push(parseInt(str[i]));
			continue;
		}

		for(let s = 0; s < spellings.length; s++) {
			if(str.slice(i).indexOf(spellings[s]) == 0) {
				values.push(s + 1);
			}
		}
	}

	return values[0] * 10 + values[values.length - 1];
}

main();
