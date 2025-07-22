import {Component, input, InputSignal} from '@angular/core';
import {ClientComment} from '../../model/client/client-comment';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-user-comment',
  imports: [
    JsonPipe
  ],
  templateUrl: './user-comment.html',
  styleUrl: './user-comment.css'
})
export class UserComment {
  userCommentsInput:InputSignal<ClientComment[] | undefined> = input.required<ClientComment[] | undefined>();
}
