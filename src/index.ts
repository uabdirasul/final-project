import { AuthService } from "./lib/AuthService.js";
import { ChatRoom } from "./lib/ChatRoom.js";
import { ChatRoomService } from "./lib/ChatRoomService.js";
import { MessageService } from "./lib/MessageService.js";

/**
 * ChatController - Handles the chat app functionality
 */
class ChatController {
  private logoutButton: HTMLButtonElement | null;
  private userDisplay: HTMLElement | null;
  private currentUsername: string | null = null;
  private currentRoom: ChatRoom | null = null;

  private chatRoomService: ChatRoomService;
  private messageService: MessageService;

  // UI Elements
  private roomsList: HTMLElement | null;
  private noRoomsMessage: HTMLElement | null;
  private togglCreateBtn: HTMLButtonElement | null;
  private createRoomForm: HTMLElement | null;
  private roomNameInput: HTMLInputElement | null;
  private createRoomSubmitBtn: HTMLButtonElement | null;
  private cancelCreateBtn: HTMLButtonElement | null;

  private roomNameElement: HTMLElement | null;
  private roomMembersElement: HTMLElement | null;
  private messagesContainer: HTMLElement | null;
  private messageForm: HTMLFormElement | null;
  private messageInput: HTMLInputElement | null;
  private sendBtn: HTMLButtonElement | null;

  constructor() {
    // Initialize services
    this.chatRoomService = new ChatRoomService();
    this.messageService = new MessageService();

    // Get form elements
    this.logoutButton = document.getElementById(
      "logoutBtn"
    ) as HTMLButtonElement | null;
    this.userDisplay = document.getElementById(
      "currentUser"
    ) as HTMLElement | null;

    // Room sidebar elements
    this.roomsList = document.getElementById("roomsList");
    this.noRoomsMessage = document.getElementById("noRoomsMessage");
    this.togglCreateBtn = document.getElementById(
      "toggleCreateBtn"
    ) as HTMLButtonElement | null;
    this.createRoomForm = document.getElementById("createRoomForm");
    this.roomNameInput = document.getElementById(
      "roomNameInput"
    ) as HTMLInputElement | null;
    this.createRoomSubmitBtn = document.getElementById(
      "createRoomSubmitBtn"
    ) as HTMLButtonElement | null;
    this.cancelCreateBtn = document.getElementById(
      "cancelCreateBtn"
    ) as HTMLButtonElement | null;

    // Main chat area elements
    this.roomNameElement = document.getElementById("roomName");
    this.roomMembersElement = document.getElementById("roomMembers");
    this.messagesContainer = document.getElementById("messagesContainer");
    this.messageForm = document.getElementById(
      "messageForm"
    ) as HTMLFormElement | null;
    this.messageInput = document.getElementById(
      "messageInput"
    ) as HTMLInputElement | null;
    this.sendBtn = document.getElementById(
      "sendBtn"
    ) as HTMLButtonElement | null;

    this.init();
  }

