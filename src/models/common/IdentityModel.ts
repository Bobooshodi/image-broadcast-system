import { AutoMap } from "@nartc/automapper";

export class IdentityModel {
    @AutoMap() id: string;

    @AutoMap() dateCreated: Date;

    @AutoMap() dateUpdated: Date;
}