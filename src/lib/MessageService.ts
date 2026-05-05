import { Message, MessageJSON } from "./Message.js";

/**
 * Service for managing messages with localStorage persistence
 */
export class MessageService {
  private readonly STORAGE_KEY_PREFIX = "chat_messages_";

  /**
   * Send a message to a chat room
   */
  async sendMessage(
    contents: string,
    sender: string,
    roomId: string
  ): Promise<Message> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!contents.trim()) {
            reject(new Error("Message content cannot be empty"));
            return;
          }

          const message = new Message(
            this.generateId(),
            contents,
            sender,
            roomId
          );

          const messages = this.getMessagesForRoomSync(roomId);
          messages.push(message);
          this.saveMessagesForRoomSync(roomId, messages);
          resolve(message);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }

  /**
   * Get all messages for a specific room
   */
  async getMessagesForRoom(roomId: string): Promise<Message[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMessagesForRoomSync(roomId));
      }, 0);
    });
  }

  /**
   * Synchronous version of getMessagesForRoom for internal use
   */
  private getMessagesForRoomSync(roomId: string): Message[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + roomId);
      if (!data) {
        return [];
      }
      const messages = JSON.parse(data);
      return messages.map((msg: Record<string, unknown>) =>
        Message.fromJSON(msg as unknown as MessageJSON)
      );
    } catch (error) {
      console.error("Error retrieving messages from storage:", error);
      return [];
    }
  }

  /**
   * Save messages for a room (internal use)
   */
  private saveMessagesForRoomSync(roomId: string, messages: Message[]): void {
    try {
      const key = this.STORAGE_KEY_PREFIX + roomId;
      localStorage.setItem(
        key,
        JSON.stringify(messages.map((m) => m.toJSON()))
      );
    } catch (error) {
      console.error("Error saving messages to storage:", error);
    }
  }

  /**
   * Delete a message from a room
   */
  async deleteMessage(roomId: string, messageId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const messages = this.getMessagesForRoomSync(roomId);
          const filteredMessages = messages.filter((m) => m.id !== messageId);

          if (filteredMessages.length === messages.length) {
            reject(new Error(`Message with ID "${messageId}" not found`));
            return;
          }

          this.saveMessagesForRoomSync(roomId, filteredMessages);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }

  /**
   * Clear all messages for a room
   */
  async clearMessagesForRoom(roomId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const key = this.STORAGE_KEY_PREFIX + roomId;
          localStorage.removeItem(key);
          resolve();
        } catch (error) {
          console.error("Error clearing messages:", error);
          resolve();
        }
      }, 0);
    });
  }

  /**
   * Get the total number of messages across all rooms
   */
  async getTotalMessageCount(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
            try {
              const data = localStorage.getItem(key);
              if (data) {
                const messages = JSON.parse(data);
                count += messages.length;
              }
            } catch (error) {
              console.error("Error counting messages:", error);
            }
          }
        }
        resolve(count);
      }, 0);
    });
  }

  /**
   * Generate a unique ID for messages
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
