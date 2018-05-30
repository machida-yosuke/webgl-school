import { BASE_DIR } from '../constants.yml'
import Kadai01 from  './lib/Kadai01'
import NewZero from './lib/NewZero'
import Kadai02 from './lib/Kadai02'
const canvas = document.querySelector('#js-canvas');
const page = 'kadai02'

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

  default:

}
