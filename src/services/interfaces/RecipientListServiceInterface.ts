import { RecipientList, RecipientListItem } from "../../models";
import { AbstractInterface } from "./common/AbstractInterface";

export interface RecipientListServiceInterface
  extends AbstractInterface<RecipientList> {
  getRecipientList(id: string): RecipientListItem[];
  createAndSave(name: string, recipients: []): Promise<RecipientList>;
  getPaginatedRecipientsList(id: string): any;
}
