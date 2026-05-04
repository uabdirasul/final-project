import { Message } from "../Message";
import { MessageService } from "../MessageService";

const createStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    }
  };
};

describe("MessageService", () => {
  let storageMock: ReturnType<typeof createStorageMock>;
  let messageService: MessageService;

  beforeEach(() => {
    storageMock = createStorageMock();
    Object.defineProperty(global, "localStorage", {
      value: storageMock,
      writable: true
    });
    messageService = new MessageService();
    jest.clearAllMocks();
  });

  describe("sendMessage", () => {
    it("should send a message successfully", async () => {
      storageMock.getItem.mockReturnValueOnce(null);

      const message = await messageService.sendMessage(
        "Hello World",
        "user1",
        "room1"
      );

      expect(message.contents).toBe("Hello World");
      expect(message.sender).toBe("user1");
      expect(message.roomId).toBe("room1");
      expect(storageMock.setItem).toHaveBeenCalled();
    });

    it("should reject empty message", async () => {
      await expect(
        messageService.sendMessage("", "user1", "room1")
      ).rejects.toThrow("Message content cannot be empty");
    });

    it("should reject whitespace-only message", async () => {
      await expect(
        messageService.sendMessage("   ", "user1", "room1")
      ).rejects.toThrow("Message content cannot be empty");
    });

    it("should generate unique message ID", async () => {
      storageMock.getItem.mockReturnValueOnce(null);

      const msg1 = await messageService.sendMessage(
        "Message 1",
        "user1",
        "room1"
      );
      storageMock.getItem.mockReturnValueOnce(JSON.stringify([msg1]));
      const msg2 = await messageService.sendMessage(
        "Message 2",
        "user1",
        "room1"
      );

      expect(msg1.id).not.toBe(msg2.id);
    });

    it("should set message timestamp", async () => {
      storageMock.getItem.mockReturnValueOnce(null);

      const beforeTime = Date.now();
      const message = await messageService.sendMessage(
        "Hello",
        "user1",
        "room1"
      );
      const afterTime = Date.now();

      expect(message.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(message.timestamp).toBeLessThanOrEqual(afterTime);
    });

    it("should preserve existing messages when adding new one", async () => {
      const existingMsg = new Message(
        "msg1",
        "Existing",
        "user1",
        "room1",
        1000
      );
      storageMock.getItem.mockReturnValueOnce(JSON.stringify([existingMsg]));

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_messages_room1") {
          savedData = value;
        }
      });

      const newMsg = await messageService.sendMessage("New", "user1", "room1");

      const saved = JSON.parse(savedData);
      expect(saved).toHaveLength(2);
      expect(saved[0].contents).toBe("Existing");
      expect(saved[1].contents).toBe("New");
    });
  });

  describe("getMessagesForRoom", () => {
    it("should return empty array when no messages exist", async () => {
      storageMock.getItem.mockReturnValueOnce(null);

      const messages = await messageService.getMessagesForRoom("room1");

      expect(messages).toEqual([]);
    });

    it("should return all messages for a room", async () => {
      const testMessages = [
        new Message("msg1", "Message 1", "user1", "room1", 1000),
        new Message("msg2", "Message 2", "user2", "room1", 2000)
      ];
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify(testMessages.map((m) => m.toJSON()))
      );

      const messages = await messageService.getMessagesForRoom("room1");

      expect(messages).toHaveLength(2);
      expect(messages[0].contents).toBe("Message 1");
      expect(messages[1].contents).toBe("Message 2");
    });

    it("should handle corrupted storage data", async () => {
      storageMock.getItem.mockReturnValueOnce("invalid json");

      const messages = await messageService.getMessagesForRoom("room1");

      expect(messages).toEqual([]);
    });

    it("should return correct messages for different rooms", async () => {
      const room1Messages = [
        new Message("msg1", "Room 1 Msg", "user1", "room1", 1000)
      ];
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify(room1Messages.map((m) => m.toJSON()))
      );

      const messages = await messageService.getMessagesForRoom("room1");

      expect(messages).toHaveLength(1);
      expect(messages[0].roomId).toBe("room1");
    });
  });

  describe("deleteMessage", () => {
    it("should delete existing message", async () => {
      const existingMessages = [
        new Message("msg1", "Message 1", "user1", "room1", 1000),
        new Message("msg2", "Message 2", "user2", "room1", 2000)
      ];
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify(existingMessages.map((m) => m.toJSON()))
      );

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_messages_room1") {
          savedData = value;
        }
      });

      await messageService.deleteMessage("room1", "msg1");

      const saved = JSON.parse(savedData);
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe("msg2");
    });

    it("should reject when message not found", async () => {
      const existingMessages = [
        new Message("msg1", "Message 1", "user1", "room1", 1000)
      ];
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify(existingMessages.map((m) => m.toJSON()))
      );

      await expect(
        messageService.deleteMessage("room1", "nonexistent")
      ).rejects.toThrow('Message with ID "nonexistent" not found');
    });

    it("should handle deletion from empty room", async () => {
      storageMock.getItem.mockReturnValueOnce(null);

      await expect(
        messageService.deleteMessage("room1", "msg1")
      ).rejects.toThrow();
    });

    it("should preserve other messages when deleting", async () => {
      const existingMessages = [
        new Message("msg1", "Message 1", "user1", "room1", 1000),
        new Message("msg2", "Message 2", "user2", "room1", 2000),
        new Message("msg3", "Message 3", "user1", "room1", 3000)
      ];
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify(existingMessages.map((m) => m.toJSON()))
      );

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_messages_room1") {
          savedData = value;
        }
      });

      await messageService.deleteMessage("room1", "msg2");

      const saved = JSON.parse(savedData);
      expect(saved).toHaveLength(2);
      expect(saved.map((m: any) => m.id)).toEqual(["msg1", "msg3"]);
    });
  });
});
