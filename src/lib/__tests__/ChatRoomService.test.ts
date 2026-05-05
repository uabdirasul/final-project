import { ChatRoom } from "../ChatRoom";
import { ChatRoomService } from "../ChatRoomService";

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

describe("ChatRoomService", () => {
  let storageMock: ReturnType<typeof createStorageMock>;
  let chatRoomService: ChatRoomService;

  beforeEach(() => {
    storageMock = createStorageMock();
    Object.defineProperty(global, "localStorage", {
      value: storageMock,
      writable: true
    });
    chatRoomService = new ChatRoomService();
    jest.clearAllMocks();
  });

  describe("initialize", () => {
    it("should create default room if no rooms exist", async () => {
      storageMock.getItem.mockReturnValueOnce(null);

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_rooms") {
          savedData = value;
        }
      });

      await chatRoomService.initialize();

      const saved = JSON.parse(savedData);
      expect(saved).toHaveLength(1);
      expect(saved[0].name).toBe("general");
      expect(saved[0].id).toBe("general");
    });

    it("should not create room if rooms already exist", async () => {
      const existingRoom = new ChatRoom("room1", "Test Room");
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([existingRoom.toJSON()])
      );

      await chatRoomService.initialize();

      expect(storageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe("getAllRooms", () => {
    it("should return empty array when no rooms exist", async () => {
      storageMock.getItem.mockReturnValueOnce(null);

      const rooms = await chatRoomService.getAllRooms();

      expect(rooms).toEqual([]);
    });

    it("should return all rooms from storage", async () => {
      const testRooms = [
        new ChatRoom("room1", "Room 1", ["user1"]),
        new ChatRoom("room2", "Room 2", ["user2"])
      ];
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify(testRooms.map((r) => r.toJSON()))
      );

      const rooms = await chatRoomService.getAllRooms();

      expect(rooms).toHaveLength(2);
      expect(rooms[0].name).toBe("Room 1");
      expect(rooms[1].name).toBe("Room 2");
    });

    it("should handle corrupted storage data", async () => {
      storageMock.getItem.mockReturnValueOnce("invalid json");

      const rooms = await chatRoomService.getAllRooms();

      expect(rooms).toEqual([]);
    });
  });

  describe("getRoomById", () => {
    it("should return null when room not found", async () => {
      storageMock.getItem.mockReturnValueOnce(JSON.stringify([]));

      const room = await chatRoomService.getRoomById("nonexistent");

      expect(room).toBeNull();
    });

    it("should return room when found", async () => {
      const testRoom = new ChatRoom("room1", "Test Room", ["user1"]);
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([testRoom.toJSON()])
      );

      const room = await chatRoomService.getRoomById("room1");

      expect(room).not.toBeNull();
      expect(room?.name).toBe("Test Room");
      expect(room?.id).toBe("room1");
    });

    it("should return first matching room", async () => {
      const testRooms = [
        new ChatRoom("room1", "Room 1"),
        new ChatRoom("room2", "Room 2"),
        new ChatRoom("room3", "Room 3")
      ];
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify(testRooms.map((r) => r.toJSON()))
      );

      const room = await chatRoomService.getRoomById("room2");

      expect(room?.name).toBe("Room 2");
    });
  });

  describe("createRoom", () => {
    it("should create new room successfully", async () => {
      storageMock.getItem.mockReturnValueOnce(JSON.stringify([]));

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_rooms") {
          savedData = value;
        }
      });

      const room = await chatRoomService.createRoom("New Room", "creator");

      expect(room.name).toBe("New Room");
      expect(room.participants).toContain("creator");

      const saved = JSON.parse(savedData);
      expect(saved).toHaveLength(1);
      expect(saved[0].name).toBe("New Room");
    });

    it("should reject duplicate room name", async () => {
      const existingRoom = new ChatRoom("room1", "Existing Room");
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([existingRoom.toJSON()])
      );

      await expect(
        chatRoomService.createRoom("Existing Room", "user1")
      ).rejects.toThrow("already exists");
    });

    it("should reject duplicate room name case-insensitively", async () => {
      const existingRoom = new ChatRoom("room1", "Test Room");
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([existingRoom.toJSON()])
      );

      await expect(
        chatRoomService.createRoom("test room", "user1")
      ).rejects.toThrow("already exists");
    });

    it("should generate unique room ID", async () => {
      storageMock.getItem.mockReturnValueOnce(JSON.stringify([]));

      const room1 = await chatRoomService.createRoom("Room 1", "user1");

      storageMock.getItem.mockReturnValueOnce(JSON.stringify([room1.toJSON()]));

      const room2 = await chatRoomService.createRoom("Room 2", "user1");

      expect(room1.id).not.toBe(room2.id);
    });

    it("should preserve existing rooms when creating new one", async () => {
      const existingRoom = new ChatRoom("room1", "Room 1");
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([existingRoom.toJSON()])
      );

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_rooms") {
          savedData = value;
        }
      });

      await chatRoomService.createRoom("Room 2", "user1");

      const saved = JSON.parse(savedData);
      expect(saved).toHaveLength(2);
      expect(saved[0].name).toBe("Room 1");
      expect(saved[1].name).toBe("Room 2");
    });
  });

  describe("joinRoom", () => {
    it("should add user to room", async () => {
      const testRoom = new ChatRoom("room1", "Test Room", ["user1"]);
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([testRoom.toJSON()])
      );

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_rooms") {
          savedData = value;
        }
      });

      const room = await chatRoomService.joinRoom("room1", "user2");

      expect(room.participants).toContain("user1");
      expect(room.participants).toContain("user2");

      const saved = JSON.parse(savedData);
      expect(saved[0].participants).toContain("user2");
    });

    it("should reject when room not found", async () => {
      storageMock.getItem.mockReturnValueOnce(JSON.stringify([]));

      await expect(
        chatRoomService.joinRoom("nonexistent", "user1")
      ).rejects.toThrow("not found");
    });

    it("should not add duplicate user", async () => {
      const testRoom = new ChatRoom("room1", "Test Room", ["user1"]);
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([testRoom.toJSON()])
      );

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_rooms") {
          savedData = value;
        }
      });

      await chatRoomService.joinRoom("room1", "user1");

      const saved = JSON.parse(savedData);
      expect(
        saved[0].participants.filter((p: string) => p === "user1")
      ).toHaveLength(1);
    });
  });

  describe("leaveRoom", () => {
    it("should remove user from room", async () => {
      const testRoom = new ChatRoom("room1", "Test Room", ["user1", "user2"]);
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([testRoom.toJSON()])
      );

      let savedData = "";
      storageMock.setItem.mockImplementation((key, value) => {
        if (key === "chat_rooms") {
          savedData = value;
        }
      });

      const room = await chatRoomService.leaveRoom("room1", "user1");

      expect(room.participants).not.toContain("user1");
      expect(room.participants).toContain("user2");

      const saved = JSON.parse(savedData);
      expect(saved[0].participants).not.toContain("user1");
      expect(saved[0].participants).toContain("user2");
    });

    it("should reject when room not found", async () => {
      storageMock.getItem.mockReturnValueOnce(JSON.stringify([]));

      await expect(
        chatRoomService.leaveRoom("nonexistent", "user1")
      ).rejects.toThrow("not found");
    });

    it("should handle user not in room", async () => {
      const testRoom = new ChatRoom("room1", "Test Room", ["user1"]);
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([testRoom.toJSON()])
      );

      const room = await chatRoomService.leaveRoom("room1", "user2");

      expect(room.participants).toEqual(["user1"]);
    });
  });

  describe("getDefaultRoom", () => {
    it("should return general room when it exists", async () => {
      const generalRoom = new ChatRoom("general", "general");
      storageMock.getItem.mockReturnValueOnce(
        JSON.stringify([generalRoom.toJSON()])
      );

      const room = await chatRoomService.getDefaultRoom();

      expect(room).not.toBeNull();
      expect(room?.name).toBe("general");
    });

    it("should return null when general room does not exist", async () => {
      storageMock.getItem.mockReturnValueOnce(JSON.stringify([]));

      const room = await chatRoomService.getDefaultRoom();

      expect(room).toBeNull();
    });
  });
});
