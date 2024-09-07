import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
} from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ProjectsService } from '../../_services/projects.service';
import { MessageService } from '../../_services/message.service';
import { ProjectService } from '../../_services/project.service';
import { Role } from '../../_models/user';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucidePieChart,
  lucideSquareKanban,
  lucideMessageSquareMore,
  lucideFileQuestion,
  lucideHistory,
} from '@ng-icons/lucide';

interface SidebarItem {
  title: string;
  link: string;
  icon: string;
  keyword: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  viewProviders: [
    provideIcons({
      lucidePieChart,
      lucideSquareKanban,
      lucideMessageSquareMore,
      lucideFileQuestion,
      lucideHistory,
    }),
  ],
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private projectsService: ProjectsService,
    private messageService: MessageService,
    public projectService: ProjectService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveRoute();
      }
    });
    this.setActiveRoute();
  }

  activeRoute: WritableSignal<string> = signal('');
  requestsCount: Signal<number> = computed(() => {
    return this.projectsService.projectRequests().length;
  });
  unreadMessagesCount: WritableSignal<number> = signal(0);
  sidebarItems: Signal<SidebarItem[]> = computed(() => {
    const currentUser = this.accountService.currentUser();
    const currentProject = this.projectService.selectedProject();
    if (!currentUser) return [];

    if (currentUser.role === Role.SOFTWARE_COMPANY) {
      return [
        {
          title: 'Dashboard',
          link: `/dashboard/${currentUser.id}`,
          icon: 'lucidePieChart',
          keyword: 'dashboard',
        },
        {
          title: 'Your Projects',
          link: `/projects`,
          icon: 'lucideSquareKanban',
          keyword: 'projects',
        },
        {
          title: 'Messages',
          link: '/messages',
          icon: 'lucideMessageSquareMore',
          keyword: 'messages',
        },
      ];
    }

    if (currentUser.role === Role.PROJECT_MANAGER) {
      return [
        {
          title: 'Dashboard',
          link: `/dashboard/${currentUser.id}`,
          icon: 'lucidePieChart',
          keyword: 'dashboard',
        },
        {
          title: 'Current Project',
          link: currentProject ? `/projects/${currentProject.id}` : '',
          icon: 'lucideSquareKanban',
          keyword: 'projects',
        },
        {
          title: 'Messages',
          link: '/messages',
          icon: 'lucideMessageSquareMore',
          keyword: 'messages',
        },
        {
          title: 'Project Requests',
          link: '/projects/manager/requests',
          icon: 'lucideFileQuestion',
          keyword: 'requests',
        },
        {
          title: 'Project History',
          link: '/projects/manager/history',
          icon: 'lucideHistory',
          keyword: 'history',
        },
      ];
    }

    if (currentUser.role === Role.PRODUCT_MANAGER) {
      return [
        {
          title: 'Dashboard',
          link: `/dashboard/${currentUser.id}`,
          icon: 'lucidePieChart',
          keyword: 'dashboard',
        },
        {
          title: 'Project Requests',
          link: '/projects/requests',
          icon: 'lucideFileQuestion',
          keyword: 'requests',
        },
        {
          title: 'Messages',
          link: '/messages',
          icon: 'lucideMessageSquareMore',
          keyword: 'messages',
        },
      ];
    }

    if (currentUser.role === Role.DEVELOPER) {
      return [
        {
          title: 'Dashboard',
          link: `/dashboard/${currentUser.id}`,
          icon: 'lucidePieChart',
          keyword: 'dashboard',
        },
        {
          title: 'Current Project',
          link: currentProject ? `/projects/${currentProject.id}` : '',
          icon: 'lucideSquareKanban',
          keyword: 'projects',
        },
        {
          title: 'Messages',
          link: '/messages',
          icon: 'lucideMessageSquareMore',
          keyword: 'messages',
        },
      ];
    }

    return [];
  });

  get currentUser() {
    return this.accountService.currentUser;
  }

  ngOnInit(): void {
    this.getUnreadMessagesCount();
  }

  goToDashboard() {
    this.router.navigate([
      `/dashboard/${this.accountService.currentUser()?.id}`,
    ]);
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }

  goToProjectRequests() {
    this.router.navigate(['/projects/requests']);
  }

  goToProjectManagerRequests() {
    this.router.navigate(['/projects/manager/requests']);
  }

  navigateToLink(link: string) {
    this.router.navigate([link]);
  }

  setActiveRoute() {
    const url = this.router.url;
    if (url.includes('dashboard')) this.activeRoute.set('dashboard');
    if (url.includes('messages')) this.activeRoute.set('messages');
    if (url.includes('projects/requests'))
      this.activeRoute.set('projects/requests');
  }

  getUnreadMessagesCount() {
    this.messageService.getCountUnreadMessages().subscribe((count) => {
      this.unreadMessagesCount.set(count);
    });
  }
}
