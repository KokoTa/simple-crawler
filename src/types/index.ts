export enum MessageType {
  'SEND_BACKGROUND',
  'SEND_CONTENT_RESULT',
  'SEND_CONTENT_CRAWLER',
  'SEND_CONTENT_CRAWLER_RESULT'
}

export interface Message {
  type: MessageType
  data?: any
}
