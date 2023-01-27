
// len == 3 and each char is between 0-9
function IsValidRoomNumber(roomNum: string): boolean {

    if(/^[0-9]{3}$/.test(roomNum)) {
        return true;
    }
    else {
        return false;
    }
}

export { IsValidRoomNumber };
