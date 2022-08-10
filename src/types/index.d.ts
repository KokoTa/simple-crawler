type SingleSkuInfo = {
  name: string
  price: number
}
type SingleAttributeInfo = {
  key: string
  value: {
    name: string
    image?: string
  }
}
declare interface ProductInfo {
  name: string
  originUrl: string
  imageList: string[]
  priceRange: number[]
  skuMap: SingleSkuInfo[],
  attributeMap: SingleAttributeInfo[],
  description: string
}
