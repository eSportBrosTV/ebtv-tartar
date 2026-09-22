const ProviderService = require('../Core/ProviderService');
const { getIO } = require('../../config/socket');
const ErrorCodes = require('../../utils/errors/ErrorCodes');

class SocketProvider extends ProviderService {
    constructor() {
        super('Socket');
    }

    async emitStopAndWait(botId, force = false) {
        let botRep = null;
        try {
            const rep = await getIO()
                .of("/bots")
                .timeout(5000)
                .to(botId.toString())
                .emitWithAck("stop");

            botRep = rep[0];
        } catch (err) {
            this._logInfo(`Le bot ${botId} n'a pas repondu au socket`);
            if (!force) this.throwError("Le bot ne repond pas", ErrorCodes.PROVIDER_TIMEOUT);
        }

        if (botRep && !botRep.success && !force) {
            this._throwError("Le bot n'a pas reussi à s'arreter", ErrorCodes.BOT_STOP_FAILED);
        }
    }

    emitToBot(botId, event, payload) {
        getIO()
            .of("/bots")
            .to(botId.toString())
            .emit(event, payload);
    }

    emitToBots(event) {
        getIO()
            .of("/bots")
            .emit(event)
    }

    async disconnectSession(sessionId) {
        try {
            const sessionSockets = await getIO().of('/panel').in(sessionId).fetchSockets()

            for (const socket of sessionSockets) {
                socket.disconnect(true)
            }
        } catch (err) {
            this._logError(err)
        }
    }

    async disconnectUser(userId) {
        try {
            const userSockets = await getIO().of('/panel').in(userId.toString()).fetchSockets()

            for (const socket of userSockets) {
                socket.disconnect(true)
            }
        } catch (err) {
            this._logError(err)
        }
    }
}
module.exports = SocketProvider;