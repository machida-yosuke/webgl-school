import { BASE_DIR } from '../constants.yml'
import Kadai01 from  './lib/Kadai01'
import NewZero from './lib/NewZero'
import Kadai02 from './lib/Kadai02'
import Kadai03 from './lib/Kadai03'
import Kadai04 from './lib/Kadai04'

const canvas = document.querySelector('#js-canvas');
const pureCanvas = document.querySelector('#js-pure-webgl');

const page = 'kadai04'

switch (page) {
  case 'kadai01':
    const kadai01 = new Kadai01({
      canvas
    })
    break;

  case 'newZero':
    const newzero = new NewZero({
      canvas
    })
    break;

  case 'kadai02':
    const kadai02 = new Kadai02({
      canvas
    })
    break;

  case 'kadai03':
    const kadai03 = new Kadai03({
      canvas
    })
    break;
  case 'kadai04':
    const kadai04 = new Kadai04({
      canvas: pureCanvas
    })
  break;

  default:

}
