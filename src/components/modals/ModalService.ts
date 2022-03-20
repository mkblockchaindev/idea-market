const ModalService = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail))
  },
  open(component, props = {}, onClose = () => null) {
    document.dispatchEvent(
      new CustomEvent('open', { detail: { component, props, onClose } })
    )
  },
}

export default ModalService
