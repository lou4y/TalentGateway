import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from './dashboard.model';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { EventService } from '../../../core/services/event.service';
import { ConfigService } from '../../../core/services/config.service';
import {AdditionalUserData} from "../../../core/models/additional-user-data.model";
import {Kuser} from "../../../core/models/auth.models";
import {AdditionalUserDataService} from "../../../core/services/additional-user-data.service";
import {ProfileVerificationService} from "../../../core/services/profile-verification.service";
import {UsersService} from "../../../core/services/users.service";
import {RolesService} from "../../../core/services/roles.service";
import {forkJoin} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  modalRef?: BsModalRef;
  isVisible: string;
  genderCounts: { male: number; female: number };
  userCountsByRole: { student: number; company: number; teacher: number };
  usersByMonthsAndDays: Map<string, number>;
  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions: any;
  statData: any;
  config: any = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  kusers: Kuser[] = [];
  additioanlUserData: AdditionalUserData[] = [];
  isActive: string;
  salesAnalyticsDonutChart: ChartType ;
  sassEarning: any;
  sassTopSelling:any;
  protected earningLineChart: any;
  @ViewChild('content') content;
  @ViewChild('center', {static: false}) center?: ModalDirective;
  months: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  constructor(private roleservice: RolesService, private userservice: UsersService, private dataservice: AdditionalUserDataService, private userverif: ProfileVerificationService, private configService: ConfigService, private eventService: EventService) {
  }

  async ngOnInit() {

    /**
     * horizontal-vertical layput set
     */
    const attribute = document.body.getAttribute('data-layout');
    this.kusers = await this.userservice.Getallusers().toPromise();
    this.additioanlUserData = await this.dataservice.getAllAdditionalUserData().toPromise();
    this.isVisible = attribute;
    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
      }
    }


    /**
     * Fetches the data
     */
    this.fetchData();
    this.usersByMonthsAndDays = this.getUsersByMonthsAndDays(this.kusers);
    this.genderCounts = this.getGenderCounts(this.additioanlUserData);
    this.userCountsByRole = await this.getUsersByRole(this.kusers);
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, index) => index); // Array representing months 0 to 11
    const monthlyUserCounts = months.map(monthIndex => {
      const monthKey = `${monthIndex + 1}-${currentYear}`; // Construct month key in 'MM-YYYY' format
      const matchingData = Array.from(this.usersByMonthsAndDays.entries())
        .filter(([key, value]) => {
          const [month, day] = key.split('-'); // Splitting the month-day combination
          return parseInt(month) === monthIndex + 1; // Check if the month matches
        });
      return matchingData.length > 0 ? matchingData.reduce((acc, [, value]) => acc + value, 0) : 0;
    });

    // Update the emailSentBarChart series with user counts for every month
    this.emailSentBarChart.series = [{
      name: 'New Users',
      data: monthlyUserCounts
    }];

    // Update chart options (if needed)

    this.salesAnalyticsDonutChart = {
      series: [this.userCountsByRole.student, this.userCountsByRole.company, this.userCountsByRole.teacher],
      chart: {
        type: 'donut',
        height: 240,
      },
      labels: ['student', 'companies', 'teachers'],
      colors: ['#556ee6', '#34c38f', '#f46a6a'],
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          }
        }
      }
    };

  }


  /**
   * Fetches the data
   */
  private fetchData() {
    this.earningLineChart = {
      series: [{
        name: 'series1',
        data: [31, 40, 36, 51, 49, 72, 69, 56, 68, 82, 68, 76]
      }],
      chart: {
        height: 330,
        type: 'line',
        toolbar: 'false',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 8,
          opacity: 0.2
        },
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#556ee6'],
      stroke: {
        curve: 'smooth',
        width: 4,
      },
    };
    this.emailSentBarChart = {
      chart: {
        height: 340,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '15%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: 'user',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      colors: ['#556ee6', '#f1b44c', '#34c38f'],
      legend: {
        position: 'bottom',
      },
      fill: {
        opacity: 1
      },
    };
    this.monthlyEarningChart = monthlyEarningChart;
    this.isActive = 'year';
    this.configService.getConfig().subscribe(data => {
      this.transactions = data.transactions;
      this.statData = data.statData;
    });

  }

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }


  getUsersByMonthsAndDays(users: Kuser[]): Map<string, number> {
    const usersByMonthAndDay = new Map<string, number>();
    users.forEach(user => {
      const createdDate = new Date(user.createdDate);
      const monthAndDay = `${createdDate.getMonth() + 1}-${createdDate.getDate()}`;
      if (usersByMonthAndDay.has(monthAndDay)) {
        usersByMonthAndDay.set(monthAndDay, usersByMonthAndDay.get(monthAndDay) + 1);
      } else {
        usersByMonthAndDay.set(monthAndDay, 1);
      }
    });
    return usersByMonthAndDay;
  }

  getGenderCounts(users: AdditionalUserData[]): { male: number; female: number } {
    let male = 0;
    let female = 0;
    users.forEach(user => {
      if (user.gender.toLowerCase() === 'male') {
        male++;
      } else if (user.gender.toLowerCase() === 'female') {
        female++;
      }
    });
    return {male, female};
  }

  getTopStates(users: AdditionalUserData[], stateList: string[], topCount: number): string[] {
    const stateCounts = new Map<string, number>();
    users.forEach(userData => {
      if (stateList.includes(userData.state)) {
        stateCounts.set(userData.state, (stateCounts.get(userData.state) || 0) + 1);
      }
    });
    const sortedStates = Array.from(stateCounts.entries()).sort((a, b) => b[1] - a[1]);
    return sortedStates.slice(0, topCount).map(state => state[0]);
  }

  getUsersByRole(users: Kuser[]): Promise<{ student: number; company: number; teacher: number }> {
    const counts = {student: 0, company: 0, teacher: 0};

    const observables = users.map(user => this.roleservice.getRoles(user.id).pipe(
      map(roles => ({user, roles}))
    ));

    return forkJoin(observables).toPromise().then(results => {
      results.forEach(({user, roles}) => {
          if (roles.includes('student')) {
            counts.student++;
          }
          if (roles.includes('company')) {
            counts.company++;
          }
          if (roles.includes('teacher')) {
            counts.teacher++;
          }

      });
      return counts;
    });
  }
  selectMonth(month: string) {
    const thisMonthData = this.getDataForMonth(month, this.usersByMonthsAndDays);
    const lastMonthData = this.getLastMonthData(month);

    const totalThisMonth = thisMonthData.reduce((total, count) => total + count, 0);
    const totalLastMonth = lastMonthData.reduce((total, count) => total + count, 0);

    const amount = totalThisMonth.toString(); // Total new users of the selected month
    const revenue = ((totalThisMonth - totalLastMonth) / totalLastMonth).toFixed(2); // Difference in new users compared to last month
    const previousamount = totalLastMonth.toString(); // Total number of users last month

    const sassEarning = [{
      name: "This month",
      amount: amount,
      revenue: revenue,
      time: "From previous month",
      month: "Last month",
      previousamount: previousamount,
      series: [
        {
          name: month.charAt(0).toUpperCase() + month.slice(1), // Capitalize month name
          data: thisMonthData,
        },
      ],
    }];

    this.sassEarning = sassEarning;
  }

  getLastMonthData(month: string): number[] {
    const lastMonth = this.getMonthNumber(month) - 1;
    let lastYear = new Date().getFullYear();
    if (lastMonth === 0) {
      lastYear--; // Adjust year for January (previous year)
    }

    const lastMonthName = this.getMonthName(lastMonth);
    const lastMonthData = this.getDataForMonth(lastMonthName, this.usersByMonthsAndDays);
    return lastMonthData;
  }

  getMonthName(month: number): string {
       return this.months[month - 1];
  }

  getDataForMonth(month: string, usersByMonthsAndDays: Map<string, number>): number[] {
    const monthNumber = this.getMonthNumber(month);

    const monthData = Array.from(usersByMonthsAndDays.entries())
      .filter(([key, _]) => key.startsWith(this.getMonthNumber(month) + '-')) // Filter entries for the specified month
      .map(([_, value]) => value); // Extract user counts

    const daysInMonth = new Date(new Date().getFullYear(), monthNumber, 0).getDate();
    const dataForMonth = new Array(daysInMonth).fill(0);

    monthData.forEach((userCount, index) => {
      dataForMonth[index] = userCount;
    });

    return dataForMonth;
  }

  getMonthNumber(month: string): number {
       return this.months.indexOf(month.toLowerCase()) + 1;
  }



}
