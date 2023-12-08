// const PATH = "example";
const PATH = "input";

const CARDSTRENGTH: string = "23456789TQKA";
const HANDTYPES: string[] = ["High card", "One pair", "Two pair", "Three of a kind", "Full house", "Four of a kind", "Five of a kind"];

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");
	let hands: Hand[] = [];

	for(let i = 0; i < input.length; i++) {
		hands.push(new Hand(input[i]));
		console.log(i + "/" + input.length);
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
		this.hand = str.slice(0, 5);
		this.bid = parseInt(str.slice(6));
		this.cards = new Map<string, number>();

		this.GetMapOfHand();
		if(this.hand == "JJJJJ") {
			this.hand = "AAAAAA";
		} else if(this.hand.split("").filter(n => n == "J").length == 4) {
			let other: string = this.hand.split("").filter(n => n != "J")[0];
			this.hand = other + other + other + other + other;
		} else {
			this.TestForJokers();
		}

		// Identify type and give ranking based on that
		this.type = Hand.GetHandType(this.cards);
	}

	TestForJokers() {
		// Make an array fo the letters in the hand with NULL replacing J
		// Find all the possible values of 
		if(!this.hand.includes("J")) return;
		let parsedHand: Array<string | null> = this.hand.split("").map(l => l == "J" ? null : l);

		// Collect every possible hand considering jokers
		let possibleHands: Array<Array<string | null>> = [parsedHand];
		
		// Ensure that at least e
		while(possibleHands.some(h => h.includes(null))) {
			let variations: Array<Array<string | null>> = [];
			for(let i = 0; i < possibleHands.length; i++) {
				// C++ YYAYAYAAYAYYAYYAA YAY <:
				// Skip the possible hand if it doesnt contain a null element
				let nullIndex = possibleHands[i].indexOf(null);
				if(nullIndex == -1) {
					variations.push(possibleHands[i]);
				};
				for(let c = CARDSTRENGTH.length - 1; c >= 0; c--) {
					let newHand: Array<string | null> = possibleHands[i].map(n => n);
					newHand[nullIndex] = CARDSTRENGTH[c];
					variations.push(newHand);
				}
			}
			possibleHands = variations;
		}

		let allHands: Hand[] = possibleHands.map(h => new Hand(h.join("")));

		for(let i = allHands.length - 1; i >= 0; i--) {
			for(let j = 0; j < i; j++) {
				if(Hand.CompareHands(allHands[j], allHands[j + 1]) == -1) {
					// Swap values
					[allHands[j], allHands[j + 1]] = [allHands[j + 1], allHands[j]];
				}
			}
		}

		let bestHand: Hand = allHands[allHands.length - 1];
		this.hand = bestHand.hand;
		this.cards = bestHand.cards;
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

	GetMapOfHand(): void {
		this.cards = new Map<string, number>();
		for(let i = 0; i < this.hand.length; i++) {
			// Set spot in map if it doesnt exist
			if(!this.cards.has(this.hand[i])) {
				this.cards.set(this.hand[i], 1);
			} else {
				this.cards.set(this.hand[i], this.cards.get(this.hand[i]) + 1);
			}
		}
	}
}

main();
