export const MessageType = {
  ERROR: "ERROR",
  INFO: "INFO",
}

export type MessageType = typeof MessageType[keyof typeof MessageType] | null;

export type MessageState = {
  type: MessageType;
  text: string;
};

export const messageTypeIsError = (message: MessageState) => message.type === MessageType.ERROR;
export const messageTypeIsInfo = (message: MessageState) => message.type === MessageType.INFO;

export const replaceSpacesWithDashes = (itemName: string): string => 
  itemName.replace(/\s+/g, '-');
