// const PATH = "example";
const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let sum: number = 0;

	for(let i = 0; i < input.length; i++) {
		sum += getPointValue(input[i]);
	}

	console.log(sum);
}

function getPointValue(str: string): number {
	let barIndex = str.indexOf("|");

	let winningNumbers: number[] = str.slice(str.indexOf(":") + 2, barIndex - 1)
							.split(/ +/)
							.filter(n => n.length != 0)
							.map(n => parseInt(n));
	let cardNumbers = str.slice(barIndex + 1)
							.split(/ +/)
							.filter(n => n.length != 0)
							.map(n => parseInt(n));

	let matchFound: boolean = false;
	let value: number = 0;
	for(let w = 0; w < winningNumbers.length; w++) {
		for(let c = 0; c < cardNumbers.length; c++) {
			if(winningNumbers[w] == cardNumbers[c]) {
				if(!matchFound) {
					value = 1;
					matchFound = true;
				} else {
					value *= 2;
				}
			}
		}
	}
	
	return value;
}

main();
