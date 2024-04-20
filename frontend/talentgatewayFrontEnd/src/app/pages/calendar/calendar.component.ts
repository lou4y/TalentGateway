import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { InterviewService } from '../../services/interview.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  modalRef?: BsModalRef;

  breadCrumbItems: Array<{}>;

  @ViewChild('modalShow') modalShow: TemplateRef<any>;
  @ViewChild('editmodalShow') editmodalShow: TemplateRef<any>;

  formEditData: UntypedFormGroup;
  submitted = false;
  category: any[];
  newEventDate: any;
  editEvent: any;
  user: any;
  calendarEvents: any[];
  private calendarApi: any;
  formData: UntypedFormGroup;
  interviewDates: Date[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    events: [], // Assign calendarEvents to events property
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: true
    },
  };
  currentEvents: EventApi[] = [];

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private interviewService: InterviewService,
    private authService: AuthenticationService
  ) {}

  get form() {
    return this.formData.controls;
  }

  ngOnInit() {
    this.getAllApplications();
  }

  transformInterviewDates(interviewDates: Date[]): any[] {
    return interviewDates.map(date => {
      const startDateTime = new Date(date);
      const endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000));
      return {
        title: 'Interview',
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString()
      };
    });
  }

  getAllApplications(): void {
    this.authService.currentUser().then(user => {
      this.user = user;
      this.interviewService.getUserApplications(this.user.id).subscribe(
        (data: any[]) => {
          this.interviewDates = data.map(application => application.interview?.dateEntretien || null).filter(date => date !== null);
          if (this.interviewDates.length > 0) {
            console.log('Dates d\'entretien récupérées :', this.interviewDates);
            const transformedInterviewDates = this.transformInterviewDates(this.interviewDates);
            console.log('Transformed Interview Dates:', transformedInterviewDates);
            this.calendarEvents = transformedInterviewDates; // Assign transformed interview dates to calendarEvents array
            this.calendarOptions.events = this.calendarEvents; // Assign calendarEvents to events property
          } else {
            console.log('Aucune date d\'entretien récupérée.');
          }
        },
        (error) => {
          console.error('Error fetching user applications:', error);
        }
      );
    });
  }
}
