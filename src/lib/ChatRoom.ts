/**
 * ChatRoom class representing a chat room
 */
export class ChatRoom {
  id: string;
  name: string;
  participants: string[]; // Array of usernames

  constructor(id: string, name: string, participants: string[] = []) {
    this.id = id;
    this.name = name;
    this.participants = participants;
  }

  /**
   * Add a participant to the room
   */
  addParticipant(username: string): void {
    if (!this.participants.includes(username)) {
      this.participants.push(username);
    }
  }

  /**
   * Remove a participant from the room
   */
  removeParticipant(username: string): void {
    this.participants = this.participants.filter((p) => p !== username);
  }

  /**
   * Get the number of participants
   */
  getParticipantCount(): number {
    return this.participants.length;
  }

  /**
   * Convert room to a plain object for storage
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      participants: this.participants
    };
  }

  /**
   * Create a ChatRoom instance from a plain object
   */
  static fromJSON(data: any): ChatRoom {
    return new ChatRoom(data.id, data.name, data.participants || []);
  }
}
