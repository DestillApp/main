export interface DeleteItemModalEvents {
  (e: "close-delete-modal"): void;
  (e: "delete-item"): void;
}

export interface AskModalEvents {
  (e: "close-modal"): void;
  (e: "handle-yes"): void;
}

export interface DistillerForm {
  (e: "close-modal"): void;
}
