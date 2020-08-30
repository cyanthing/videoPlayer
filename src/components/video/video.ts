import styles from './video.css'

interface Ivideo {
  url: string;
  elem: string | HTMLElement;
  width?: string;
  height?: string;
  autoplay?: boolean;
}

interface Icomponent {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

function video(options: Ivideo) {
  return new Video(options)
}

class Video implements Icomponent {
  tempContainer
  constructor(private readonly props: Ivideo) {
    this.props = Object.assign({
      width: '100%',
      height: '100%',
      autoplay: false,
    }, this.props)
    this.init()
  }

  init() {
    this.template()
    this.handle()
  }

  template() {
    this.tempContainer = document.createElement('div')
    this.tempContainer.className = styles.video
    this.tempContainer.style.width = this.props.width
    this.tempContainer.style.height = this.props.height
    this.tempContainer.innerHTML = `
      <video class="${styles['video-content']}" src="${this.props.url}"></video>
      <div class="${styles['video-controls']}">
        <div class="${styles['video-progress']}">
          <div class="${styles['video-progress-now']}"></div>
          <div class="${styles['video-progress-suc']}"></div>
          <div class="${styles['video-progress-bar']}"></div>
        </div>
        <div class="${styles['video-play']}">
          <i class="iconfont iconbofang_huaban1"></i>
        </div>
        <div class="${styles['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
         <div class="${styles['video-full']}">
           <i class="iconfont iconmap-fullscreen"></i>
         </div>
         <div class="${styles['video-volume']}">
           <i class="iconfont iconduomeitiicon-"></i>
           <div class="${styles['video-volprogress']}">
             <div class="${styles['video-volprogress-now']}"></div>
             <div class="${styles['video-volprogress-bar']}"></div>
           </div>
         </div>
      </div>
    `
    // 判断传入的是id还是真实DOM节点
    if (typeof this.props.elem === 'object') {
      this.props.elem.appendChild(this.tempContainer)
    } else {
      document.querySelector(`${this.props.elem}`).appendChild(this.tempContainer)
    }
  }

  handle() {

  }
}

export default video
