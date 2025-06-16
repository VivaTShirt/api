import { Address } from "../model/address.js";
import dotenv from 'dotenv'
dotenv.config();

class Controller {

    async findAll(){
        
        return await Address.findAll();

    }

    async find(addressId){
        
        return await Address.findOne({ where: { id: addressId } });

    }

    async register(address, addressNumber, neighborhood, city, state, customerId){

        const data = await Address.create({
            address: address,
            address_number: addressNumber,
            neighborhood: neighborhood,
            city: city,
            state: state,
            customer_id: customerId
        });

        return data;
    }

    async update(addressId, address, addressNumber, neighborhood, city, state, customerId) {

        const foundedAddress = await Address.findOne({where: {id:addressId}});

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
            state: state,
            customer_id: customerId
        })

        foundedAddress.save();

        return await foundedAddress.toJSON();
    }

    async delete(addressId){

        const foundedAddress = await Address.findOne({where: {id:addressId}});

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

    //ativa um endereço do usuario
    async toggleActive(addressId, customerId, status) {
        
        const allCustomerAdresses = await Address.findAll({
            where:{
                customer_id: customerId
            }
        });

        for(const address of allCustomerAdresses){
            await address.update({ is_active: false });
        }

        const activeAddress = await Address.findOne({where: {
            id: addressId
        }});

        if (activeAddress) {
            await activeAddress.update({ is_active: status });
        }

        return {"message": "Novo endereço foi definido."}

    }


}

const AddressController = new Controller();

export {AddressController}