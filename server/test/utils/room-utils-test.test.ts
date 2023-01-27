
import { IsValidRoomNumber } from "../../src/utils/room-utils";

const VALID_ROOM_NUMS = ["123", "007", "999"];
const INVALID_ROOM_NUMS = ["ABC", "0", "1234", "-4"];

test("good room nums should be valid", () => {
    for(let i = 0; i < VALID_ROOM_NUMS.length; i++) {
        expect(IsValidRoomNumber(VALID_ROOM_NUMS[i])).toBe(true);
    }
});

test("bad room nums should not be valid", () => {
    for(let i = 0; i < INVALID_ROOM_NUMS.length; i++) {
        expect(IsValidRoomNumber(INVALID_ROOM_NUMS[i])).toBe(false);
    }
});
