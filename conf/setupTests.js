// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.getSelection = () => ({
  removeAllRanges: () => {},
});

window.addEventListener = () => null;
window.removeEventListener = () => null;
window.URL.createObjectURL = () => null;

window.focus = () => null;
global.chrome = null;
configure({ adapter: new Adapter() });

class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
}

window.Worker = Worker;
