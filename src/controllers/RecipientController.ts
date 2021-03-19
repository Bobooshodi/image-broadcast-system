import express from "express";
import { IExpressWithJson, JsonErrorResponse } from "express-with-json/dist";
import { validationResult } from "express-validator";

import container from "../service-container/inversify.config";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { RecipientListServiceInterface } from "../services";

var recipientService = container.get<RecipientListServiceInterface>(
  ServiceInterfaceTypes.ServiceTypes.recipientListService
);

export async function create(req: any) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new JsonErrorResponse({ errors: errors.array() });
    }

    const { name, recipients } = req.body;

    return await recipientService.createAndSave(name, recipients);
  } catch (error) {
    console.error(error);
    throw new JsonErrorResponse({ error: "some error occured" });
  }
}

export async function remove(req: express.Request) {
  const { id } = req.params;

  const res = await recipientService.delete(id);
  return { ok: res };
}

export async function get(req: express.Request) {
  const { id } = req.params;

  return await recipientService.getById(id);
}

export async function getAll(req: express.Request) {
  return await recipientService.getAllPaginated();
}

export async function getRecipientsList(req: express.Request) {
  const { id } = req.params;

  return await recipientService.getPaginatedRecipientsList(id);
}

export async function update(req: express.Request) {
  const { id } = req.params;

  const existingImage = await recipientService.getById(id);

  return await recipientService.update(existingImage);
}

export default (app: IExpressWithJson) => {
  app.postJson("/recipients", create);
  app.deleteJson("/recipients/:id", remove);
  app.getJson("/recipients", getAll);
  app.getJson("/recipients/:id", get);
  app.getJson("/recipients/:id/list", getRecipientsList);
};
