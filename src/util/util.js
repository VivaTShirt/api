import path from "node:path";
import url from 'url';

class Util {

  static getTemplatePath(callerDir) {
    return path.dirname(url.fileURLToPath(callerDir));
  }

  static generateCode(len = 6) {
    const characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let code = "";
    for (let index = 0; index < len; index++) {
        code += characters[Math.floor(Math.random() * 10)];
    }

    return code;

  }

  static formatDate(date) {
    var today  = new Date(date);

    return today.toLocaleDateString("America/Sao_Paulo");
  }

}

export default Util;