/**
 * Message class representing a chat message
 */
export class Message {
  id: string;
  contents: string;
  timestamp: number;
  sender: string;
  roomId: string;

  constructor(
    id: string,
    contents: string,
    sender: string,
    roomId: string,
    timestamp?: number
  ) {
    this.id = id;
    this.contents = contents;
    this.timestamp = timestamp || Date.now();
    this.sender = sender;
    this.roomId = roomId;
  }

  /**
   * Format the timestamp to a readable time string
   */
  getFormattedTime(): string {
    const date = new Date(this.timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  /**
   * Convert message to a plain object for storage
   */
  toJSON() {
    return {
      id: this.id,
      contents: this.contents,
      timestamp: this.timestamp,
      sender: this.sender,
      roomId: this.roomId
    };
  }

  /**
   * Create a Message instance from a plain object
   */
  static fromJSON(data: any): Message {
    return new Message(
      data.id,
      data.contents,
      data.sender,
      data.roomId,
      data.timestamp
    );
  }
}
