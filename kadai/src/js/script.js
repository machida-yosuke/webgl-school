import { BASE_DIR } from '../constants.yml'
import Kadai01 from  './lib/Kadai01'
import NewZero from './lib/NewZero'
const canvas = document.querySelector('#js-canvas');
const page = 'kadai01'

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
  default:

}
