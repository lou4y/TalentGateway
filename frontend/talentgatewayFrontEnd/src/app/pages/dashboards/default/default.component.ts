import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartType } from './dashboard.model';
import {BsModalRef, ModalDirective} from 'ngx-bootstrap/modal';
import { EventService } from '../../../core/services/event.service';
import { ConfigService } from '../../../core/services/config.service';
import { AdditionalUserData } from "../../../core/models/additional-user-data.model";
import { Kuser } from "../../../core/models/auth.models";
import { AdditionalUserDataService } from "../../../core/services/additional-user-data.service";
import { ProfileVerificationService } from "../../../core/services/profile-verification.service";
import { UsersService } from "../../../core/services/users.service";
import { RolesService } from "../../../core/services/roles.service";
import {forkJoin, Observable} from "rxjs";
import { map } from "rxjs/operators";
import {UserVerif} from "../../../core/models/UserVerificationData.model";
import Swal from "sweetalert2";

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
  usersByMonthsAndDays: Map<number, Map<number, number>>;
  newuserchartbymonth: ChartType = {
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
  transactions: any;
  statData: any;
  config: any = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  kusers: Kuser[] = [];
  topStates: { name: string, count: number, percentage: number }[];
  additionalUserData: AdditionalUserData[] = [];
  isActive: string;
  usersTypesDonutChart: ChartType ;
  sassEarning: any;
  sassTopSelling:any;
  protected earningLineChart: any;

  total: Observable<number>;





  @ViewChild('content') content;
  @ViewChild('center', {static: false}) center?: ModalDirective;
  months: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  constructor(private roleservice: RolesService, private userservice: UsersService, private dataservice: AdditionalUserDataService, private userverif: ProfileVerificationService, private configService: ConfigService, private eventService: EventService) {
  }

  async ngOnInit() {
    const attribute = document.body.getAttribute('data-layout');
    this.kusers = await this.userservice.Getallusers().toPromise();
    this.additionalUserData = await this.dataservice.getAllAdditionalUserData().toPromise();
    this.topStates = await this.fetchTopStatesParticipation();
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
    this.usersByMonthsAndDays = this.getUsersByMonthsAndDaysMap(this.kusers);
    this.genderCounts = this.getGenderCounts(this.additionalUserData);
    this.userCountsByRole = await this.getUsersByRole(this.kusers);
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, index) => index); // Array representing months 0 to 11
    const monthlyUserCounts = months.map(monthIndex => {
      const monthKey = monthIndex + 1; // Construct month key in 'MM' format
      const matchingData = Array.from(this.getUsersByMonthsAndDays(this.kusers).entries())
        .filter(([key, value]) => {
          const month = parseInt(String(key)); // Convert the key to number
          return month === monthKey; // Check if the month matches
        });
      return matchingData.length > 0 ? matchingData.reduce((acc, [, value]) => acc + value, 0) : 0;
    });

    // Update the emailSentBarChart series with user counts for every month
    this.newuserchartbymonth.series = [{
      name: 'New Users',
      data: monthlyUserCounts
    }];
    this.usersTypesDonutChart = {
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
    this.selectMonth('january');
  }

  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }


  getUsersByMonthsAndDays(users: Kuser[]): Map<number, number> {
    const usersByMonthAndDay = new Map<number, number>();
    users.forEach(user => {
      const createdDate = new Date(user.createdDate);
      const monthAndDay = createdDate.getMonth() + 1;
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

  async fetchTopStatesParticipation(): Promise<{ name: string, count: number, percentage: number }[]> {
    const stateCounts = new Map<string, number>();

    // Count occurrences of each state
    this.additionalUserData.forEach(user => {
      const state = user.state;
      stateCounts.set(state, (stateCounts.get(state) || 0) + 1);
    });
    // Sort states by count
    const sortedStates = Array.from(stateCounts.entries()).sort((a, b) => b[1] - a[1]);

    // Calculate percentage and format data for display
    const totalUsers =  this.additionalUserData.length;
    return sortedStates.slice(0, 3).map(([state, count]) => ({
      name: state,
      count: count,
      percentage: (count / totalUsers) * 100
    }));
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

  getUsersByMonthsAndDaysMap(users: Kuser[]): Map<number, Map<number, number>> {
    const usersByMonthAndDay = new Map<number, Map<number, number>>();

    // Initialize map with all months
    for (let i = 0; i < 12; i++) {
      const monthIndex = i + 1;
      usersByMonthAndDay.set(monthIndex, new Map<number, number>());
    }

    // Fill map with user data
    users.forEach(user => {
      const createdDate = new Date(user.createdDate);
      const month = createdDate.getMonth() + 1;
      const day = createdDate.getDate();
      const userCount = usersByMonthAndDay.get(month).get(day) || 0;
      usersByMonthAndDay.get(month).set(day, userCount + 1);
    });

    return usersByMonthAndDay;
  }

  selectMonth(month: string) {
    if (!month) {
      // If month is undefined, set it to 'January' by default
      month = 'January';
    }
    const thisMonthData = this.getDataForMonth(this.getMonthNumber(month), this.usersByMonthsAndDays  );
    const lastMonthData = this.getLastMonthData(month);

    const totalThisMonth = thisMonthData.reduce((total, count) => total + count, 0);
    const totalLastMonth = lastMonthData.reduce((total, count) => total + count, 0);

    const amount = totalThisMonth.toString(); // Total new users of the selected month
    const revenue = ((totalThisMonth - totalLastMonth) / totalLastMonth).toFixed(2); // Difference in new users compared to last month
    const previousamount = totalLastMonth.toString(); // Total number of users last month

    this.sassEarning = [{
      name: "New users this month",
      amount: amount,
      revenue: revenue,
      time: "From previous month",
      month: "New users last month",
      previousamount: previousamount,
      series: [
        {
          name: month.charAt(0).toUpperCase() + month.slice(1), // Capitalize month name
          data: thisMonthData,
        },
      ],
    }];

    // Set earningLineChart as the chart for selectMonth
    this.earningLineChart = {
      series: [{
        name: month.charAt(0).toUpperCase() + month.slice(1), // Capitalize month name
        data: thisMonthData,
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
  }

  getLastMonthData(month: string): number[] {

    let lastMonth = this.getMonthNumber(month) - 1;
    if (lastMonth < 1) {
      lastMonth = 12; // Adjust month for January (previous month)
    }
    let lastYear = new Date().getFullYear();
    if (lastMonth === 0) {
      lastYear--; // Adjust year for January (previous year)
    }

    const lastMonthName = this.getMonthName(lastMonth);
    const lastMonthData = this.getDataForMonth(this.getMonthNumber(lastMonthName), this.usersByMonthsAndDays);
    return lastMonthData;
  }

  getMonthName(month: number): string {
    return this.months[month - 1];
  }

  getDataForMonth(month: number, usersByMonthsAndDays: Map<number, Map<number, number>>): number[] {
    const monthDataMap = usersByMonthsAndDays.get(month);
    if (!monthDataMap) return new Array(this.getDaysInMonth(month)).fill(0); // Return an array with 0s if no data for the month

    const daysInMonth = this.getDaysInMonth(month);
    const dataForMonth = new Array(daysInMonth).fill(0);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = monthDataMap.get(day) || 0;
      dataForMonth[day - 1] = dayData;
    }

    return dataForMonth;
  }

  getDaysInMonth(month: number): number {
    return new Date(new Date().getFullYear(), month, 0).getDate();
  }

  getMonthNumber(month: string): number {
    return this.months.indexOf(month.toLowerCase()) + 1;
  }
  removeUser(id: any) {
  }

  /* banuser() {
     this.userverif.getUserVerification(id).subscribe((data) => {
       data.banned = true;
       this.userverif.updateUserVerification(data).subscribe(() => {
         console.log('User banned');
       });
     });
   }*/
  banuser(user : Kuser) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'do you want to ban the user ?',
        text: user.firstName +' '+user.lastName ,
        icon: 'warning',
        confirmButtonText: 'Unban!',
        cancelButtonText: 'Ban!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Unbanned!',
            user.firstName +' '+user.lastName +' have been unbanned.',
            'success'
          );
          this.userverif.getUserVerification(user.id).subscribe((data) => {
            data.banned = false;
            this.userverif.updateUserVerification(data).subscribe(() => {
              console.log('User Unbanned');
            });
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Banned',
            user.firstName +' '+user.lastName +' have been banned.',
            'error'
          );
          this.userverif.getUserVerification(user.id).subscribe((data) => {
            data.banned = true;
            this.userverif.updateUserVerification(data).subscribe(() => {
              console.log('User banned');
            });
          });
        }
      });
  }
  async isuserbanned(id: string) {
    let userverif: UserVerif;
    userverif = await this.userverif.getUserVerification(id).toPromise()
    if(userverif.banned == true){
      return true;
    }
    else{
      return false;
    }
  }
}
