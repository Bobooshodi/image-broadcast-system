import "reflect-metadata";
import 'mocha';
import chaiHttp from 'chai-http';
import { request, use, expect } from 'chai';

use(chaiHttp);

describe('ImageController Test', () => {
    /*
  * Test the /GET route
  */
    describe('/GET images', () => {
        it('it should GET all the images', (done) => {
            request('localhost:3000')
                .get('/images')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).length.to.be.greaterThan(0);
                    done();
                });
        });
    });
})