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
    const videoContent: HTMLVideoElement = this.tempContainer.querySelector(`.${styles['video-content']}`)
    const videoControls = this.tempContainer.querySelector(`.${styles['video-controls']}`)
    const videoPlay = this.tempContainer.querySelector(`.${styles['video-play']} i`)
    const videoFull = this.tempContainer.querySelector(`.${styles['video-full']} i`)
    const videoTimes = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`)
    const videoProgress = this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`)
    const videoVolProgress = this.tempContainer.querySelectorAll(`.${styles['video-volprogress']} div`)
    let timer

    videoContent.volume = 0.5

    // 个位补零操作
    function setZero(num: number): string {
      if (num < 10) {
        return '0' + num
      } else {
        return `${num}`
      }
    }

    // 格式化时间
    function formatTime(second: number): string {
      const num = Math.round(second)
      const min = Math.floor(num / 60)
      const sec = num % 60
      return `${setZero(min)}:${setZero(sec)}`
    }

    // 视频是否加载完毕
    videoContent.addEventListener('canplay', () => {
      videoTimes[1].innerHTML = formatTime(videoContent.duration)
    })

    // 播放中：播放进度变化
    function playing() {
      const scale = videoContent.currentTime / videoContent.duration
      const scaleSuc = videoContent.buffered.end(0) / videoContent.duration
      videoTimes[0].innerHTML = formatTime(videoContent.currentTime)
      videoProgress[0].style.width = scale * 100 + '%'
      videoProgress[1].style.width = scaleSuc * 100 + '%'
      videoProgress[2].style.left = scale * 100 + '%'
    }

    // 视频播放事件
    videoContent.addEventListener('play', () => {
      videoPlay.className = 'iconfont iconzantingtingzhi'
      timer = setInterval(playing, 1000)
    })

    // 视频暂停事件
    videoContent.addEventListener('pause', () => {
      videoPlay.className = 'iconfont iconbofang_huaban1'
      clearInterval(timer)
    })

    // 点击播放按钮
    videoPlay.addEventListener('click', () => {
      if (videoContent.paused) {
        videoContent.play().then(() => {})
      } else {
        videoContent.pause()
      }
    })

    // 全屏
    videoFull.addEventListener('click', () => {
      videoContent.requestFullscreen().then(() => {})
    })

    // 拖拽进度条
    videoProgress[2].addEventListener('mousedown', function (event: MouseEvent) {
      const downX = event.pageX
      const downL = this.offsetLeft
      document.onmousemove = (ev: MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth
        if (scale < 0) {
          scale = 0
        } else if (scale > 1) {
          scale = 1
        }
        videoProgress[0].style.width = scale * 100 + '%'
        videoProgress[1].style.width = scale * 100 + '%'
        this.style.left = scale * 100 + '%'
        videoContent.currentTime = scale * videoContent.duration
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      event.preventDefault()
    })

    // 拖拽音量
    videoVolProgress[1].addEventListener('mousedown', function (event: MouseEvent) {
      const downX = event.pageX
      const downL = this.offsetLeft
      document.onmousemove = (ev: MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth
        if (scale < 0) {
          scale = 0
        } else if (scale > 1) {
          scale = 1
        }
        videoVolProgress[0].style.width = scale * 100 + '%'
        this.style.left = scale * 100 + '%'
        videoContent.volume = scale
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      event.preventDefault()
    })
  }
}

export default video
