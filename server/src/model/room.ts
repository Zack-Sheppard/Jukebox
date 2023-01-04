
export class Room {

    readonly num: number;
    token: string = "";
    tokenExpiresAt: number = 0; // Unix timestamp

    constructor(rn: number) {
        this.num = rn;
        this.tokenExpiresAt = Date.now();
    }
}
