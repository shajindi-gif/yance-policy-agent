import SafariServices

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        // Handle messages from the web extension's popup/content scripts
        let item = context.inputItems.first as? NSExtensionItem
        let message = item?.userInfo?[SFExtensionMessageKey] as? [String: Any]

        // Echo back a response
        let response = NSExtensionItem()
        response.userInfo = [
            SFExtensionMessageKey: [
                "status": "ok",
                "version": "2.0.0",
                "engine": "8-dimension matching"
            ]
        ]

        context.completeRequest(returningItems: [response], completionHandler: nil)
    }
}
