// const PATH = "example";
const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let cards: Card[] = [];
	for(let i = 0; i < input.length; i++) {
		cards.push(new Card(input[i], i));
	}
	let sum: number = 0;

	cards.forEach(c => {
		sum += c.getCopies(cards);
	})

	console.log(sum);
}

class Card {
	winningNumbers: number[];
	cardNumbers: number[];
	value: number;
	index: number;

	constructor(str: string, i: number) {
		this.value = 0;
		this.index = i;

		let barIndex = str.indexOf("|");
		this.winningNumbers = str.slice(str.indexOf(":") + 2, barIndex - 1)
			.split(/ +/)
			.filter(n => n.length != 0)
			.map(n => parseInt(n));

		this.cardNumbers = str.slice(barIndex + 1)
			.split(/ +/)
			.filter(n => n.length != 0)
			.map(n => parseInt(n));
	}

	getCopies(cards: Card[]): number {
		let matches: number = 0;
		for(let w = 0; w < this.winningNumbers.length; w++) {
			for(let c = 0; c < this.cardNumbers.length; c++) {
				if(this.winningNumbers[w] == this.cardNumbers[c]) {
					matches++;
				}
			}
		}
		
		let subCardCount: number = 0;
		for(let i = 0; i < matches; i++) {
			subCardCount += cards[this.index + i + 1].getCopies(cards);
		}

		return 1 + subCardCount;
	}
}

main();
