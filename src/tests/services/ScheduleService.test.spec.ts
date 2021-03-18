import 'mocha';
import { assert, expect } from 'chai';
import { deepEqual, instance, mock, verify, when } from "ts-mockito";

import { ImageService, ImageServiceInterface } from "../../services";
import { Image } from '../../models';
import 'dotenv';

const image1 = new Image();
image1.id = 'aaa-111-222';
image1.name = 'Image 1';

const image2 = new Image();
image2.id = 'bbb-111-222';
image2.name = 'Image 2';

const images = [image1, image2];

describe('ImageService Test', () => {
    let mockedImageService: ImageServiceInterface;
    let imageService: ImageServiceInterface;

    beforeEach(() => {
        mockedImageService = mock<ImageServiceInterface>();
        imageService = instance(mockedImageService);
    })

    describe('get All Images', () => {
        it('should return an array of images', async () => {
            callGetAll();

            const res = await imageService.getAll();

            expect(res).not.to.be.null;
            expect(res).to.be.an('array');
            expect(res.length).to.be.greaterThan(1);
        });
    })

    describe('find image by Id', () => {
        it('should return an image', async () => {
            callGet('bbb-111-222');

            const res = await imageService.getById('bbb-111-222');

            expect(res).not.to.be.null;
            expect(res.id).to.be.eql('bbb-111-222');
            expect(res).not.to.be.an('array');
        });
    })

    describe('Create Function', () => {
        it('should add a new Image', async function () {
            const imageObj = new Image();
            imageObj.name = 'Test Image 001';
            imageObj.title = 'Test Title 001';
            imageObj.size = '200x200';

            callCreate(imageObj);

            const res = await imageService.create(imageObj);

            expect(res).to.not.be.null;
            expect(res.name).to.be.eql('Test Image 001');
            expect(res).to.not.be.an('array');
        });
    })

    describe('Update Function', () => {
        it('should update the name and title of the Image', async function () {
            const imageObj = new Image();
            imageObj.id = 'aaa-111-222';
            imageObj.name = 'New Test Image 001';
            imageObj.title = 'New Test Title 001';
            imageObj.size = '200x200';

            callUpdate(imageObj);

            const res = await imageService.create(imageObj);

            expect(res).to.not.be.null;
            expect(res.name).to.be.eql('New Test Image 001');
            expect(res.title).to.be.eql('New Test Title 001');
            expect(res.id).to.be.eql('aaa-111-222');
            expect(res).to.not.be.an('array');
        });
    })

    describe('Delete an Image', () => {
        it('should return an array length less than that of the original images array', async () => {
            callDelete('aaa-111-222');

            const res = await imageService.delete('aaa-111-222');

            expect(res).to.be.true;
            expect(res).to.be.a('boolean');
        });
    })

    function callDelete(id: string) {
        when(mockedImageService.delete(id)).thenResolve(images.filter(o => o.id !== id).length < images.length);
    }

    function callGetAll() {
        when(mockedImageService.getAll()).thenResolve(images);
    }

    function callGet(id: string) {
        when(mockedImageService.getById(id)).thenResolve(images.find(o => o.id === id));
    }

    function callCreate(model: Image) {
        when(mockedImageService.create(model)).thenResolve(model);
    }

    function callUpdate(model: Image) {
        const existingImageIndex = images.findIndex(o => o.id === model.id);

        if (existingImageIndex >= 0) {
            const existingImage = images[existingImageIndex];

            existingImage.description = model.description;
            existingImage.name = model.name;
            existingImage.size = model.size;
            existingImage.title = model.title;

            when(mockedImageService.create(model)).thenResolve(existingImage);
        } else {
            when(mockedImageService.create(model)).thenReject(new Error('Image does not exist'));
        }
    }

})