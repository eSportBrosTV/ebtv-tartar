const DataService = require("../../core/DataService");
const ManagementDomainService = require("../../core/ManagementDomainService");
const SocketProvider = require("../../providers/SocketProvider");

class CommandManagementService extends ManagementDomainService {
    #socket
    /**
     * 
     * @param {DataService} commandData 
     * @param {SocketProvider} socketProvider 
     */
    constructor(commandData, socketProvider){
        super("Commands", commandData)
        this.#socket = socketProvider
    }

    async update(idOrDoc, payload){
        const updatedCommand = await super.update(idOrDoc, payload)

        this.#botEmission()

        return updatedCommand
    }

    async create(payload){
        const newCommand = await super.create(payload)

        this.#botEmission()

        return newCommand
    }

    async delete(idOrDoc){
        const deletedCommand = await super.delete(idOrDoc)

        this.#botEmission()

        return deletedCommand
    }

    #botEmission(){
        this.#socket.emitToBots("reload_config")
    }
}

module.exports = CommandManagementService