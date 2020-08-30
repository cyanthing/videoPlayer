import styles from './popup.css'

interface Ipopup {
  width: string;
  height: string;
  title: string;
  pos: string;
  mask: boolean;
  content: (content: HTMLElement) => void;
}

interface Icomponent {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

function popup(options: Partial<Ipopup>) {
  return new Popup(options)
}

class Popup implements Icomponent {
  tempContainer
  mask

  constructor(private readonly props: Partial<Ipopup>) {
    this.props = Object.assign({
      width: '100%',
      height: '100%',
      title: '',
      pos: 'center',
      mask: true,
      content: function () {
      },
    }, this.props)
    this.init()
  }

  // 初始化
  init() {
    this.template()
    this.props.mask && this.createMask()
    this.handle()
    this.contentCallback()
  }

  // 创建模板
  template() {
    this.tempContainer = document.createElement('div')
    this.tempContainer.style.width = this.props.width
    this.tempContainer.style.height = this.props.height
    this.tempContainer.className = styles.popup
    this.tempContainer.innerHTML = `
      <div class="${styles['popup-title']}">
        <h3>${this.props.title}</h3>
        <i class="iconfont iconguanbi"></i>
      </div>
      <div class="${styles['popup-content']}"></div>
    `
    document.body.appendChild(this.tempContainer)
    if (this.props.pos === 'left') {
      this.tempContainer.style.left = 0
      this.tempContainer.style.bottom = 0
    } else if (this.props.pos === 'right') {
      this.tempContainer.style.right = 0
      this.tempContainer.style.bottom = 0
    } else {
      this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px'
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px'
    }
  }

  // 关闭事件操作
  handle() {
    const popupClose = this.tempContainer.querySelector(`.${styles['popup-title']} i`)
    popupClose.addEventListener('click', () => {
      document.body.removeChild(this.tempContainer)
      this.props.mask && document.body.removeChild(this.mask)
    })
  }

  // 创建遮罩
  createMask() {
    this.mask = document.createElement('div')
    this.mask.className = styles.mask
    this.mask.style.width = '100%'
    this.mask.style.height = document.body.offsetHeight + 'px'
    document.body.appendChild(this.mask)
  }

  contentCallback() {
    const popupContent = this.tempContainer.querySelector(`.${styles['popup-content']}`)
    this.props.content(popupContent)
  }
}

export default popup
