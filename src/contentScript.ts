import { Message, MessageType } from "./types"

// https://detail.1688.com/offer/661066808303.html?spm=a260j.12536084.jr91vrik.5.408b2822BhMnIQ&&scm=1007.30832.181565.0&pvid=25efcde9-947c-417a-acbf-c681504137fe&object_id=661066808303&scm2=1007.30657.177495.0&pvid2=21db35fb-71b1-42e7-8422-b280c52ad1ac&trackInfo=3_661066808303_0.0922952_0.0_0.0_0.0__1294448
// https://detail.1688.com/offer/674447860950.html?spm=a260k.dacugeneral.home2019rec.5.74c4436cIaydZm&&scm=1007.21237.280932.0&pvid=81b941ba-3f32-461d-ac6b-797718bdc511&object_id=674447860950&udsPoolId=2274586&resourceId=1797996&resultType=normal
// https://detail.1688.com/offer/668522333493.html?spm=a260k.dacugeneral.home2019rec.33.74c4436cIaydZm&scm=1007.21237.280932.0&pvid=cbe0f125-2711-485f-80de-7d6b85941edc&object_id=668522333493&udsPoolId=2274586&resourceId=1797996&resultType=normal
// https://detail.1688.com/offer/613111636744.html?spm=a262eq.12572798.jsczf959.1.131c2fb1SrjwxA&&scm=1007.30832.181565.0&pvid=a575776b-82dd-42bd-a4e6-63f7d660e266&object_id=613111636744&scm2=1007.30657.177495.0&pvid2=970dbe53-a766-46c5-977e-ae5191897a10&trackInfo=0_613111636744_0.206162_10158.0_4.0_18.0__1292919
// https://detail.1688.com/offer/625837554766.html?spm=a26e3.21211157.kk3tjyb7.1.41214060CegzTc&object_id=625837554766&object_type=offer&scm=1007.33942.270402.0&tpp_trace=213fca2416601144881255888e390c&pvid=714ca72a-65c5-4164-b2fe-643a0c7b5bfe&udsPoolId=2968827&extStr=714ca72a-65c5-4164-b2fe-643a0c7b5bfe..1007.33942.270402.&tppAbIds=270402_432943_432942_432941&resourceId=2394367
// https://detail.1688.com/offer/597670272296.html?spm=a360q.7751291/legacy.0.0.6edb31384MJlwH
// https://detail.1688.com/offer/660546968329.html?spm=a262cb.19918180.kxh91p3z.2.d88b21c8LIdmNO

if (window.location.href.includes('localhost')) {
  const input = document.createElement('input')
  const button = document.createElement('button')
  const fragment = document.createDocumentFragment()

  input.type = 'text'
  input.placeholder = 'input your link'
  button.innerText = 'send'

  fragment.appendChild(input)
  fragment.appendChild(button)

  document.body.insertBefore(fragment, document.body.firstChild)

  button.addEventListener('click', () => {
    const message: Message = {
      type: MessageType.SEND_BACKGROUND,
      data: {
        url: input.value
      }
    }
    chrome.runtime.sendMessage(message, (response) => {
      console.log(response)
    })
  })
}

if (window.location.href.includes('1688')) {
  chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (message.type === MessageType.SEND_CONTENT_CRAWLER) {
      const attrItems = document.querySelectorAll('.offer-attr-item')
      const attribute: { [key: string]: any } = {}
      attrItems.forEach((item) => {
        const name = item.querySelector('.offer-attr-item-name')?.innerHTML
        const value = item.querySelector('.offer-attr-item-value')?.innerHTML
        if (name) {
          attribute[name] = value
        }
      })
      const message: Message = {
        type: MessageType.SEND_CONTENT_CRAWLER_RESULT,
        data: attribute
      }
      sendResponse(message)
    } else {
      sendResponse(null)
    }
  })
}

