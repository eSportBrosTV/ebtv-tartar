const DataService = require("../../core/DataService");
const ManagementDomainService = require("../../core/ManagementDomainService");
const SocketProvider = require("../../providers/SocketProvider");

class UserManagementService extends ManagementDomainService {
    #socket

    /**
     * 
     * @param {DataService} userData 
     * @param {SocketProvider} socketProvider 
     */
    constructor(userData, socketProvider){
        super('UserManagement', userData)
        this.#socket = socketProvider
    }

    async delete(userOrId){
        const deletedUser = await super.delete(userOrId)

        this.#socket.disconnectUser(deletedUser._id)
    }
}

module.exports = UserManagementService