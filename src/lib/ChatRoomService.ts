import { ChatRoom } from "./ChatRoom.js";

/**
 * Service for managing chat rooms with localStorage persistence
 */
export class ChatRoomService {
  private readonly STORAGE_KEY = "chat_rooms";
  private readonly DEFAULT_ROOM_ID = "general";
  private readonly DEFAULT_ROOM_NAME = "general";

  /**
   * Initialize the chat room service and create default room if needed
   */
  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = this.getAllRoomsSync();
        if (rooms.length === 0) {
          this.createDefaultRoom();
        }
        resolve();
      }, 0);
    });
  }

  /**
   * Get all chat rooms
   */
  async getAllRooms(): Promise<ChatRoom[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getAllRoomsSync());
      }, 0);
    });
  }

  /**
   * Synchronous version of getAllRooms for internal use
   */
  private getAllRoomsSync(): ChatRoom[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }
      const rooms = JSON.parse(data);
      return rooms.map((room: any) => ChatRoom.fromJSON(room));
    } catch (error) {
      console.error("Error retrieving rooms from storage:", error);
      return [];
    }
  }

  /**
   * Get a chat room by ID
   */
  async getRoomById(roomId: string): Promise<ChatRoom | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = this.getAllRoomsSync();
        const room = rooms.find((r) => r.id === roomId) || null;
        resolve(room);
      }, 0);
    });
  }

  /**
   * Create a new chat room
   */
  async createRoom(name: string, createdBy: string): Promise<ChatRoom> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const rooms = this.getAllRoomsSync();

          // Check if room with this name already exists
          if (rooms.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
            reject(new Error(`Room "${name}" already exists`));
            return;
          }

          const newRoom = new ChatRoom(this.generateId(), name, [createdBy]);

          rooms.push(newRoom);
          localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(rooms.map((r) => r.toJSON()))
          );
          resolve(newRoom);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }

  /**
   * Join a user to an existing room
   */
  async joinRoom(roomId: string, username: string): Promise<ChatRoom> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const rooms = this.getAllRoomsSync();
          const room = rooms.find((r) => r.id === roomId);

          if (!room) {
            reject(new Error(`Room with ID "${roomId}" not found`));
            return;
          }

          room.addParticipant(username);
          localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(rooms.map((r) => r.toJSON()))
          );
          resolve(room);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }

  /**
   * Leave a user from a room
   */
  async leaveRoom(roomId: string, username: string): Promise<ChatRoom> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const rooms = this.getAllRoomsSync();
          const room = rooms.find((r) => r.id === roomId);

          if (!room) {
            reject(new Error(`Room with ID "${roomId}" not found`));
            return;
          }

          room.removeParticipant(username);
          localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(rooms.map((r) => r.toJSON()))
          );
          resolve(room);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }

  /**
   * Get the default general room
   */
  async getDefaultRoom(): Promise<ChatRoom | null> {
    return this.getRoomById(this.DEFAULT_ROOM_ID);
  }

  /**
   * Create the default general room
   */
  private createDefaultRoom(): void {
    try {
      const defaultRoom = new ChatRoom(
        this.DEFAULT_ROOM_ID,
        this.DEFAULT_ROOM_NAME,
        []
      );
      const rooms = [defaultRoom];
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(rooms.map((r) => r.toJSON()))
      );
    } catch (error) {
      console.error("Error creating default room:", error);
    }
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
