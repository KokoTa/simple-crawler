import { Message, MessageType } from "./types"

function handleFrontCrawler(url: string, sendResponse: Function, syncResult?: any) {
  chrome.tabs.create({ url, active: false })
    .then((tab) => {
      const message: Message = {
        type: MessageType.SEND_CONTENT_CRAWLER
      }
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tab.id === tabId && changeInfo.status == 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.sendMessage(tabId, message, (asyncResult) => {
            sendResponse({
              syncResult,
              asyncResult
            })
            chrome.tabs.remove(tabId)
          });
        }
      })
    })
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  if (message.type === MessageType.SEND_BACKGROUND) {
    const { data } = message
    fetch(data.url)
      .then(res => res.text())
      .then(html => {
        const match = html.match(/__INIT_DATA=(.+)\n/)
        if (match && match[1]) {
          handleFrontCrawler(data.url, sendResponse, JSON.parse(match[1]))
        }
      }).catch(err => {
        sendResponse(null)
      })
  }
  return true
})
