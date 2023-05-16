const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, './.env') });
const { MongoClient, ServerApiVersion } = require('mongodb');


class Mong {
    #userName;
    #password;
    #dANDc;
    #uri;
    #client;

    constructor() {
        this.#userName = process.env.MONGO_DB_USERNAME;
        this.#password = process.env.MONGO_DB_PASSWORD;
        this.#dANDc = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};

        this.#uri = "mongodb+srv://"+this.#userName+":"+this.#password+"@cluster0.u3wa3bt.mongodb.net/?retryWrites=true&w=majority";
        this.#client = new MongoClient(this.#uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    }

    async insertApp(name, email, pn, addy, a, m, r, s, comments) {
        try {
            await this.#client.connect();
            let app = {name: name, email: email, phoneNumber: pn, address: addy, appetizers: a, meals: m, drinks: r, deserts: s, comments: comments};
            const result = await this.#client.db(this.#dANDc.db).collection(this.#dANDc.collection).insertOne(app);
        } catch (e) {
            console.error(e);
        } finally {
            await this.#client.close();
        }
    }

    async findOne(gname) {
        try {
            await this.#client.connect();

            let filter = {name: gname};
            const result = await this.#client.db(this.#dANDc.db).collection(this.#dANDc.collection).findOne(filter);
            if (result) {
                return result;
            } else {
                return "None";
            }

        } catch (e) {
            console.error(e);
        } finally {
            await this.#client.close();
        }
        return "None";
    }

}
module.exports = Mong;