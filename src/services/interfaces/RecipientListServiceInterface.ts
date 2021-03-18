import { RecipientList, RecipientListItem } from "../../models";
import { AbstractInterface } from "./common/AbstractInterface";

export interface RecipientListServiceInterface
  extends AbstractInterface<RecipientList> {
  getRecipientList(id: string): RecipientListItem[];
}
