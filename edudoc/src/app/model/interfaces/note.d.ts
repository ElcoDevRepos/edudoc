import { IEntity } from './base';


export interface INote extends IEntity {
    Title: string;
    NoteText: string;
}
