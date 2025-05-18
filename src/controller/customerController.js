import { Customer } from "../model/customer.js";

class Controller {

    findAllOnJson(){

        return Customer.findAll();

    }

}

const CustomerController = new Controller();

export {CustomerController}