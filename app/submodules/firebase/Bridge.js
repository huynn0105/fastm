import AbstractUtil from './AbstractUtil';
import NativeUtil, { firebase } from './NativeUtil.js';

const native = new AbstractUtil(new NativeUtil());
export default native;

export { firebase };
