interface Ipopup {
  width: string;
  height: string;
  title: string;
  pos: string;
  mask: boolean;
  content: () => void;
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
  tempContainer;
  constructor(private readonly props: Partial<Ipopup>) {
    this.props = Object.assign({
      width: '100%',
      height: '100%',
      title: '',
      pos: 'center',
      mask: true,
      content: function (){},
    }, this.props)
    this.init()
  }

  // 初始化
  init() {
    this.template()
  }

  // 创建模板
  template() {
    this.tempContainer = document.createElement('div')
    this.tempContainer.innerHTML = `
      <h1>Hello</h1>
    `
    document.body.appendChild(this.tempContainer)
  }

  // 事件操作
  handle() {

  }
}

export default popup
