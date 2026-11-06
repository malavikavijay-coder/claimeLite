import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import { User, UserService } from './user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserListComponent implements OnInit {

  @Output() addUserClicked = new EventEmitter<void>();

  users: User[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.userService.getUsers().subscribe({

      next: (users) => {
        this.users = users;
        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Unable to load users', error);
        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }

  addUser(): void {
    this.router.navigate(['/add-user']);
  }

}