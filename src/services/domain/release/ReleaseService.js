const BaseDomainService = require("../../core/BaseDomainService");

class ReleaseService extends BaseDomainService {
    #docker
    #releaseDb

    /**
     * 
     * @param {import('../../core/DataService')} releaseData 
     * @param {import('../../providers/DockerProvider')} dockerProvider 
     */
    constructor(releaseData, dockerProvider){
        super('ReleaseService')
        this.#releaseDb = releaseData
        this.#docker = dockerProvider
    }

    async syncCatalog(){
        this._logInfo("Synchro du catalogue avec Docker Hub...")
        const hubTags = await this.#docker.fetchTagsFromHub()
        if(hubTags.length === 0) return this._logInfo("Synchro terminer aucun tag trouvé")

        let newReleasesCount = 0;

        for(const tag of hubTags){
            const exist = await this.#releaseDb.exist({version: tag.name})

            if(!exist){
                await this.#releaseDb.create({
                    version: tag.name,
                    releaseDate: tag.date
                })

                newReleasesCount++
            }
        }

        this._logInfo(`Synchro terminer ${newReleasesCount} versions ajouter`)
        return newReleasesCount
    }
}

module.exports = ReleaseService