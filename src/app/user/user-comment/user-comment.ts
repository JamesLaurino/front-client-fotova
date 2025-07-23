import {Component, input, InputSignal} from '@angular/core';
import {ClientComment} from '../../model/client/client-comment';
import {DatePipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-user-comment',
  imports: [
    DatePipe
  ],
  templateUrl: './user-comment.html',
  styleUrl: './user-comment.css'
})
export class UserComment {
  userCommentsInput:InputSignal<ClientComment[] | undefined> = input.required<ClientComment[] | undefined>();
}