  /**
   * Initialize the chat app
   */
  private async init(): Promise<void> {
    try {
      // Get and display current user
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        window.location.href = "/signin/signin.html";
        return;
      }

      this.currentUsername = currentUser;
      if (this.userDisplay) {
        this.userDisplay.textContent = currentUser;
      }

      // Initialize chat room service
      await this.chatRoomService.initialize();

      // Load default room
      await this.loadDefaultRoom();

      // Render rooms
      await this.renderRooms();

      // Attach event listeners
      this.attachEventListeners();

      // Set up message refresh interval (polling for new messages)
      setInterval(() => this.refreshMessages(), 2000);
    } catch (error) {
      console.error("Error initializing chat app:", error);
    }
  }

  /**
   * Load the default general room
   */
  private async loadDefaultRoom(): Promise<void> {
    try {
      const defaultRoom = await this.chatRoomService.getDefaultRoom();
      if (defaultRoom) {
        if (this.currentUsername) {
          await this.chatRoomService.joinRoom(
            defaultRoom.id,
            this.currentUsername
          );
        }
        this.currentRoom = defaultRoom;
        await this.renderRoomHeader();
        await this.renderMessages();
      }
    } catch (error) {
      console.error("Error loading default room:", error);
    }
  }

  /**
   * Render all available rooms in the sidebar
   */
  private async renderRooms(): Promise<void> {
    try {
      const rooms = await this.chatRoomService.getAllRooms();

      if (!this.roomsList) return;

      // Clear existing rooms
      this.roomsList.innerHTML = "";

      if (rooms.length === 0) {
        if (this.noRoomsMessage) {
          this.noRoomsMessage.classList.remove("hidden");
        }
        return;
      }

      if (this.noRoomsMessage) {
        this.noRoomsMessage.classList.add("hidden");
      }

      // Create room buttons
      rooms.forEach((room) => {
        const roomButton = document.createElement("button");
        roomButton.type = "button";
        roomButton.className =
          "w-full text-left px-3 py-2 rounded-lg transition-colors " +
          (this.currentRoom?.id === room.id
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "hover:bg-gray-800 text-gray-300");

        roomButton.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-lg">#</span>
            <span class="font-medium">${this.escapeHtml(room.name)}</span>
          </div>
          <div class="text-xs ${
            this.currentRoom?.id === room.id ? "text-gray-300" : "text-gray-500"
          } mt-1">
            ${room.getParticipantCount()} member${
              room.getParticipantCount() !== 1 ? "s" : ""
            }
          </div>
        `;

        roomButton.addEventListener("click", () => this.switchRoom(room));

        this.roomsList!.appendChild(roomButton);
      });
    } catch (error) {
      console.error("Error rendering rooms:", error);
    }
  }

  /**
   * Switch to a different room
   */
  private async switchRoom(room: ChatRoom): Promise<void> {
    try {
      // Just set the current room, don't automatically join
      this.currentRoom = room;

      await this.renderRooms();
      await this.renderRoomHeader();
      await this.renderMessages();
    } catch (error) {
      console.error("Error switching room:", error);
      alert("Failed to switch room");
    }
  }

  /**
   * Render the room header information
   */
  private async renderRoomHeader(): Promise<void> {
    if (!this.currentRoom || !this.roomNameElement || !this.roomMembersElement)
      return;

    this.roomNameElement.textContent = `#${this.currentRoom.name}`;
    this.roomMembersElement.textContent = `${this.currentRoom.getParticipantCount()} member${
      this.currentRoom.getParticipantCount() !== 1 ? "s" : ""
    } in this room`;
  }

  /**
   * Render messages for the current room
   */
  private async renderMessages(): Promise<void> {
    try {
      if (!this.currentRoom || !this.messagesContainer) return;

      const messages = await this.messageService.getMessagesForRoom(
        this.currentRoom.id
      );

      this.messagesContainer.innerHTML = "";

      if (messages.length === 0) {
        this.messagesContainer.innerHTML = `
          <div class="flex items-center justify-center h-full">
            <div class="text-center">
              <p class="text-gray-500 mb-2">No messages yet</p>
              <p class="text-sm text-gray-400">Be the first to start a conversation in ${this.escapeHtml(
                this.currentRoom.name
              )}</p>
            </div>
          </div>
        `;
      } else {
        messages.forEach((message) => {
          const messageElement = document.createElement("div");
          messageElement.className = "flex gap-3";
          messageElement.innerHTML = `
            <div class="flex-1">
              <div class="flex items-baseline gap-2 mb-1">
                <span class="font-semibold text-gray-800">${this.escapeHtml(
                  message.sender
                )}</span>
                <span class="text-xs text-gray-500">${message.getFormattedTime()}</span>
              </div>
              <p class="text-gray-700 break-words">${this.escapeHtml(
                message.contents
              )}</p>
            </div>
          `;
          this.messagesContainer!.appendChild(messageElement);
        });

        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }

      // Render the appropriate input area
      await this.renderMessageInputArea();
    } catch (error) {
      console.error("Error rendering messages:", error);
    }
  }

  /**
   * Render message input area or join prompt based on participant status
   */
  private async renderMessageInputArea(): Promise<void> {
    try {
      if (!this.currentRoom || !this.messageForm) return;

      const isParticipant = this.currentRoom.participants.includes(
        this.currentUsername!
      );

      if (!isParticipant) {
        // Show join button
        this.messageForm.innerHTML = `
          <div class="w-full flex items-center justify-center py-8">
            <div class="text-center">
              <p class="text-gray-600 mb-4">You are not a member of this room</p>
              <button
                type="button"
                id="joinRoomBtn"
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-2 rounded-lg transition"
              >
                Join Room
              </button>
            </div>
          </div>
        `;

        // Attach join button listener
        const joinBtn = document.getElementById("joinRoomBtn");
        if (joinBtn) {
          joinBtn.addEventListener("click", () => this.handleJoinRoom());
        }
      } else {
        // Show message form
        this.messageForm.innerHTML = `
          <label for="messageInput" class="sr-only">
            Message
          </label>
          <input
            id="messageInput"
            type="text"
            placeholder="Type a message..."
            autocomplete="off"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            id="sendBtn"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Send
          </button>
        `;

        // Update references
        this.messageInput = document.getElementById(
          "messageInput"
        ) as HTMLInputElement | null;
        this.sendBtn = document.getElementById(
          "sendBtn"
        ) as HTMLButtonElement | null;
      }
    } catch (error) {
      console.error("Error rendering message input area:", error);
    }
  }

  /**
   * Refresh messages (for polling)
   */
  private async refreshMessages(): Promise<void> {
    if (!this.currentRoom) return;

    try {
      const messages = await this.messageService.getMessagesForRoom(
        this.currentRoom.id
      );
      // Check if we already have these messages rendered
      const messageElements =
        this.messagesContainer?.querySelectorAll(".flex.gap-3") || [];
      if (messages.length !== messageElements.length) {
        await this.renderMessages();
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  }

  /**
   * Handle sending a message
   */
  private async handleSendMessage(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.currentRoom || !this.currentUsername) return;

    // Check if user is a participant in the room
    if (!this.currentRoom.participants.includes(this.currentUsername)) {
      // User is not a participant, ignore submission
      return;
    }

    if (!this.messageInput) return;

    const content = this.messageInput.value.trim();
    if (!content) return;

    try {
      await this.messageService.sendMessage(
        content,
        this.currentUsername,
        this.currentRoom.id
      );

      this.messageInput.value = "";
      await this.renderMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  }

  /**
   * Handle joining a room
   */
  private async handleJoinRoom(): Promise<void> {
    try {
      if (!this.currentRoom || !this.currentUsername) return;

      const updatedRoom = await this.chatRoomService.joinRoom(
        this.currentRoom.id,
        this.currentUsername
      );

      this.currentRoom = updatedRoom;
      await this.renderRoomHeader();
      await this.renderRooms();
      await this.renderMessages();
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room");
    }
  }

  /**
   * Handle creating a new room
   */
  private async handleCreateRoom(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.roomNameInput || !this.currentUsername) return;

    const roomName = this.roomNameInput.value.trim();
    if (!roomName) return;

    try {
      await this.chatRoomService.createRoom(roomName, this.currentUsername);
      this.roomNameInput.value = "";
      if (this.createRoomForm) {
        this.createRoomForm.classList.add("hidden");
      }
      if (this.togglCreateBtn) {
        this.togglCreateBtn.classList.remove("hidden");
      }
      await this.renderRooms();
    } catch (error) {
      console.error("Error creating room:", error);
      alert(`Failed to create room: ${(error as any).message}`);
    }
  }

  /**
   * Toggle the create room form
   */
  private toggleCreateRoomForm(): void {
    if (!this.createRoomForm || !this.togglCreateBtn) return;

    const isHidden = this.createRoomForm.classList.contains("hidden");
    if (isHidden) {
      this.createRoomForm.classList.remove("hidden");
      this.togglCreateBtn.classList.add("hidden");
      if (this.roomNameInput) {
        this.roomNameInput.focus();
      }
    } else {
      this.createRoomForm.classList.add("hidden");
      this.togglCreateBtn.classList.remove("hidden");
      if (this.roomNameInput) {
        this.roomNameInput.value = "";
      }
    }
  }

  /**
   * Handles logout
   */
  private async handleLogout(event: Event): Promise<void> {
    event.preventDefault();

    // Clear authentication
    await AuthService.logout();

    // Redirect to signin
    window.location.href = "/signin/signin.html";
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    // Logout button
    if (this.logoutButton) {
      this.logoutButton.addEventListener("click", (e) => this.handleLogout(e));
    }

    // Create room button
    if (this.togglCreateBtn) {
      this.togglCreateBtn.addEventListener("click", () =>
        this.toggleCreateRoomForm()
      );
    }

    // Create room form
    if (this.createRoomForm) {
      this.createRoomForm.addEventListener("submit", (e) =>
        this.handleCreateRoom(e)
      );
    }

    // Cancel create room
    if (this.cancelCreateBtn) {
      this.cancelCreateBtn.addEventListener("click", () =>
        this.toggleCreateRoomForm()
      );
    }

    // Message form
    if (this.messageForm) {
      this.messageForm.addEventListener("submit", (e) =>
        this.handleSendMessage(e)
      );
    }
  }

  /**
   * Escape HTML characters to prevent XSS
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

// Initialize the chat controller when the DOM is ready
// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ChatController();
});
