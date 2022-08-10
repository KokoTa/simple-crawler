import { alibabaRenderParse, alibabaRequestParse } from "./parses/alibaba";
import { Message, MessageType, ProductInfo } from "./types"

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  if (message.type === MessageType.SEND_BACKGROUND) {
    const { data } = message
    fetch(data.url)
      .then(res => res.text())
      .then(async (html) => {
        const productInfo: ProductInfo = alibabaRequestParse(data.url, html)
        productInfo.attribute = await alibabaRenderParse(data.url)
        sendResponse(productInfo)
      }).catch(err => {
        console.log(err)
        sendResponse(null)
      })
  }
  return true
})
