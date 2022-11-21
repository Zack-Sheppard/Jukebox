
// does what it says on the can
function GenerateRandomAlphanumericString(length: number): string {
    let result: string = "";
    const possible_chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                                   "abcdefghijklmnopqrstuvwxyz" +
                                   "0123456789";

    const pc_len: number = possible_chars.length;
    for(let i: number = 0; i < length; i++) {
        result += possible_chars.charAt(Math.floor(Math.random() * pc_len));
    }
    return result;
}

export { GenerateRandomAlphanumericString };
