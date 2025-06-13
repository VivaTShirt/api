import { Address } from "../model/address.js";
import dotenv from 'dotenv'
dotenv.config();

class Controller {

    async findAll(){
        
        return await Address.findAll();

    }

    async find(requestedId){
        
        return await Address.findOne({ where: { id: requestedId } });

    }

    async register(address, addressNumber, neighborhood, city, state){

        data = await Address.create({
            address: address,
            address_number: addressNumber,
            neighborhood: neighborhood,
            city: city,
            state: state
        });

        return await data;
    }

    async update(requestedId, address, addressNumber, neighborhood, city, state) {

        const foundedAddress = await Address.findOne({where: {id:requestedId}});

        if (foundedAddress == null) {
            return {
                error: "Endereço não encontrado."
            }
        }

        foundedAddress.update({
            address: address,
            address_number: addressNumber,
            neighborhood: neighborhood,
            city: city,
            state: state
        })

        foundedAddress.save();

        return await foundedAddress.toJSON();
    }

    async delete(requestedId){

        const foundedAddress = await Address.findOne({where: {id:requestedId}});

        if (foundedAddress == null) {
            return {
                error: "Endereço não encontrado."
            }
        }

        foundedAddress.destroy();

        return {
            message: "Endereço deletado com sucesso."
        }

    }

}

const AddressController = new Controller();

export {AddressController}