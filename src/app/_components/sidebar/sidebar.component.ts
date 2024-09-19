import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
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
  lucideCircleUserRound,
  lucideList,
  lucideImage,
  lucideLogOut,
  lucideUser,
} from '@ng-icons/lucide';
import { TeamService } from '../../_services/team.service';
import { ProfileService } from '../../_services/profile.service';
import { truncateText } from '../../_utils/textUtils';

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
      lucideCircleUserRound,
      lucideList,
      lucideImage,
      lucideLogOut,
      lucideUser,
    }),
  ],
})
export class SidebarComponent implements OnInit {
  constructor(
    public router: Router,
    public accountService: AccountService,
    private profileService: ProfileService,
    private projectsService: ProjectsService,
    private messageService: MessageService,
    public projectService: ProjectService,
    private teamService: TeamService
  ) {}

  activeRoute: WritableSignal<string> = signal('');
  requestsCount: Signal<number> = computed(() => {
    return this.projectsService.projectRequests().length;
  });
  unreadMessagesCount: WritableSignal<number> = signal(0);
  sidebarItems: Signal<SidebarItem[]> = computed(() => {
    const currentUser = this.accountService.currentUser();
    const currentProject = this.projectService.selectedProject();
    if (!currentUser) return [];

    if (currentUser.role === Role.ADMIN) {
      return [
        {
          title: 'All Users',
          link: '/admin/users',
          icon: 'lucideUser',
          keyword: 'admin/users',
        },
        {
          title: 'Add Developers',
          link: '/admin/create/developers',
          icon: 'lucideUser',
          keyword: 'admin/create/developers',
        },
        {
          title: 'Add Project Managers',
          link: '/admin/create/project-managers',
          icon: 'lucideUser',
          keyword: 'admin/create/project-managers',
        },
        {
          title: 'Add Product Managers',
          link: '/admin/create/product-managers',
          icon: 'lucideUser',
          keyword: 'admin/create/product-managers',
        },
        {
          title: 'Messages',
          link: '/messages',
          icon: 'lucideMessageSquareMore',
          keyword: 'messages',
        },
      ];
    }

    if (currentUser.role === Role.SOFTWARE_COMPANY) {
      return [
        {
          title: 'Your Projects',
          link: `/projects`,
          icon: 'lucideSquareKanban',
          keyword: 'projects',
        },
        {
          title: 'Projects needing action',
          link: `/client/project/action-needed`,
          icon: 'lucideSquareKanban',
          keyword: 'action-needed',
        },
        {
          title: 'Messages',
          link: '/messages',
          icon: 'lucideMessageSquareMore',
          keyword: 'messages',
        },
        {
          title: 'Images',
          link: `/images/${currentUser.id}`,
          icon: 'lucideImage',
          keyword: 'images',
        },
      ];
    }

    if (currentUser.role === Role.PROJECT_MANAGER) {
      return [
        {
          title: currentProject
            ? truncateText(`${currentProject.name} Board`, 20)
            : 'Current Project Board',
          link: currentProject ? `/projects/${currentProject.id}` : '',
          icon: 'lucideSquareKanban',
          keyword: 'projects',
        },
        {
          title: 'Requirements',
          link: '/requirements',
          icon: 'lucideList',
          keyword: 'requirements',
        },
        {
          title: 'Manage team',
          link: `/teams/${
            this.profileService.currentProjectManager()?.currentTeamId
          }`,
          icon: 'lucideCircleUserRound',
          keyword: 'team',
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
          link: `projects/manager/history/${currentUser.id}`,
          icon: 'lucideHistory',
          keyword: 'history',
        },
        {
          title: 'Unrated Requirements',
          link: '/requirements/unrated',
          icon: 'lucideList',
          keyword: 'requirements/unrated',
        },
        {
          title: 'Images',
          link: `/images/${currentUser.id}`,
          icon: 'lucideImage',
          keyword: 'images',
        },
      ].filter(
        (item) =>
          !(
            ['projects', 'team', 'requirements'].includes(item.keyword) &&
            !currentProject
          )
      );
    }

    if (currentUser.role === Role.PRODUCT_MANAGER) {
      return [
        {
          title: 'All Active Projects',
          link: `/company/projects`,
          icon: 'lucideSquareKanban',
          keyword: 'company/projects',
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
        {
          title: 'Requirements',
          link: '/requirements',
          icon: 'lucideList',
          keyword: 'requirements',
        },
        {
          title: 'Project History',
          link: 'projects/history',
          icon: 'lucideHistory',
          keyword: 'history',
        },
        {
          title: 'Images',
          link: `/images/${currentUser.id}`,
          icon: 'lucideImage',
          keyword: 'images',
        },
      ];
    }

    if (currentUser.role === Role.DEVELOPER) {
      return [
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
          title: 'Images',
          link: `/images/${currentUser.id}`,
          icon: 'lucideImage',
          keyword: 'images',
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

  navigateToLink(link: string) {
    this.router.navigate([link]);
  }

  getUnreadMessagesCount() {
    this.messageService.getCountUnreadMessages().subscribe((count) => {
      this.unreadMessagesCount.set(count);
    });
  }
}
