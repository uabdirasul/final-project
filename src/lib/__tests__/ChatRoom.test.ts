import { ChatRoom } from "../ChatRoom";

describe("ChatRoom", () => {
  describe("constructor", () => {
    it("should create a chat room with id and name", () => {
      const room = new ChatRoom("room1", "General");
      expect(room.id).toBe("room1");
      expect(room.name).toBe("General");
      expect(room.participants).toEqual([]);
    });

    it("should create a chat room with initial participants", () => {
      const room = new ChatRoom("room1", "General", ["user1", "user2"]);
      expect(room.id).toBe("room1");
      expect(room.name).toBe("General");
      expect(room.participants).toEqual(["user1", "user2"]);
    });
  });

  describe("addParticipant", () => {
    it("should add a new participant", () => {
      const room = new ChatRoom("room1", "General");
      room.addParticipant("user1");
      expect(room.participants).toContain("user1");
    });

    it("should not add duplicate participants", () => {
      const room = new ChatRoom("room1", "General", ["user1"]);
      room.addParticipant("user1");
      expect(room.participants).toEqual(["user1"]);
    });

    it("should add multiple different participants", () => {
      const room = new ChatRoom("room1", "General");
      room.addParticipant("user1");
      room.addParticipant("user2");
      room.addParticipant("user3");

      expect(room.participants).toContain("user1");
      expect(room.participants).toContain("user2");
      expect(room.participants).toContain("user3");
      expect(room.participants.length).toBe(3);
    });
  });

  describe("removeParticipant", () => {
    it("should remove an existing participant", () => {
      const room = new ChatRoom("room1", "General", ["user1", "user2"]);
      room.removeParticipant("user1");
      expect(room.participants).toEqual(["user2"]);
    });

    it("should not throw when removing non-existent participant", () => {
      const room = new ChatRoom("room1", "General", ["user1"]);
      expect(() => room.removeParticipant("user2")).not.toThrow();
      expect(room.participants).toEqual(["user1"]);
    });

    it("should remove all participants", () => {
      const room = new ChatRoom("room1", "General", ["user1", "user2"]);
      room.removeParticipant("user1");
      room.removeParticipant("user2");
      expect(room.participants).toEqual([]);
    });
  });

  describe("getParticipantCount", () => {
    it("should return 0 for empty room", () => {
      const room = new ChatRoom("room1", "General");
      expect(room.getParticipantCount()).toBe(0);
    });

    it("should return correct count for multiple participants", () => {
      const room = new ChatRoom("room1", "General", [
        "user1",
        "user2",
        "user3"
      ]);
      expect(room.getParticipantCount()).toBe(3);
    });

    it("should update count after adding participant", () => {
      const room = new ChatRoom("room1", "General");
      room.addParticipant("user1");
      expect(room.getParticipantCount()).toBe(1);
      room.addParticipant("user2");
      expect(room.getParticipantCount()).toBe(2);
    });

    it("should update count after removing participant", () => {
      const room = new ChatRoom("room1", "General", ["user1", "user2"]);
      room.removeParticipant("user1");
      expect(room.getParticipantCount()).toBe(1);
    });
  });

  describe("toJSON", () => {
    it("should convert room to a plain object", () => {
      const room = new ChatRoom("room1", "General", ["user1", "user2"]);
      const json = room.toJSON();

      expect(json.id).toBe("room1");
      expect(json.name).toBe("General");
      expect(json.participants).toEqual(["user1", "user2"]);
    });

    it("should produce JSON with required properties", () => {
      const room = new ChatRoom("room1", "General");
      const json = room.toJSON();

      expect(json).toHaveProperty("id");
      expect(json).toHaveProperty("name");
      expect(json).toHaveProperty("participants");
    });
  });

  describe("fromJSON", () => {
    it("should create a ChatRoom from a plain object", () => {
      const data = {
        id: "room1",
        name: "General",
        participants: ["user1", "user2"]
      };
      const room = ChatRoom.fromJSON(data);

      expect(room.id).toBe("room1");
      expect(room.name).toBe("General");
      expect(room.participants).toEqual(["user1", "user2"]);
    });

    it("should create ChatRoom without participants in data", () => {
      const data = {
        id: "room1",
        name: "General"
      };
      const room = ChatRoom.fromJSON(data);

      expect(room.id).toBe("room1");
      expect(room.name).toBe("General");
      expect(room.participants).toEqual([]);
    });
  });

  describe("round-trip conversion", () => {
    it("should preserve all properties through toJSON and fromJSON", () => {
      const original = new ChatRoom("room1", "General", ["user1", "user2"]);
      const json = original.toJSON();
      const restored = ChatRoom.fromJSON(json);

      expect(restored.id).toBe(original.id);
      expect(restored.name).toBe(original.name);
      expect(restored.participants).toEqual(original.participants);
    });
  });
});
