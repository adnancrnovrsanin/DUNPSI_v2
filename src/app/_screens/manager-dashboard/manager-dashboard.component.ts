import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { ProfileService } from '../../_services/profile.service';
import { ProjectDashboardDto } from '../../_models/dashboard';
import { DashboardService } from '../../_services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { RequirementType } from '../../_models/requirement';
import { format, subDays } from 'date-fns';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent implements OnInit {
  projectData: WritableSignal<ProjectDashboardDto | null> = signal(null);

  constructor(
    public accountService: AccountService,
    public profileService: ProfileService,
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const manager = this.profileService.currentProjectManager();
    if (manager) {
      this.dashboardService.getManagerDashboardData(manager.id).subscribe({
        next: (data) => {
          this.projectData.set(data);
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
    }
  }

  get allActiveTasksCount(): number {
    return (
      this.projectData()
        ?.phases.filter(
          (phase) =>
            !['Requirement Analysis', 'To Do', 'Done'].includes(phase.name)
        )
        ?.flatMap((phase) => phase.requirements).length || 0
    );
  }

  get allUnassignedTasksCount(): number {
    return (
      this.projectData()
        ?.phases.flatMap((phase) => phase.requirements)
        .filter((r) => r.assignedDevelopers.length === 0).length || 0
    );
  }

  get allCompletedTasksCount(): number {
    return (
      this.projectData()
        ?.phases.filter((phase) => phase.name === 'Done')
        .flatMap((phase) => phase.requirements).length || 0
    );
  }

  get allBugsCount(): number {
    return (
      this.projectData()
        ?.phases.flatMap((phase) => phase.requirements)
        .filter((r) => r.type === RequirementType.BUG).length || 0
    );
  }

  // Pie chart
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
      labels:
        this.projectData()?.assignedTeam.developers.map(
          (d) => d.name + ' ' + d.surname
        ) || [],
      datasets: [
        {
          data:
            this.projectData()?.assignedTeam.developers.map(
              (dev) =>
                this.projectData()
                  ?.phases.flatMap((phase) => phase.requirements)
                  .filter((r) =>
                    r.assignedDevelopers.some((d) => d.id === dev.id)
                  ).length || 0
            ) || [],
        },
      ],
    }));
  public pieChartType: ChartType = 'pie';

  // Bar chart
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
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
      // @ts-ignore
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType = 'bar' as const;

  public barChartData: Signal<ChartData<'bar'>> = computed(() => ({
    labels:
      this.projectData()?.assignedTeam.developers.map(
        (d) => d.name + ' ' + d.surname
      ) || [],
    datasets: [
      {
        data:
          this.projectData()?.assignedTeam.developers.map(
            (dev) => dev.numberOfActiveTasks
          ) || [],
        label: 'Open Tasks by Assignee',
      },
    ],
  }));

  // Line chart

  public lineChartData: Signal<ChartConfiguration['data']> = computed(() => ({
    datasets: [
      RequirementType.BUG,
      RequirementType.USER_STORY,
      RequirementType.TASK,
    ].map((type) => {
      const dataMap = this.projectData()
        ?.phases.flatMap((phase) =>
          phase.requirements.filter((r) => r.type === type)
        )
        .reduce((acc, requirement) => {
          const date = format(new Date(requirement.createdAt), 'yyyy-MM-dd');
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date]++;
          return acc;
        }, {} as Record<string, number>);

      const labels = Array.from({ length: 10 }, (_, i) =>
        format(subDays(new Date(), i), 'yyyy-MM-dd')
      ).reverse();

      const data = labels.map((label) => (dataMap ? dataMap[label] || 0 : 0));

      return {
        data,
        label: type,
      };
    }),
    labels: Array.from({ length: 10 }, (_, i) =>
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    ).reverse(),
  }));

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
    },

    plugins: {
      legend: { display: true },
      // @ts-ignore
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'x',
            value: 'March',
            borderWidth: 2,
            label: {
              display: true,
              position: 'center',
            },
          },
        ],
      },
    },
  };

  public lineChartType: ChartType = 'line';
}
