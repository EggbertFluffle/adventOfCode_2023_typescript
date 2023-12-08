// const PATH = "example";
const PATH = "input";

const CARDSTRENGTH: string = "23456789TJQKA";
const HANDTYPES: string[] = ["High card", "One pair", "Two pair", "Three of a kind", "Full house", "Four of a kind", "Five of a kind"];

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let hands: Hand[] = []

	for(let i = 0; i < input.length; i++) {
		hands.push(new Hand(input[i]));
	}

	for(let i = hands.length - 1; i >= 0; i--) {
		for(let j = 0; j < i; j++) {
			if(Hand.CompareHands(hands[j], hands[j + 1]) == -1) {
				// Swap values
				[hands[j], hands[j + 1]] = [hands[j + 1], hands[j]];
			}
		}
	}

	let sum = 0;
	for(let i = 1; i < hands.length + 1; i++) {
		sum += (i * hands[i - 1].bid);
	}
	console.log(sum);
}

class Hand {
	hand: string;
	bid: number;
	cards: Map<string, number>;
	type: number;

	constructor(str: string) {
		let spaceIndex = str.indexOf(" ");
		this.hand = str.slice(0, spaceIndex);
		this.bid = parseInt(str.slice(spaceIndex + 1));
		this.cards = new Map<string, number>();

		for(let i = 0; i < this.hand.length; i++) {
			// Set spot in map if it doesnt exist
			if(!this.cards.has(this.hand[i])) {
				this.cards.set(this.hand[i], 1);
			} else {
				this.cards.set(this.hand[i], this.cards.get(this.hand[i]) + 1);
			}
		}

		// Identify type and give ranking based on that
		this.type = Hand.GetHandType(this.cards);
	}

	// Returns: -1 for the first hand being greater and +1 for the second and 0 for the identical
	static CompareByCard(h1: Hand, h2: Hand): number {
		for(let i = 0; i < 5; i++) {
			if(CARDSTRENGTH.indexOf(h1.hand[i]) > CARDSTRENGTH.indexOf(h2.hand[i])) {
				return -1;
			} else if(CARDSTRENGTH.indexOf(h1.hand[i]) < CARDSTRENGTH.indexOf(h2.hand[i]))  {
				return 1;
			}
		}
		return -1;
	}

	static GetHandType(cards: Map<string, number>): number {
		let entries: number[] = Array.from(cards.values());
		if(entries.includes(5)) {
			return 6;
		} else if(entries.includes(4)) {
			return 5;
		} else if(entries.includes(3) && entries.includes(2)) {
			return 4;
		} else if(entries.includes(3)) {
			return 3;
		} else if(entries.filter(n => n == 2).length == 2) {
			return 2;
		} else if(entries.includes(2)) {
			return 1;
		}
		return 0;
	}

	static CompareHands(h1: Hand, h2: Hand) {
		if(h1.type > h2.type) return -1;
		if(h1.type < h2.type) return 1;
		return Hand.CompareByCard(h1, h2);
	}
}

main();
