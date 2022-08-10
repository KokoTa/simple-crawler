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

export type SkuList = {
  name: string
  price: number
}
export type SkuAttrList = {
  key: string
  value: {
    name: string
    image?: string
  }
}
export type PriceRange = {
  beginAmount: number,
  price: number
}
export type Attribute = {
  [key: string]: any
}
export interface ProductInfo {
  name: string
  originUrl: string
  imageList: string[]
  priceRange: PriceRange[]
  skuList: SkuList[]
  skuAttrList: SkuAttrList[]
  description: string
  attribute: Attribute
}
