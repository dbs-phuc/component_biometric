@objc(Component)
class Component: NSObject {

  @objc(multiply)
  func multiply() -> Void {
     guard let settingsURL = URL(string: UIApplication.openSettingsURLString) else { return }

    if UIApplication.shared.canOpenURL(settingsURL) {
        if #available(iOS 10.0, *) {
            UIApplication.shared.open(settingsURL, options: [:], completionHandler: nil)
        } else {
            UIApplication.shared.openURL(settingsURL)
        }
    }
  }
}
