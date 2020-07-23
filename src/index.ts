import * as CryptoJS from "crypto-js"

class Block {
    static calculateBlockHash = (
        //파라미터의 타입을 명시할 수 있음
        //명시를 하고나면 해당 파라미터에 다른 유형의 값을 넣을 시 실행되지 않음
        index: number,
        previousHash: string,
        timestamp: number,
        data: string
        //함수의 반환 값도 타입을 명시할 수 있음
    ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

    static vaildateStructure = (aBlock: Block): boolean =>
        typeof aBlock.index === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";

    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const firstBlock: Block = new Block(0, "firstHash", "", "first block", 123456);
let blockChain: Block[] = [firstBlock];

const getBlockChain = (): Block[] => blockChain;

const getLatestBlock = (): Block => blockChain[blockChain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimeStamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(
        newIndex, previousBlock.hash, newTimeStamp, data
    );
    const newBlock: Block = new Block(
        newIndex, newHash, previousBlock.hash, data, newTimeStamp
    );
    addBlock(newBlock);
    return newBlock;
};

const getHashforBlock = (aBlock: Block): string => Block.calculateBlockHash(
    aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data
    );

const isBlockVaild = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.vaildateStructure(candidateBlock)) {
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    }
};

const addBlock = (candidateBlock: Block): void => {
    //해당 블록 유효성 확인 후 통과하면 해당 블록을 블록체인에 추가
    if (isBlockVaild(candidateBlock, getLatestBlock())) {
        blockChain.push(candidateBlock);
    }
}

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockChain);

export { };