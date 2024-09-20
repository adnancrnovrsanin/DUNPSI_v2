import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AccountService } from '../../_services/account.service';
import { DashboardService } from '../../_services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../_services/profile.service';
import {
  AllDeveloper,
  AllProject,
  CompanyDashboardData,
} from '../../_models/dashboard';
import { ProjectStatus } from '../../_models/softwareProject';
import { Developer, ProjectManager } from '../../_models/profiles';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { differenceInDays } from 'date-fns';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDashboardComponent implements OnInit {
  data: WritableSignal<CompanyDashboardData | null> = signal(null);

  constructor(
    public accountService: AccountService,
    public profileService: ProfileService,
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const manager = this.profileService.currentProductManager();
    if (manager) {
      this.dashboardService.getCompanyDashboardData().subscribe(
        (data) => {
          this.data.set(data);
        },
        (error) => {
          console.log(error);
          this.toastr.error('Failed to load company dashboard data');
        }
      );
    }
  }

  totalNumberOfClients = computed(() => {
    return this.data()?.allClients.length || 0;
  });

  totalNumberOfProjects = computed(() => {
    return this.data()?.allProjects.length || 0;
  });

  totalNumberOfActiveProjects = computed(() => {
    return (
      this.data()?.allProjects.filter(
        (p) =>
          p.status === ProjectStatus.ACTIVE ||
          p.status === ProjectStatus.WAITING_CLIENT_INPUT
      ).length || 0
    );
  });

  totalNumberOfCompletedProjects = computed(() => {
    return (
      this.data()?.allProjects.filter(
        (p) => p.status === ProjectStatus.COMPLETED
      ).length || 0
    );
  });

  allManagersSortedByNumberOfProjectsCompleted = computed(() => {
    return (
      this.data()?.allProjectManagers.sort((a, b) => {
        const aCompleted =
          this.data()?.allProjects.filter(
            (p) =>
              p.assignedTeam.projectManagerId === a.id &&
              p.status === ProjectStatus.COMPLETED
          ).length || 0;
        const bCompleted =
          this.data()?.allProjects.filter(
            (p) =>
              p.assignedTeam.projectManagerId === b.id &&
              p.status === ProjectStatus.COMPLETED
          ).length || 0;

        return bCompleted - aCompleted;
      }) ?? []
    );
  });

  numberOfProjectsCompletedByManager(manager: ProjectManager): number {
    return (
      this.data()?.allProjects.filter(
        (p) =>
          p.assignedTeam.projectManagerId === manager.id &&
          p.status === ProjectStatus.COMPLETED
      ).length || 0
    );
  }

  allDevelopersSortedByNumberOfRequirementsCompleted = computed(() => {
    return (
      this.data()?.allDevelopers.sort((a, b) => {
        const aCompleted = this.numberOfRequirementsCompletedByDeveloper(a);
        const bCompleted = this.numberOfRequirementsCompletedByDeveloper(b);

        return bCompleted - aCompleted;
      }) ?? []
    );
  });

  numberOfRequirementsCompletedByDeveloper(developer: AllDeveloper): number {
    return (
      this.data()
        ?.allProjects.flatMap((p) => p.phases)
        .filter((ph) => ph.name === 'Done')
        .flatMap((ph) => ph.requirements)
        .filter((r) => r.assignedDevelopers.some((d) => d.id === developer.id))
        .length || 0
    );
  }

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      // @ts-ignore
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
          return '';
        },
      },
      title: {
        display: true,
        text: 'Total Tasks by Assignee',
      },
    },
  };
  public pieChartData: Signal<ChartData<'pie', number[], string | string[]>> =
    computed(() => ({
      labels: this.data()?.allClients.map((c) => c.companyName) || [],
      datasets: [
        {
          data:
            this.data()?.allClients.map((c) => c.currentProjects.length) || [],
        },
      ],
    }));
  public pieChartType: ChartType = 'pie';

  // Bar chart
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      //@ts-ignore
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType = 'bar' as const;

  public barChartData: Signal<ChartData<'bar'>> = computed(() => ({
    labels:
      this.data()
        ?.allProjects.filter((p) => p.status !== ProjectStatus.COMPLETED)
        .map((m) => m.name) || [],
    datasets: [
      {
        data: this.data()
          ?.allProjects.filter((p) => p.status !== ProjectStatus.COMPLETED)
          .map(
            (m) =>
              m.phases
                .filter((ph) => ph.name !== 'Done')
                .flatMap((ph) => ph.requirements).length
          ) as (number | [number, number] | null)[],
        label: 'Requirements left',
      },
    ],
  }));
}
