const EventEmitter = require('events');
const mongoose = require('mongoose');
const { docker } = require('../config/docker');

class HealthMonitor extends EventEmitter {
    constructor() {
        super();
        this.services = { docker: true, database: true, websocket: true };
        this.isHealthy = true;
        this.failures = { docker: 0, database: 0, websocket: 0 };
        this.THRESHOLD = 2;
    }

    async checkServices() {
        let dockerOk = true;
        let dbOk = mongoose.connection.readyState === 1;
        let wsOk = true;

        try {
            await docker.ping();
            this.failures.docker = 0;
        } catch {
            this.failures.docker++;
            if (this.failures.docker >= this.THRESHOLD) dockerOk = false;
        }

        if (!dbOk) this.failures.database++;
        else this.failures.database = 0;

        try {
            const {getIO} = require('../config/socket')
            const io = getIO();
            wsOk = !!io && !!io.engine;
        } catch {
            wsOk = false;
        }

        this.services = { docker: dockerOk, database: dbOk, websocket: wsOk };
        
        const currentHealthyState = dockerOk && dbOk && wsOk;

        if (this.isHealthy !== currentHealthyState) {
            this.isHealthy = currentHealthyState;
            const failedList = Object.keys(this.services).filter(name => !this.services[name]);
            
            this.emit('status_changed', { 
                isHealthy: this.isHealthy, 
                services: this.services,
                failedList 
            });
        }
    }

    startMonitoring(intervalMs = 7000) {
        setInterval(() => this.checkServices(), intervalMs);
    }
}

module.exports = new HealthMonitor();