import { Attribute, Message, MessageType, ProductInfo } from "../types"

export function alibabaRequestParse(url: string, html: string): ProductInfo {
  try {
    const match = html.match(/__INIT_DATA=(.+)\n/)
    if (match && match[1]) {
      const data = JSON.parse(match[1])
      const offerDomain = JSON.parse(data.globalData.offerDomain)
      const offerDetail = offerDomain.offerDetail
      const tradeModel = offerDomain.tradeModel

      const productInfo: ProductInfo = {
        name: offerDetail.subject,
        originUrl: url,
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
        attribute: {},
        description: ''
      }

      return productInfo
    } else {
      throw Error('no match')
    }
  } catch (error: any) {
    console.log(error)
    return {
      name: '',
      originUrl: '',
      imageList: [],
      priceRange: [],
      skuList: [],
      skuAttrList: [],
      description: '',
      attribute: {}
    }
  }
}

export function alibabaRenderParse(url: string): Promise<Attribute> {
  return new Promise(async (resolve, reject) => {
    const tab = await chrome.tabs.create({ url, active: false })
    if (tab) {
      const message: Message = { type: MessageType.SEND_CONTENT_CRAWLER }
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tab.id === tabId && changeInfo.status == 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.sendMessage(tabId, message, (response: Attribute) => {
            chrome.tabs.remove(tabId)
            resolve(response)
          });
        }
      })
    } else {
      reject({})
    }
  })
}
