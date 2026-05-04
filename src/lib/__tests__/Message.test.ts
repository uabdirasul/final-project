import { Message } from "../Message";

describe("Message", () => {
  describe("constructor", () => {
    it("should create a message with all required fields", () => {
      const message = new Message(
        "msg1",
        "Hello World",
        "user1",
        "room1",
        1000
      );
      expect(message.id).toBe("msg1");
      expect(message.contents).toBe("Hello World");
      expect(message.sender).toBe("user1");
      expect(message.roomId).toBe("room1");
      expect(message.timestamp).toBe(1000);
    });

    it("should use current timestamp if not provided", () => {
      const beforeTime = Date.now();
      const message = new Message("msg1", "Hello", "user1", "room1");
      const afterTime = Date.now();

      expect(message.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(message.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe("getFormattedTime", () => {
    it("should format timestamp as HH:MM", () => {
      const testDate = new Date("2024-01-15T14:30:00");
      const message = new Message(
        "msg1",
        "Hello",
        "user1",
        "room1",
        testDate.getTime()
      );
      const formatted = message.getFormattedTime();

      // Check that it contains the time components
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe("toJSON", () => {
    it("should convert message to a plain object", () => {
      const message = new Message("msg1", "Hello", "user1", "room1", 1000);
      const json = message.toJSON();

      expect(json.id).toBe("msg1");
      expect(json.contents).toBe("Hello");
      expect(json.sender).toBe("user1");
      expect(json.roomId).toBe("room1");
      expect(json.timestamp).toBe(1000);
    });

    it("should produce JSON with all required fields", () => {
      const message = new Message("msg1", "Test", "user1", "room1", 1000);
      const json = message.toJSON();

      expect(json).toHaveProperty("id");
      expect(json).toHaveProperty("contents");
      expect(json).toHaveProperty("sender");
      expect(json).toHaveProperty("roomId");
      expect(json).toHaveProperty("timestamp");
    });
  });

  describe("fromJSON", () => {
    it("should create a Message instance from a plain object", () => {
      const data = {
        id: "msg1",
        contents: "Hello",
        sender: "user1",
        roomId: "room1",
        timestamp: 1000
      };
      const message = Message.fromJSON(data);

      expect(message.id).toBe("msg1");
      expect(message.contents).toBe("Hello");
      expect(message.sender).toBe("user1");
      expect(message.roomId).toBe("room1");
      expect(message.timestamp).toBe(1000);
    });

    it("should create Message without timestamp in data", () => {
      const data = {
        id: "msg1",
        contents: "Hello",
        sender: "user1",
        roomId: "room1"
      };
      const message = Message.fromJSON(data);

      expect(message.id).toBe("msg1");
      expect(message.contents).toBe("Hello");
      // timestamp will be undefined in data, but constructor sets it
      expect(message.timestamp).toBeDefined();
    });
  });

  describe("round-trip conversion", () => {
    it("should preserve all properties through toJSON and fromJSON", () => {
      const original = new Message(
        "msg1",
        "Hello World",
        "user1",
        "room1",
        1000
      );
      const json = original.toJSON();
      const restored = Message.fromJSON(json);

      expect(restored.id).toBe(original.id);
      expect(restored.contents).toBe(original.contents);
      expect(restored.sender).toBe(original.sender);
      expect(restored.roomId).toBe(original.roomId);
      expect(restored.timestamp).toBe(original.timestamp);
    });
  });
});
