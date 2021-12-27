const FETCH_SIZE = 500

function getInboxStats() {
  const numberFetchesNeeded = Math.ceil(GmailApp.getInboxUnreadCount() / FETCH_SIZE);
  const allThreadsBySender = {}
  let threads = []
  let message = null;
  let sender = null;
  for (let i = 0; i < numberFetchesNeeded; i++) {
    // This might be overcounting but :shrug: I just need it to be close enough
    threads = GmailApp.getInboxThreads(i * FETCH_SIZE, FETCH_SIZE)
    threads.map(thread => {
      message = thread.getMessages()[0] 
      sender = message.getFrom()
      if (allThreadsBySender[sender] === undefined) {
        allThreadsBySender[sender] = [thread]
      } else {
        allThreadsBySender[sender].push(thread)
      }
    })
  }

  const senders = Object.keys(allThreadsBySender);
  const senderTable = []
  senders.map(s => {
    senderTable.push([s, allThreadsBySender[s].length])
  })

  const body = JSON.stringify({"data": senderTable})
  const resp = ContentService.createTextOutput(body)
  resp.setMimeType(ContentService.MimeType.JSON)
  return body
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}
