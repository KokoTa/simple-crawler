import { Attribute, Message, MessageType, ProductInfo } from "../types"

export const createEmptyProductInfo: () => ProductInfo = () => {
  return {
    name: '',
    originUrl: '',
    currency: 'CNY',
    imageList: [],
    priceRange: [],
    skuList: [],
    skuAttrList: [],
    description: '',
    attribute: {}
  }
}

export async function alibabaRequestParse(url: string, html: string): Promise<ProductInfo> {
  try {
    const match = html.match(/__INIT_DATA=(.+)\n/)
    if (match && match[1]) {
      const data = JSON.parse(match[1])
      const offerDomain = JSON.parse(data.globalData.offerDomain)
      const offerDetail = offerDomain.offerDetail
      const tradeModel = offerDomain.tradeModel
      const detailInfo = await fetch(offerDetail.detailUrl)
      const detailStr = await detailInfo.text()
      const detailMatch = detailStr.match(/var offer_details=(.+);/)
      if (detailMatch && detailMatch[1]) {
        const json = JSON.parse(detailMatch[1])
        const description = json.content
        const productInfo: ProductInfo = {
          name: offerDetail.subject,
          originUrl: url,
          currency: 'CNY',
          imageList: offerDetail.imageList.map((item: any) => item.fullPathImageURI),
          priceRange: tradeModel.offerPriceModel.currentPrices,
          skuList: tradeModel.skuMap.map((item: any) => ({
            name: item.specAttrs,
            price: item.price
          })),
          skuAttrList: offerDetail.skuProps.map((item: any) => ({
            key: item.prop,
            value: item.value.map((item: any) => ({
              name: item.name,
              image: item.imageUrl
            }))
          })),
          description,
          attribute: {},
        }
        return productInfo
      }
    }
    return createEmptyProductInfo()
  } catch (error: any) {
    console.log(error)
    return createEmptyProductInfo()
  }
}

export function alibabaRenderParse(url: string): Promise<Attribute> {
  return new Promise(async (resolve) => {
    const tab = await chrome.tabs.create({ url, active: false })
    if (tab) {
      const message: Message = { type: MessageType.SEND_CONTENT_CRAWLER }
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tab.id === tabId && changeInfo.status == 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.sendMessage(tabId, message, (response: Message) => {
            chrome.tabs.remove(tabId)
            if (response.type = MessageType.SEND_CONTENT_CRAWLER_RESULT) {
              resolve(response.data)
            } else {
              resolve({})
            }
          });
        }
      })
    } else {
      resolve({})
    }
  })
}
