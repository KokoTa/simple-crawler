import { alibabaRenderParse, alibabaRequestParse } from "./parses/alibaba";
import { Message, MessageType, ProductInfo } from "./types"

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  if (message.type === MessageType.SEND_BACKGROUND) {
    const { data } = message
    fetch(data.url)
      .then(res => res.text())
      .then(async (html) => {
        const productInfo: ProductInfo = await alibabaRequestParse(data.url, html)
        const attribute = await alibabaRenderParse(data.url)
        productInfo.attribute = attribute
        sendResponse(productInfo)
      }).catch(err => {
        console.log(err)
        sendResponse(null)
      })
  }
  return true
})
