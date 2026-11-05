
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
  deletingUserId: string | null = null;

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
  editUser(id: string): void {
  this.router.navigate(['/edit-user', id]);
  }

  deleteUser(id: string): void {

    const confirmed = window.confirm(
      'Are you sure you want to delete this policyholder?'
    );

    if (!confirmed) {
      return;
    }

    this.deletingUserId = id;
    this.cdr.markForCheck();

    this.userService.deleteUser(id).subscribe({

      next: (response) => {

        window.alert(response.message);

        this.deletingUserId = null;

        this.loadUsers();

        this.cdr.markForCheck();
      },

      error: (error) => {

        window.alert(
          error.error?.message || 'Unable to delete policyholder'
        );

        this.deletingUserId = null;

        this.cdr.markForCheck();
      }

    });
  }

}
