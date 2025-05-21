export interface DeleteItemModalEvents {
  (e: "close-delete-modal"): void;
  (e: "delete-item"): void;
}

export interface CloseModal {
  (e: "close-modal"): void;
}

export interface AskModalEvents extends CloseModal {
  (e: "handle-yes"): void;
}

export interface ToggleMenu {
  (e: "toggle-menu"): void;
}
