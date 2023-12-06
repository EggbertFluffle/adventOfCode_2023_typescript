// const PATH = "example";
const PATH = "input";

async function main() {
	const file = Bun.file(PATH);
	const stream: ReadableStream<Uint8Array> = file.stream();
	let input: string[] = (await Bun.readableStreamToText(stream)).split("\n");

	let duration: number = parseInt(input[0]);
	let record: number = parseInt(input[1]);
	console.log(duration);
	console.log(record);

	console.log(getMarginOfError(duration, record));
}

function getMarginOfError(duration: number, record: number) {
	let moe = 0;
	for(let chargeTime = 0; chargeTime < duration; chargeTime++) {
		let coastTime = duration - chargeTime;
		let speed = chargeTime;
		let distance = speed * coastTime;
		if(distance > record) moe++;
	}
	return moe;
}

main();
